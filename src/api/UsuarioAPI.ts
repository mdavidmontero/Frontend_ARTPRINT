import {
  getAuth,
  createUserWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";
import {
  DocumentData,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  DocumentSnapshot,
  query,
  orderBy,
  QuerySnapshot,
  getDocs,
  getDoc,
  collection,
} from "firebase/firestore";
import { Usuario } from "../types";
import { db } from "../config/firebase";

export async function crearUsuario(usuario: Usuario): Promise<void> {
  try {
    const docuRef = doc(db, `usuarios/${usuario.id}`);
    await setDoc(docuRef, usuario);
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw error;
  }
}

export async function crearUsuarioYAutenticacion(
  usuario: Usuario,
  password: string
): Promise<void> {
  let userCredential: UserCredential | null = null;
  try {
    const auth = getAuth();
    userCredential = await createUserWithEmailAndPassword(
      auth,
      usuario.correo,
      password
    );

    if (userCredential.user) {
      const { uid } = userCredential.user;
      const usuarioConId: Usuario = { ...usuario, id: uid };
      const docRef = doc(db, "usuarios", uid);
      await setDoc(docRef, usuarioConId);
    }
  } catch (error) {
    if (userCredential && userCredential.user) {
      await userCredential.user.delete();
    }
    console.error("Error al crear usuario y autenticación:", error);
    throw error;
  }
}

export async function obtenerUsuarioPorId(
  userId: string
): Promise<Usuario | null> {
  try {
    const userDocRef = doc(db, "usuarios", userId);
    const userDocSnap: DocumentSnapshot<DocumentData> = await getDoc(
      userDocRef
    );
    if (userDocSnap.exists()) {
      return userDocSnap.data() as Usuario;
    } else {
      console.error("No se encontró el usuario con el ID:", userId);
      return null;
    }
  } catch (error) {
    console.error("Error al obtener usuario por ID:", error);
    throw error;
  }
}

export async function actualizarUsuario(
  userId: string,
  newData: Partial<Usuario>
): Promise<void> {
  try {
    const userDocRef = doc(db, "usuarios", userId);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      await updateDoc(userDocRef, newData);
    } else {
      console.error("No se encontró el usuario con el ID:", userId);
      throw new Error("Usuario no encontrado");
    }
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    throw error;
  }
}

export async function eliminarUsuario(userId: string): Promise<void> {
  try {
    const userDoc = doc(db, "usuarios", userId);
    await deleteDoc(userDoc);
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    throw error;
  }
}

export async function obtenerUsuarios(): Promise<Usuario[] | null> {
  try {
    const usuariosRef = collection(db, "usuarios");
    const q = query(usuariosRef, orderBy("createdAt"));
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
    const usuarios: Usuario[] = querySnapshot.docs.map(
      (doc) => doc.data() as Usuario
    );
    return usuarios;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return null;
  }
}
