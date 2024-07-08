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
import { Color } from "../types";
import { db } from "../config/firebase";

const coloresRef = collection(db, "colores");

export async function crearColor(color: Color): Promise<void> {
  try {
    const docRef = await addDoc(coloresRef, color);
    await updateDoc(docRef, { id: docRef.id });
  } catch (error) {
    console.error("Error al crear color:", error);
    throw error;
  }
}

export async function obtenerColorPorId(
  colorId: string
): Promise<Color | null> {
  try {
    const colorDocRef = doc(db, "colores", colorId);
    const colorDocSnap = await getDoc(colorDocRef);
    if (colorDocSnap.exists()) {
      return colorDocSnap.data() as Color;
    } else {
      console.error("No se encontró el color con el ID:", colorId);
      return null;
    }
  } catch (error) {
    console.error("Error al obtener color por ID:", error);
    throw error;
  }
}

export async function actualizarColor(
  colorId: string,
  newData: Partial<Color>
): Promise<void> {
  try {
    const colorDoc = doc(coloresRef, "colores", colorId);
    await updateDoc(colorDoc, newData);
  } catch (error) {
    console.error("Error al actualizar color:", error);
    throw error;
  }
}

export async function eliminarColor(colorId: string): Promise<void> {
  try {
    const colorDoc = doc(coloresRef, "colores", colorId);
    await deleteDoc(colorDoc);
  } catch (error) {
    console.error("Error al eliminar color:", error);
    throw error;
  }
}

export async function obtenerTodosLosColores(): Promise<Color[]> {
  try {
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
      coloresRef
    );
    const colores: Color[] = [];
    querySnapshot.forEach((doc) => {
      colores.push(doc.data() as Color);
    });
    return colores;
  } catch (error) {
    console.error("Error al obtener todos los colores:", error);
    throw error;
  }
}
