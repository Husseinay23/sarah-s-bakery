import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export async function uploadFile(
  file: File,
  path: string,
): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export function getStoragePath(folder: string, fileName: string): string {
  const safeName = fileName.replace(/[^a-zA-Z0-9.-]/g, "-");
  return `${folder}/${Date.now()}-${safeName}`;
}
