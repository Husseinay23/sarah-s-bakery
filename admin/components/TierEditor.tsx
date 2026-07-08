"use client";

import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { PackageTier } from "@/lib/types";

type TierDraft = Omit<PackageTier, "id">;

export function TierEditor() {
  const [tiers, setTiers] = useState<PackageTier[]>([]);
  const [drafts, setDrafts] = useState<Record<string, TierDraft>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "packageTiers"), orderBy("pieceCount", "asc"));
    return onSnapshot(q, (snap) => {
      const next = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<PackageTier, "id">) }));
      setTiers(next);
      setDrafts(
        Object.fromEntries(
          next.map((t) => [
            t.id,
            {
              pieceCount: t.pieceCount,
              classicPrice: t.classicPrice,
              otherFlavorPrice: t.otherFlavorPrice,
              freeDelivery: t.freeDelivery,
            },
          ]),
        ),
      );
    });
  }, []);

  const updateDraft = (id: string, data: Partial<TierDraft>) => {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], ...data } }));
  };

  const isDirty = (tier: PackageTier) => {
    const draft = drafts[tier.id];
    if (!draft) return false;
    return (
      draft.classicPrice !== tier.classicPrice ||
      draft.otherFlavorPrice !== tier.otherFlavorPrice ||
      draft.freeDelivery !== tier.freeDelivery
    );
  };

  const saveTier = async (id: string) => {
    const draft = drafts[id];
    if (!draft) return;
    setSaving(id);
    await updateDoc(doc(db, "packageTiers", id), {
      classicPrice: draft.classicPrice,
      otherFlavorPrice: draft.otherFlavorPrice,
      freeDelivery: draft.freeDelivery,
    });
    setSaving(null);
  };

  return (
    <div>
      <p className="mb-4 text-sm text-espresso/60">
        Edit prices below, then click Save on each row. Changes are not live until saved.
      </p>
      <div className="overflow-x-auto rounded-2xl border border-cinnamon/20 bg-white">
        <table className="min-w-full text-sm">
          <thead className="border-b border-cinnamon/20 bg-blush/30">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Pieces</th>
              <th className="px-4 py-3 text-left font-medium">Classic price</th>
              <th className="px-4 py-3 text-left font-medium">Other flavors price</th>
              <th className="px-4 py-3 text-left font-medium">Free delivery</th>
              <th className="px-4 py-3 text-left font-medium" />
            </tr>
          </thead>
          <tbody>
            {tiers.map((tier) => {
              const draft = drafts[tier.id];
              if (!draft) return null;
              const dirty = isDirty(tier);

              return (
                <tr key={tier.id} className="border-b border-cinnamon/10">
                  <td className="px-4 py-3 font-medium">{tier.pieceCount}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={draft.classicPrice}
                      onChange={(e) =>
                        updateDraft(tier.id, { classicPrice: Number(e.target.value) })
                      }
                      className="w-24 rounded-lg border border-cinnamon/20 px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={draft.otherFlavorPrice}
                      onChange={(e) =>
                        updateDraft(tier.id, { otherFlavorPrice: Number(e.target.value) })
                      }
                      className="w-24 rounded-lg border border-cinnamon/20 px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={draft.freeDelivery}
                      onChange={(e) => updateDraft(tier.id, { freeDelivery: e.target.checked })}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => saveTier(tier.id)}
                      disabled={!dirty || saving === tier.id}
                      className="rounded-lg bg-espresso px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40"
                    >
                      {saving === tier.id ? "Saving..." : "Save"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
