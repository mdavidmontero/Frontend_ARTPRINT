import {
  collection,
  addDoc,
  DocumentData,
  doc,
  updateDoc,
  QuerySnapshot,
  getDocs,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { Talla } from "../types";

import { db } from "../config/firebase";
const tallasRef = collection(db, "tallas");

async function crearTalla(talla: Talla): Promise<void> {
  try {
    const docRef = await addDoc(tallasRef, talla);
    await updateDoc(docRef, { id: docRef.id });
  } catch (error) {
    console.error("Error al crear talla:", error);
    throw error;
  }
}

async function obtenerTallaPorId(tallaId: string): Promise<Talla | null> {
  try {
    const tallaDocRef = doc(db, "tallas", tallaId);
    const tallaDocSnap = await getDoc(tallaDocRef);
    if (tallaDocSnap.exists()) {
      return tallaDocSnap.data() as Talla;
    } else {
      console.error("No se encontró la talla con el ID:", tallaId);
      return null;
    }
  } catch (error) {
    console.error("Error al obtener talla por ID:", error);
    throw error;
  }
}

async function actualizarTalla(
  tallaId: string,
  newData: Partial<Talla>
): Promise<void> {
  try {
    const tallaDoc = doc(db, "tallas", tallaId);
    await updateDoc(tallaDoc, newData);
  } catch (error) {
    console.error("Error al actualizar talla:", error);
    throw error;
  }
}

async function eliminarTalla(tallaId: string): Promise<void> {
  try {
    const tallaDoc = doc(db, "tallas", tallaId);
    await deleteDoc(tallaDoc);
  } catch (error) {
    console.error("Error al eliminar talla:", error);
    throw error;
  }
}

async function obtenerTodasLasTallas(): Promise<Talla[]> {
  try {
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(tallasRef);
    const tallas: Talla[] = [];
    querySnapshot.forEach((doc) => {
      tallas.push(doc.data() as Talla);
    });
    return tallas;
  } catch (error) {
    console.error("Error al obtener todas las tallas:", error);
    throw error;
  }
}

export {
  crearTalla,
  obtenerTallaPorId,
  actualizarTalla,
  eliminarTalla,
  obtenerTodasLasTallas,
};
