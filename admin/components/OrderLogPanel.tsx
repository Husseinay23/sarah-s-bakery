"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { updateOrderStatus } from "@/lib/orderStatus";
import type { OrderLog } from "@/lib/types";

export function OrderLogPanel() {
  const [orders, setOrders] = useState<OrderLog[]>([]);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      setOrders(
        snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            type: data.type,
            items: data.items,
            total: data.total,
            pieceCount: data.pieceCount,
            deliveryNote: data.deliveryNote,
            message: data.message,
            status: data.status ?? "pending",
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            customerAddress: data.customerAddress,
            customerNotes: data.customerNotes,
            preferredDate: data.preferredDate,
            createdAt:
              data.createdAt instanceof Timestamp
                ? data.createdAt.toDate()
                : new Date(),
          };
        }),
      );
    });
  }, []);

  const markReviewed = async (orderId: string) => {
    await updateOrderStatus(orderId, "reviewed");
  };

  if (orders.length === 0) {
    return (
      <p className="rounded-2xl border border-cinnamon/20 bg-white p-8 text-center text-espresso/60">
        No orders logged yet. Orders appear here when customers tap &quot;Send Order on WhatsApp.&quot;
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <article
          key={order.id}
          className="rounded-2xl border border-cinnamon/20 bg-white p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium capitalize text-espresso">
                {order.type === "cart" ? "Full cart order" : order.type.replace("-", " ")} · $
                {order.total}
              </p>
              <p className="text-sm text-espresso/60">
                {order.createdAt.toLocaleString()}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                order.status === "reviewed"
                  ? "bg-green-100 text-green-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {order.status}
            </span>
          </div>

          {(order.customerName || order.customerPhone) && (
            <div className="mt-3 rounded-xl bg-blush/30 px-3 py-2.5 text-sm text-espresso/80">
              {order.customerName && <p>Name: {order.customerName}</p>}
              {order.customerPhone && <p>Phone: {order.customerPhone}</p>}
              {order.customerAddress && <p>Address: {order.customerAddress}</p>}
              {order.customerNotes && <p>Notes: {order.customerNotes}</p>}
            </div>
          )}

          <ul className="mt-3 space-y-1 text-sm text-espresso/80">
            {order.items.map((item) => (
              <li key={item.flavorId}>
                {item.quantity}x {item.flavorName}
              </li>
            ))}
          </ul>

          <pre className="mt-4 overflow-x-auto rounded-xl bg-cream p-3 text-xs whitespace-pre-wrap text-espresso/80">
            {order.message}
          </pre>

          {order.status === "pending" && (
            <button
              type="button"
              onClick={() => markReviewed(order.id)}
              className="mt-4 rounded-full bg-espresso px-4 py-2 text-sm font-medium text-white"
            >
              Mark as reviewed
            </button>
          )}
        </article>
      ))}
    </div>
  );
}
