import { Usuario } from "../types";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { auth } from "../config/firebase";

export async function authenticateUser(usuario: Usuario): Promise<void> {
  try {
    const docRef = doc(db, `usuarios/${usuario.id}`);
    await setDoc(docRef, usuario);
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw error;
  }
}

export const getCurrentUser = async () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};
