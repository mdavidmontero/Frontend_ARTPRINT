import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { auth, db } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
  onAuthStateChanged,
} from "firebase/auth";
import { Usuario } from "../types";

type User = {
  uid: string;
  email: string | null;
  role?: string | null;
} | null;

type AuthState = {
  user: User;
  isLoading: boolean;
  registerUser: (
    email: string,
    password: string,
    userData: Omit<Usuario, "id" | "createdAt" | "updatedAt">
  ) => Promise<string>;
  loginUser: (email: string, password: string) => Promise<UserCredential>;
  logOutUser: () => Promise<void>;
  setUser: (user: User) => void;
  setLoading: (isLoading: boolean) => void;
  onAuthStateChanged: (callback: (user: User | null) => void) => () => void;
};

export const useAuthStores = create<AuthState>()(
  devtools((set) => ({
    user: null,
    isLoading: true,
    setUser: (user: User) => set({ user }),
    setLoading: (isLoading: boolean) => set({ isLoading }),

    registerUser: async (email, password, userData) => {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUser: Usuario = {
        id: userCredential.user.uid,
        ...userData,
        correo: email,
        createdAt: new Date(),
        updatedAt: new Date(),
        fotoPerfil: "",
      };
      await setDoc(doc(db, `usuarios/${newUser.id}`), newUser);
      return userCredential.user.uid;
    },

    loginUser: async (email, password) =>
      await signInWithEmailAndPassword(auth, email, password),

    logOutUser: async () => {
      await signOut(auth);
      set({ user: null });
    },

    onAuthStateChanged: (callback) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userDoc = await getDoc(doc(db, `usuarios/${user.uid}`));
          const userData = userDoc.data();
          set({
            user: { ...user, role: userData?.rol || null },
            isLoading: false,
          });
        } else {
          set({ user: null, isLoading: false });
        }
        callback(user);
      });
      return unsubscribe;
    },
  }))
);

// Run the onAuthStateChanged listener once when the store is created
useAuthStores.getState().onAuthStateChanged(() => {});
