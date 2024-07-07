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
import { Material } from "../types";
import { db } from "../config/firebase";

const materialesRef = collection(db, "materiales");

export async function crearMaterial(material: Material): Promise<void> {
  try {
    const docRef = await addDoc(materialesRef, material);
    await updateDoc(docRef, { id: docRef.id });
  } catch (error) {
    console.error("Error al crear material:", error);
    throw error;
  }
}

export async function obtenerMaterialPorId(
  materialId: string
): Promise<Material | null> {
  try {
    const materialDocRef = doc(db, "materiales", materialId);
    const materialDocSnap = await getDoc(materialDocRef);
    if (materialDocSnap.exists()) {
      return materialDocSnap.data() as Material;
    } else {
      console.error("No se encontró el material con el ID:", materialId);
      return null;
    }
  } catch (error) {
    console.error("Error al obtener material por ID:", error);
    throw error;
  }
}

export async function actualizarMaterial(
  materialId: string,
  newData: Partial<Material>
): Promise<void> {
  try {
    const materialDoc = doc(materialesRef, "materiales", materialId);
    await updateDoc(materialDoc, newData);
  } catch (error) {
    console.error("Error al actualizar material:", error);
    throw error;
  }
}

export async function eliminarMaterial(materialId: string): Promise<void> {
  try {
    const materialDoc = doc(materialesRef, "materiales", materialId);
    await deleteDoc(materialDoc);
  } catch (error) {
    console.error("Error al eliminar material:", error);
    throw error;
  }
}

export async function obtenerTodosLosMateriales(): Promise<Material[]> {
  try {
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
      materialesRef
    );
    const materiales: Material[] = [];
    querySnapshot.forEach((doc) => {
      materiales.push(doc.data() as Material);
    });
    return materiales;
  } catch (error) {
    console.error("Error al obtener todos los materiales:", error);
    throw error;
  }
}
