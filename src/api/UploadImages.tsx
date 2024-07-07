import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";
import { v4 as uuidv4 } from "uuid";

export const useImageUpload = async (file: File) => {
  try {
    const storageRef = ref(storage, `images/${uuidv4()}`);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    console.log("File uploaded successfully. URL:", url);
    return url;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
