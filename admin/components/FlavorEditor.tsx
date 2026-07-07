"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadFile, getStoragePath } from "@/lib/uploadFile";
import type { Flavor } from "@/lib/types";

export function FlavorEditor() {
  const [flavors, setFlavors] = useState<Flavor[]>([]);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "flavors"), orderBy("sortOrder", "asc"));
    return onSnapshot(q, (snap) => {
      setFlavors(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Flavor, "id">) })),
      );
    });
  }, []);

  const updateFlavor = async (id: string, data: Partial<Flavor>) => {
    setSaving(id);
    await updateDoc(doc(db, "flavors", id), data);
    setSaving(null);
  };

  const moveFlavor = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= flavors.length) return;

    const batch = writeBatch(db);
    const a = flavors[index];
    const b = flavors[target];

    batch.update(doc(db, "flavors", a.id), { sortOrder: b.sortOrder });
    batch.update(doc(db, "flavors", b.id), { sortOrder: a.sortOrder });
    await batch.commit();
  };

  const handleImageUpload = async (id: string, file: File) => {
    setSaving(id);
    const url = await uploadFile(file, getStoragePath("flavors", file.name));
    await updateDoc(doc(db, "flavors", id), { imageUrl: url });
    setSaving(null);
  };

  return (
    <div className="space-y-4">
      {flavors.map((flavor, index) => (
        <div
          key={flavor.id}
          className="rounded-2xl border border-cinnamon/20 bg-white p-4 sm:p-5"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-blush">
              {flavor.imageUrl ? (
                <Image src={flavor.imageUrl} alt={flavor.name} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-2xl">🥐</div>
              )}
            </div>

            <div className="grid flex-1 gap-3 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="mb-1 block font-medium">Name</span>
                <input
                  value={flavor.name}
                  onChange={(e) => updateFlavor(flavor.id, { name: e.target.value })}
                  className="w-full rounded-lg border border-cinnamon/20 px-3 py-2"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium">Price / piece</span>
                <input
                  type="number"
                  value={flavor.pricePerPiece}
                  onChange={(e) =>
                    updateFlavor(flavor.id, { pricePerPiece: Number(e.target.value) })
                  }
                  className="w-full rounded-lg border border-cinnamon/20 px-3 py-2"
                />
              </label>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={flavor.active}
                onChange={(e) => updateFlavor(flavor.id, { active: e.target.checked })}
              />
              Active
            </label>

            <label className="cursor-pointer rounded-lg border border-cinnamon/30 px-3 py-1.5 text-sm hover:bg-blush/40">
              Upload photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(flavor.id, file);
                }}
              />
            </label>

            <button
              type="button"
              onClick={() => moveFlavor(index, -1)}
              disabled={index === 0}
              className="rounded-lg border px-2 py-1 text-sm disabled:opacity-30"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => moveFlavor(index, 1)}
              disabled={index === flavors.length - 1}
              className="rounded-lg border px-2 py-1 text-sm disabled:opacity-30"
            >
              ↓
            </button>

            {saving === flavor.id && (
              <span className="text-xs text-espresso/50">Saving...</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
