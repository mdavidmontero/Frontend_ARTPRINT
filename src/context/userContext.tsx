import { createContext, useEffect, useState, ReactNode } from "react";
import { auth, db } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Usuario } from "../types";
import { authenticateUser } from "../api/AuthAPI";

type AuthContextProps = {
  children: ReactNode;
};

export type User = {
  uid: string;
  email: string | null;
  role?: string | null;
} | null;

type AuthContextType = {
  user: User;
  registerUser: (
    email: string,
    password: string,
    userData: Omit<Usuario, "id" | "createdAt" | "updatedAt">
  ) => Promise<string>;
  loginUser: (email: string, password: string) => Promise<UserCredential>;
  logOutUser: () => Promise<void>;
  cargando: boolean;
  setUser: React.Dispatch<React.SetStateAction<User>>;
};

export const UserContext = createContext<AuthContextType | undefined>(
  undefined
);

const UserProvider = ({ children }: AuthContextProps) => {
  const [user, setUser] = useState<User>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCargando(false);
        return;
      }
      try {
        const { uid, email } = user;
        const userDoc = await getDoc(doc(db, `usuarios/${uid}`));
        const userData = userDoc.data();
        setUser({ uid, email, role: userData?.rol || null });
      } catch (error) {
        setUser(null);
      }
      setCargando(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const registerUser = async (
    email: string,
    password: string,
    userData: Omit<Usuario, "id" | "createdAt" | "updatedAt">
  ): Promise<string> => {
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
    await authenticateUser(newUser);
    console.log(userCredential);
    return userCredential.user.uid;
  };

  const loginUser = async (email: string, password: string) =>
    await signInWithEmailAndPassword(auth, email, password);

  const logOutUser = () => {
    setUser(null);
    return signOut(auth);
  };

  return (
    <UserContext.Provider
      value={{ user, registerUser, loginUser, logOutUser, cargando, setUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
