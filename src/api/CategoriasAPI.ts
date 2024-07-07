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
import { Categoria } from "../types";
import { db } from "../config/firebase";

const categoriasRef = collection(db, "categorias");

export const crearCategoria = async (categoria: Categoria): Promise<void> => {
  try {
    const docRef = await addDoc(categoriasRef, categoria);
    await updateDoc(docRef, { id: docRef.id });
  } catch (error) {
    console.error("Error al crear categoría:", error);
    throw error;
  }
};

export const obtenerCategoriaPorId = async (
  categoriaId: string
): Promise<Categoria | null> => {
  try {
    const categoriaDocRef = doc(db, "categorias", categoriaId);
    const categoriaDocSnap = await getDoc(categoriaDocRef);
    if (categoriaDocSnap.exists()) {
      return categoriaDocSnap.data() as Categoria;
    } else {
      console.error("No se encontró la categoría con el ID:", categoriaId);
      return null;
    }
  } catch (error) {
    console.error("Error al obtener categoría por ID:", error);
    throw error;
  }
};

export const actualizarCategoria = async (
  categoriaId: string,
  newData: Partial<Categoria>
): Promise<void> => {
  try {
    const categoriaDoc = doc(db, "categorias", categoriaId);
    await updateDoc(categoriaDoc, newData);
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    throw error;
  }
};

export const eliminarCategoria = async (categoriaId: string): Promise<void> => {
  try {
    const categoriaDoc = doc(db, "categorias", categoriaId);
    await deleteDoc(categoriaDoc);
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    throw error;
  }
};

export const obtenerTodasLasCategorias = async (): Promise<Categoria[]> => {
  try {
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
      categoriasRef
    );
    const categorias: Categoria[] = [];
    querySnapshot.forEach((doc) => {
      categorias.push(doc.data() as Categoria);
    });
    return categorias;
  } catch (error) {
    console.error("Error al obtener todas las categorías:", error);
    throw error;
  }
};
