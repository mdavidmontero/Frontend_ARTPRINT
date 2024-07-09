import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  deleteDoc,
  query,
  orderBy,
  getDocs,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { Producto, Color } from "../types";
import { db } from "../config/firebase";

const productosRef = collection(db, "productos");

export const crearProducto = async (producto: Producto): Promise<void> => {
  try {
    const docRef = await addDoc(productosRef, producto);
    await updateDoc(docRef, { id: docRef.id }); // Actualiza el producto con el ID generado por Firebase
  } catch (error) {
    console.error("Error al crear producto:", error);
    throw error;
  }
};

export const obtenerProductoPorId = async (
  productId: string
): Promise<Producto | null> => {
  try {
    const productoDocRef = doc(db, "productos", productId);
    const productoDocSnap = await getDoc(productoDocRef);
    if (productoDocSnap.exists()) {
      return productoDocSnap.data() as Producto;
    } else {
      console.error("No se encontró el producto con el ID:", productId);
      return null;
    }
  } catch (error) {
    console.error("Error al obtener producto por ID:", error);
    throw error;
  }
};

export const actualizarProducto = async (
  productId: string,
  newData: Partial<Producto>
): Promise<void> => {
  try {
    const productoDoc = doc(db, "productos", productId);
    await updateDoc(productoDoc, newData);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    throw error;
  }
};

export const eliminarProducto = async (productId: string): Promise<void> => {
  try {
    const productoDoc = doc(db, "productos", productId);
    await deleteDoc(productoDoc);
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    throw error;
  }
};

export const obtenerProductos = async (): Promise<Producto[] | null> => {
  try {
    const q = query(productosRef, orderBy("precio"));
    const querySnapshot = await getDocs(q);
    const productos: Producto[] = querySnapshot.docs.map(
      (doc) => doc.data() as Producto
    );
    return productos;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return null;
  }
};

export const agregarColor = async (
  productId: string,
  color: Color
): Promise<void> => {
  try {
    const productoDoc = doc(db, "productos", productId);
    await updateDoc(productoDoc, {
      colores: arrayUnion(color),
    });
  } catch (error) {
    console.error("Error al agregar color al producto:", error);
    throw error;
  }
};

export const eliminarColor = async (
  productId: string,
  color: Color
): Promise<void> => {
  try {
    const productoDoc = doc(db, "productos", productId);
    await updateDoc(productoDoc, {
      colores: arrayRemove(color),
    });
  } catch (error) {
    console.error("Error al eliminar color del producto:", error);
    throw error;
  }
};
