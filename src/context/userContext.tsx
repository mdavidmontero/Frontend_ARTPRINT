import { createContext, useEffect, useState, ReactNode } from "react";
import { auth } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from "firebase/auth";

import { Usuario } from "../types";
import { authenticateUser } from "../api/AuthAPI";

type AuthContextProps = {
  children: ReactNode;
};

type User = {
  uid: string;
  email: string | null;
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
};

export const UserContext = createContext<AuthContextType | undefined>(
  undefined
);

const UserProvider = ({ children }: AuthContextProps) => {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email } = user;
        setUser({ uid, email });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
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
    return userCredential.user.uid;
  };

  const loginUser = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);

  const logOutUser = () => signOut(auth);

  return (
    <UserContext.Provider value={{ user, registerUser, loginUser, logOutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
