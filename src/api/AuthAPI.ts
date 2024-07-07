import { Usuario } from "../types";
import { doc, getDoc, setDoc } from "firebase/firestore";
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

export const getCurrentUser = async (): Promise<any> => {
  const user = auth.currentUser;
  if (user) {
    try {
      const userDoc = await getDoc(doc(db, `usuarios/${user.uid}`));
      const userData = userDoc.data();
      const role = userData?.rol || null;
      return { ...user, role };
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      throw error;
    }
  } else {
    return null;
  }
};
