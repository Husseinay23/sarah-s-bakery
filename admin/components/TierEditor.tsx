"use client";

import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { PackageTier } from "@/lib/types";

export function TierEditor() {
  const [tiers, setTiers] = useState<PackageTier[]>([]);

  useEffect(() => {
    const q = query(collection(db, "packageTiers"), orderBy("pieceCount", "asc"));
    return onSnapshot(q, (snap) => {
      setTiers(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<PackageTier, "id">) })),
      );
    });
  }, []);

  const updateTier = async (id: string, data: Partial<PackageTier>) => {
    await updateDoc(doc(db, "packageTiers", id), data);
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-cinnamon/20 bg-white">
      <table className="min-w-full text-sm">
        <thead className="border-b border-cinnamon/20 bg-blush/30">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Pieces</th>
            <th className="px-4 py-3 text-left font-medium">Classic price</th>
            <th className="px-4 py-3 text-left font-medium">Other flavors price</th>
            <th className="px-4 py-3 text-left font-medium">Free delivery</th>
          </tr>
        </thead>
        <tbody>
          {tiers.map((tier) => (
            <tr key={tier.id} className="border-b border-cinnamon/10">
              <td className="px-4 py-3 font-medium">{tier.pieceCount}</td>
              <td className="px-4 py-3">
                <input
                  type="number"
                  value={tier.classicPrice}
                  onChange={(e) =>
                    updateTier(tier.id, { classicPrice: Number(e.target.value) })
                  }
                  className="w-24 rounded-lg border border-cinnamon/20 px-2 py-1"
                />
              </td>
              <td className="px-4 py-3">
                <input
                  type="number"
                  value={tier.otherFlavorPrice}
                  onChange={(e) =>
                    updateTier(tier.id, { otherFlavorPrice: Number(e.target.value) })
                  }
                  className="w-24 rounded-lg border border-cinnamon/20 px-2 py-1"
                />
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={tier.freeDelivery}
                  onChange={(e) => updateTier(tier.id, { freeDelivery: e.target.checked })}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
