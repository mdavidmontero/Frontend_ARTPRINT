import {
  collection,
  addDoc,
  DocumentData,
  doc,
  updateDoc,
  deleteDoc,
  DocumentSnapshot,
  query,
  orderBy,
  getDocs,
  getDoc,
  where,
  QuerySnapshot,
} from "firebase/firestore";
import { Prenda } from "../types";
import { db } from "../config/firebase";

const prendasRef = collection(db, "prendas");

export const crearPrenda = async (prenda: Prenda): Promise<void> => {
  try {
    const docRef = await addDoc(prendasRef, prenda);
    await updateDoc(docRef, { id: docRef.id });
  } catch (error) {
    console.error("Error al crear prenda:", error);
    throw error;
  }
};

export const obtenerPrendaPorId = async (
  prendaId: string
): Promise<Prenda | null> => {
  try {
    const prendaDocRef = doc(db, "prendas", prendaId);
    const prendaDocSnap: DocumentSnapshot<DocumentData> = await getDoc(
      prendaDocRef
    );
    if (prendaDocSnap.exists()) {
      return prendaDocSnap.data() as Prenda;
    } else {
      console.error("No se encontró la prenda con el ID:", prendaId);
      return null;
    }
  } catch (error) {
    console.error("Error al obtener prenda por ID:", error);
    throw error;
  }
};

export const actualizarPrenda = async (
  prendaId: string,
  newData: Partial<Prenda>
): Promise<void> => {
  try {
    const prendaDoc = doc(db, "prendas", prendaId);
    await updateDoc(prendaDoc, newData);
  } catch (error) {
    console.error("Error al actualizar prenda:", error);
    throw error;
  }
};

export const eliminarPrenda = async (prendaId: string): Promise<void> => {
  try {
    const prendaDoc = doc(db, "prendas", prendaId);
    await deleteDoc(prendaDoc);
  } catch (error) {
    console.error("Error al eliminar prenda:", error);
    throw error;
  }
};

export const obtenerPrendas = async (): Promise<Prenda[] | null> => {
  try {
    const q = query(prendasRef, orderBy("createdAt"));
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
    const prendas: Prenda[] = querySnapshot.docs.map(
      (doc) => doc.data() as Prenda
    );
    return prendas;
  } catch (error) {
    console.error("Error al obtener prendas:", error);
    return null;
  }
};

export const obtenerPrendasPorCategoria = async (
  categoriaId: string
): Promise<Prenda[]> => {
  try {
    const q = query(prendasRef, where("idCategoria", "==", categoriaId));
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
    const prendas: Prenda[] = querySnapshot.docs.map(
      (doc) => doc.data() as Prenda
    );
    return prendas;
  } catch (error) {
    console.error("Error al obtener prendas por categoría:", error);
    throw error;
  }
};
