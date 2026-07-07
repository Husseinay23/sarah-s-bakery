"use client";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import type { OrderItem } from "./types";

interface LogOrderInput {
  type: "package" | "mini-box";
  items: OrderItem[];
  total: number;
  pieceCount?: number;
  deliveryNote: string;
  message: string;
}

export async function logOrder(input: LogOrderInput): Promise<void> {
  await addDoc(collection(db, "orders"), {
    ...input,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}
