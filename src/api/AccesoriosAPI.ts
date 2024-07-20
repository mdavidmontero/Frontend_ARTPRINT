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
import { db, storage } from "../config/firebase";
import { Estampado } from "../types/index";
import { deleteObject, ref } from "firebase/storage";

const estampadosRef = collection(db, "estampados");

export async function crearEstampado(estampado: Estampado): Promise<void> {
  try {
    const docRef = await addDoc(estampadosRef, estampado);
    await updateDoc(docRef, { id: docRef.id });
  } catch (error) {
    console.error("Error al crear el estampado:", error);
    throw error;
  }
}

export async function obtenerEstampadoPorId(
  estampadoId: string
): Promise<Estampado | null> {
  try {
    const estampadoDocRef = doc(db, "estampados", estampadoId);
    const EstampadosDocSnap = await getDoc(estampadoDocRef);
    if (EstampadosDocSnap.exists()) {
      return EstampadosDocSnap.data() as Estampado;
    } else {
      console.error("No se encontró el estampado con el ID:", estampadoId);
      return null;
    }
  } catch (error) {
    console.error("Error al obtener estampado por ID:", error);
    throw error;
  }
}

export async function actualizarEstampado(
  estampadoId: string,
  newData: Partial<Estampado>
): Promise<void> {
  try {
    const estampadoDoc = doc(db, "estampados", estampadoId);
    await updateDoc(estampadoDoc, newData);
  } catch (error) {
    console.error("Error al actualizar estampados:", error);
    throw error;
  }
}

export async function eliminarEstampado(estampadoId: string): Promise<void> {
  try {
    const idEstampado = await obtenerEstampadoPorId(estampadoId);
    const estampadoDoc = doc(db, "estampados", estampadoId);
    const imageRef = ref(storage, idEstampado?.image);
    await deleteDoc(estampadoDoc);
    await deleteObject(imageRef);
  } catch (error) {
    console.error("Error al eliminar el estampado:", error);
    throw error;
  }
}

export async function obtenerTodosLosEstampados(): Promise<Estampado[]> {
  try {
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
      estampadosRef
    );
    const estampados: Estampado[] = [];
    querySnapshot.forEach((doc) => {
      estampados.push(doc.data() as Estampado);
    });
    return estampados;
  } catch (error) {
    console.error("Error al obtener todos los estampados:", error);
    throw error;
  }
}
