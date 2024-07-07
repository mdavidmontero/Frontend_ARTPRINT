import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  DocumentData,
  collection,
} from "firebase/firestore";
import { WhatsApp } from "../types";
import { db } from "../config/firebase";

const whatsappDocRef = collection(db, "config");

const obtenerDocumentoWhatsApp = async (): Promise<DocumentData | null> => {
  try {
    const docRef = doc(whatsappDocRef, "whatsapp");
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error("Error al obtener documento de WhatsApp:", error);
    throw error;
  }
};

export const obtenerNumeroWhatsAppPorIdDefault =
  async (): Promise<WhatsApp | null> => {
    try {
      const docRef = doc(whatsappDocRef, "whatsapp");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: "default",
          phoneNumber: data.phoneNumber,
          countryCode: data.countryCode,
        };
      }
      return null;
    } catch (error) {
      console.error(
        "Error al obtener número de WhatsApp por ID default:",
        error
      );
      throw error;
    }
  };

export const guardarNumeroWhatsApp = async (
  numero: string,
  countryCode: string
): Promise<void> => {
  try {
    const docData = await obtenerDocumentoWhatsApp();
    if (!docData) {
      await crearDocumentoWhatsApp(numero, countryCode);
    } else {
      console.log("El documento de WhatsApp ya existe. Actualizando...");
      await actualizarNumeroWhatsApp(numero, countryCode);
    }
  } catch (error) {
    console.error("Error al guardar número de WhatsApp:", error);
    throw error;
  }
};

export const crearDocumentoWhatsApp = async (
  numero: string,
  countryCode: string
): Promise<void> => {
  try {
    const whatsappData: WhatsApp = {
      id: "default",
      phoneNumber: numero,
      countryCode,
    };
    const docRef = doc(whatsappDocRef, "whatsapp");
    await setDoc(docRef, whatsappData);
  } catch (error) {
    console.error("Error al crear documento de WhatsApp:", error);
    throw error;
  }
};

export const obtenerNumeroWhatsApp = async (): Promise<WhatsApp | null> => {
  try {
    const docData = await obtenerDocumentoWhatsApp();
    return docData ? (docData as WhatsApp) : null;
  } catch (error) {
    console.error("Error al obtener número de WhatsApp:", error);
    throw error;
  }
};

export const actualizarNumeroWhatsApp = async (
  numero: string,
  countryCode: string
): Promise<void> => {
  try {
    const docRef = doc(whatsappDocRef, "whatsapp");
    const whatsappData: WhatsApp = {
      id: "default",
      phoneNumber: numero,
      countryCode,
    };
    await updateDoc(docRef, whatsappData);
  } catch (error) {
    console.error("Error al actualizar número de WhatsApp:", error);
    throw error;
  }
};
