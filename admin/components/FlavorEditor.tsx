"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadFile, getStoragePath } from "@/lib/uploadFile";
import { BUNDLED_FLAVOR_IMAGES } from "@/lib/localImages";
import { flavorIdFromName } from "@/lib/flavorUtils";
import { syncLocalImages } from "@/lib/syncLocalImages";
import { getFlavorImage } from "@/lib/flavorMeta";
import type { Flavor } from "@/lib/types";

const EMPTY_NEW_FLAVOR = {
  name: "",
  pricePerPiece: 5,
  description: "",
  isClassic: false,
  imageUrl: "",
};

export function FlavorEditor() {
  const [flavors, setFlavors] = useState<Flavor[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [newFlavor, setNewFlavor] = useState(EMPTY_NEW_FLAVOR);
  const [creating, setCreating] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

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

  const createFlavor = async () => {
    const name = newFlavor.name.trim();
    if (!name) return;

    setCreating(true);
    try {
      let id = flavorIdFromName(name);
      const existingIds = new Set(flavors.map((f) => f.id));
      if (existingIds.has(id)) {
        let suffix = 2;
        while (existingIds.has(`${id}-${suffix}`)) suffix++;
        id = `${id}-${suffix}`;
      }

      const maxSort = flavors.reduce((max, f) => Math.max(max, f.sortOrder), -1);

      await setDoc(doc(db, "flavors", id), {
        name,
        slug: id,
        description: newFlavor.description.trim(),
        pricePerPiece: newFlavor.pricePerPiece,
        isClassic: newFlavor.isClassic,
        imageUrl: newFlavor.imageUrl,
        active: true,
        sortOrder: maxSort + 1,
      });

      setNewFlavor(EMPTY_NEW_FLAVOR);
    } finally {
      setCreating(false);
    }
  };

  const deleteFlavor = async (flavor: Flavor) => {
    const confirmed = window.confirm(
      `Delete "${flavor.name}"? This cannot be undone. It will also be removed from the Mini Box eligible list.`,
    );
    if (!confirmed) return;

    setSaving(flavor.id);

    const miniBoxRef = doc(db, "miniBox", "config");
    const miniBoxSnap = await getDoc(miniBoxRef);
    if (miniBoxSnap.exists()) {
      const data = miniBoxSnap.data();
      const eligibleFlavorIds = (data.eligibleFlavorIds as string[]).filter(
        (id) => id !== flavor.id,
      );
      await updateDoc(miniBoxRef, { eligibleFlavorIds });
    }

    const settingsRef = doc(db, "settings", "general");
    const settingsSnap = await getDoc(settingsRef);
    if (settingsSnap.exists() && settingsSnap.data().featuredFlavorId === flavor.id) {
      const fallback = flavors.find((f) => f.id !== flavor.id)?.id ?? "";
      await updateDoc(settingsRef, { featuredFlavorId: fallback });
    }

    await deleteDoc(doc(db, "flavors", flavor.id));
    setSaving(null);
  };

  const handleSyncImages = async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const result = await syncLocalImages();
      setSyncMessage(result.message);
    } catch (err) {
      setSyncMessage(err instanceof Error ? err.message : "Sync failed.");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-cinnamon/20 bg-white p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-xl font-semibold">Add new product</h3>
          <button
            type="button"
            onClick={handleSyncImages}
            disabled={syncing}
            className="rounded-full border border-cinnamon/30 px-4 py-2 text-sm font-medium hover:bg-blush/40 disabled:opacity-50"
          >
            {syncing ? "Applying..." : "Apply bundled site images"}
          </button>
        </div>
        {syncMessage && <p className="mb-4 text-sm text-espresso/70">{syncMessage}</p>}
        <p className="mb-4 text-sm text-espresso/60">
          Photos in <code className="text-xs">public/CR/</code> map to flavors by ID. Use
          &quot;Apply bundled site images&quot; to push them to Firestore (and set the hero to
          mini-box.jpeg).
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Name</span>
            <input
              value={newFlavor.name}
              onChange={(e) => setNewFlavor({ ...newFlavor, name: e.target.value })}
              placeholder="Strawberry Cheesecake"
              className="w-full rounded-lg border border-cinnamon/20 px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Price / piece</span>
            <input
              type="number"
              value={newFlavor.pricePerPiece}
              onChange={(e) =>
                setNewFlavor({ ...newFlavor, pricePerPiece: Number(e.target.value) })
              }
              className="w-full rounded-lg border border-cinnamon/20 px-3 py-2"
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1 block font-medium">Description</span>
            <input
              value={newFlavor.description}
              onChange={(e) => setNewFlavor({ ...newFlavor, description: e.target.value })}
              placeholder="Short topping description shown on the site"
              className="w-full rounded-lg border border-cinnamon/20 px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Photo</span>
            <select
              value={newFlavor.imageUrl}
              onChange={(e) => setNewFlavor({ ...newFlavor, imageUrl: e.target.value })}
              className="w-full rounded-lg border border-cinnamon/20 px-3 py-2"
            >
              <option value="">No photo yet</option>
              {BUNDLED_FLAVOR_IMAGES.map((img) => (
                <option key={img.path} value={img.path}>
                  {img.label} ({img.path})
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-end gap-2 text-sm pb-2">
            <input
              type="checkbox"
              checked={newFlavor.isClassic}
              onChange={(e) => setNewFlavor({ ...newFlavor, isClassic: e.target.checked })}
            />
            Classic flavor ($4 tier pricing)
          </label>
        </div>

        <button
          type="button"
          onClick={createFlavor}
          disabled={creating || !newFlavor.name.trim()}
          className="mt-4 rounded-full bg-espresso px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {creating ? "Adding..." : "Add product"}
        </button>
      </section>

      {flavors.map((flavor, index) => (
        <div
          key={flavor.id}
          className="rounded-2xl border border-cinnamon/20 bg-white p-4 sm:p-5"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-blush">
              <Image
                src={getFlavorImage(flavor.id, flavor.imageUrl)}
                alt={flavor.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="grid flex-1 gap-3 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="mb-1 block font-medium">Name</span>
                <input
                  defaultValue={flavor.name}
                  key={`name-${flavor.id}-${flavor.name}`}
                  onBlur={(e) => {
                    const name = e.target.value.trim();
                    if (name && name !== flavor.name) updateFlavor(flavor.id, { name });
                  }}
                  className="w-full rounded-lg border border-cinnamon/20 px-3 py-2"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium">Price / piece</span>
                <input
                  type="number"
                  defaultValue={flavor.pricePerPiece}
                  key={`price-${flavor.id}-${flavor.pricePerPiece}`}
                  onBlur={(e) => {
                    const pricePerPiece = Number(e.target.value);
                    if (pricePerPiece !== flavor.pricePerPiece) {
                      updateFlavor(flavor.id, { pricePerPiece });
                    }
                  }}
                  className="w-full rounded-lg border border-cinnamon/20 px-3 py-2"
                />
              </label>
              <label className="block text-sm sm:col-span-2">
                <span className="mb-1 block font-medium">Description</span>
                <input
                  defaultValue={flavor.description ?? ""}
                  key={`desc-${flavor.id}-${flavor.description}`}
                  onBlur={(e) => {
                    const description = e.target.value.trim();
                    if (description !== (flavor.description ?? "")) {
                      updateFlavor(flavor.id, { description });
                    }
                  }}
                  className="w-full rounded-lg border border-cinnamon/20 px-3 py-2"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium">ID / slug</span>
                <input
                  value={flavor.slug}
                  readOnly
                  className="w-full rounded-lg border border-cinnamon/20 bg-cream/50 px-3 py-2 text-espresso/60"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium">Photo URL</span>
                <select
                  value={flavor.imageUrl}
                  onChange={(e) => updateFlavor(flavor.id, { imageUrl: e.target.value })}
                  className="w-full rounded-lg border border-cinnamon/20 px-3 py-2"
                >
                  <option value="">Use bundled fallback</option>
                  {BUNDLED_FLAVOR_IMAGES.map((img) => (
                    <option key={img.path} value={img.path}>
                      {img.label}
                    </option>
                  ))}
                </select>
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
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={flavor.isClassic}
                onChange={(e) => updateFlavor(flavor.id, { isClassic: e.target.checked })}
              />
              Classic ($4)
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

            <button
              type="button"
              onClick={() => deleteFlavor(flavor)}
              className="rounded-lg border border-red-200 px-3 py-1 text-sm text-red-700 hover:bg-red-50"
            >
              Delete
            </button>

            {saving === flavor.id && (
              <span className="text-xs text-espresso/50">Saving...</span>
            )}
          </div>
        </div>
      ))}

      {flavors.length === 0 && (
        <p className="text-sm text-espresso/60">
          No products yet. Seed menu data or add your first product above.
        </p>
      )}
    </div>
  );
}
