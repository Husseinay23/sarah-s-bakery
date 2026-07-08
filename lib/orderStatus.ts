import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function updateOrderStatus(orderId: string, status: "pending" | "reviewed") {
  await setDoc(doc(db, "orders", orderId), { status }, { merge: true });
}
