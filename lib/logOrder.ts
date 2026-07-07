"use client";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import type { CustomerDetails, OrderItem } from "./types";

interface LogOrderInput {
  type: "package" | "mini-box" | "cart";
  items: OrderItem[];
  total: number;
  pieceCount?: number;
  deliveryNote: string;
  message: string;
  cartItemCount?: number;
  customer?: CustomerDetails;
}

export async function logOrder(input: LogOrderInput): Promise<void> {
  const { customer, ...rest } = input;
  await addDoc(collection(db, "orders"), {
    ...rest,
    customerName: customer?.name?.trim() || null,
    customerPhone: customer?.phone?.trim() || null,
    customerAddress: customer?.address?.trim() || null,
    customerNotes: customer?.notes?.trim() || null,
    preferredDate: customer?.preferredDate || null,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}
