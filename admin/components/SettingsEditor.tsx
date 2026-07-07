"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadFile, getStoragePath } from "@/lib/uploadFile";
import { useFlavors } from "@/lib/useFlavors";
import { HERO_DEFAULT_IMAGE } from "@/lib/localImages";
import type { MiniBoxConfig, SiteSettings } from "@/lib/types";

export function SettingsEditor() {
  const { flavors } = useFlavors();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [miniBox, setMiniBox] = useState<MiniBoxConfig | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, "settings", "general"), (snap) => {
      if (snap.exists()) setSettings(snap.data() as SiteSettings);
    });
    const unsubMini = onSnapshot(doc(db, "miniBox", "config"), (snap) => {
      if (snap.exists()) setMiniBox(snap.data() as MiniBoxConfig);
    });
    return () => {
      unsubSettings();
      unsubMini();
    };
  }, []);

  if (!settings || !miniBox) {
    return <p className="text-espresso/60">Loading settings...</p>;
  }

  const saveSettings = async (data: Partial<SiteSettings>) => {
    setSaving(true);
    await updateDoc(doc(db, "settings", "general"), data);
    setSaving(false);
  };

  const saveMiniBox = async (data: Partial<MiniBoxConfig>) => {
    setSaving(true);
    await updateDoc(doc(db, "miniBox", "config"), data);
    setSaving(false);
  };

  const uploadAsset = async (
    file: File,
    folder: string,
    field: keyof SiteSettings,
  ) => {
    setSaving(true);
    const url = await uploadFile(file, getStoragePath(folder, file.name));
    await saveSettings({ [field]: url } as Partial<SiteSettings>);
    setSaving(false);
  };

  const toggleEligibleFlavor = async (flavorId: string) => {
    const ids = miniBox.eligibleFlavorIds.includes(flavorId)
      ? miniBox.eligibleFlavorIds.filter((id) => id !== flavorId)
      : [...miniBox.eligibleFlavorIds, flavorId];
    await saveMiniBox({ eligibleFlavorIds: ids });
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-cinnamon/20 bg-white p-5">
        <h3 className="mb-4 font-display text-xl font-semibold">Announcements & featured</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={settings.announcementActive}
              onChange={(e) => {
                const announcementActive = e.target.checked;
                setSettings({ ...settings, announcementActive });
                saveSettings({ announcementActive });
              }}
            />
            Show announcement bar on site
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1 block font-medium">Announcement text</span>
            <input
              value={settings.announcementText}
              onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
              onBlur={() => saveSettings({ announcementText: settings.announcementText })}
              placeholder="Eid orders close Thursday"
              className="w-full rounded-lg border border-cinnamon/20 px-3 py-2"
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1 block font-medium">Featured flavor (homepage spotlight)</span>
            <select
              value={settings.featuredFlavorId}
              onChange={(e) => {
                setSettings({ ...settings, featuredFlavorId: e.target.value });
                saveSettings({ featuredFlavorId: e.target.value });
              }}
              className="w-full rounded-lg border border-cinnamon/20 px-3 py-2"
            >
              {flavors.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-cinnamon/20 bg-white p-5">
        <h3 className="mb-4 font-display text-xl font-semibold">Store settings</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Store name</span>
            <input
              value={settings.storeName}
              onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
              onBlur={() => saveSettings({ storeName: settings.storeName })}
              className="w-full rounded-lg border border-cinnamon/20 px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">WhatsApp number</span>
            <input
              value={settings.whatsappNumber}
              onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
              onBlur={() => saveSettings({ whatsappNumber: settings.whatsappNumber })}
              className="w-full rounded-lg border border-cinnamon/20 px-3 py-2"
              placeholder="96178904118"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Delivery charge ($)</span>
            <input
              type="number"
              value={settings.deliveryCharge}
              onChange={(e) =>
                setSettings({ ...settings, deliveryCharge: Number(e.target.value) })
              }
              onBlur={() => saveSettings({ deliveryCharge: settings.deliveryCharge })}
              className="w-full rounded-lg border border-cinnamon/20 px-3 py-2"
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1 block font-medium">Free delivery threshold text</span>
            <input
              value={settings.deliveryFreeThreshold}
              onChange={(e) =>
                setSettings({ ...settings, deliveryFreeThreshold: e.target.value })
              }
              onBlur={() =>
                saveSettings({ deliveryFreeThreshold: settings.deliveryFreeThreshold })
              }
              className="w-full rounded-lg border border-cinnamon/20 px-3 py-2"
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1 block font-medium">Hero headline</span>
            <input
              value={settings.heroHeadline}
              onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
              onBlur={() => saveSettings({ heroHeadline: settings.heroHeadline })}
              className="w-full rounded-lg border border-cinnamon/20 px-3 py-2"
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1 block font-medium">Hero tagline (script)</span>
            <input
              value={settings.heroTagline}
              onChange={(e) => setSettings({ ...settings, heroTagline: e.target.value })}
              onBlur={() => saveSettings({ heroTagline: settings.heroTagline })}
              className="w-full rounded-lg border border-cinnamon/20 px-3 py-2"
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1 block font-medium">Pre-order note</span>
            <textarea
              value={settings.preOrderNote}
              onChange={(e) => setSettings({ ...settings, preOrderNote: e.target.value })}
              onBlur={() => saveSettings({ preOrderNote: settings.preOrderNote })}
              rows={3}
              className="w-full rounded-lg border border-cinnamon/20 px-3 py-2"
            />
          </label>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-medium">Logo</p>
            {settings.logoUrl && (
              <div className="relative mb-2 h-16 w-16 overflow-hidden rounded-full">
                <Image src={settings.logoUrl} alt="Logo" fill className="object-cover" />
              </div>
            )}
            <label className="cursor-pointer rounded-lg border border-cinnamon/30 px-3 py-2 text-sm inline-block">
              Upload logo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadAsset(file, "branding", "logoUrl");
                }}
              />
            </label>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Hero banner</p>
            {settings.heroImageUrl && (
              <div className="relative mb-2 h-24 w-full overflow-hidden rounded-xl">
                <Image src={settings.heroImageUrl} alt="Hero" fill className="object-cover" />
              </div>
            )}
            <label className="cursor-pointer rounded-lg border border-cinnamon/30 px-3 py-2 text-sm inline-block">
              Upload hero image
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadAsset(file, "hero", "heroImageUrl");
                }}
              />
            </label>
            <button
              type="button"
              onClick={() => saveSettings({ heroImageUrl: HERO_DEFAULT_IMAGE })}
              className="ml-2 rounded-lg border border-cinnamon/30 px-3 py-2 text-sm hover:bg-blush/40"
            >
              Use mini-box.jpeg
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {(["instagramUrl", "facebookUrl", "tiktokUrl"] as const).map((key) => (
            <label key={key} className="block text-sm">
              <span className="mb-1 block font-medium capitalize">
                {key.replace("Url", "")}
              </span>
              <input
                value={settings[key]}
                onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                onBlur={() => saveSettings({ [key]: settings[key] })}
                className="w-full rounded-lg border border-cinnamon/20 px-3 py-2"
                placeholder="https://"
              />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-cinnamon/20 bg-white p-5">
        <h3 className="mb-4 font-display text-xl font-semibold">Mini Box</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Name</span>
            <input
              value={miniBox.name}
              onChange={(e) => setMiniBox({ ...miniBox, name: e.target.value })}
              onBlur={() => saveMiniBox({ name: miniBox.name })}
              className="w-full rounded-lg border border-cinnamon/20 px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Price ($)</span>
            <input
              type="number"
              value={miniBox.price}
              onChange={(e) => setMiniBox({ ...miniBox, price: Number(e.target.value) })}
              onBlur={() => saveMiniBox({ price: miniBox.price })}
              className="w-full rounded-lg border border-cinnamon/20 px-3 py-2"
            />
          </label>
        </div>

        <p className="mt-4 mb-2 text-sm font-medium">Eligible flavors</p>
        <div className="flex flex-wrap gap-2">
          {flavors.map((flavor) => (
            <button
              key={flavor.id}
              type="button"
              onClick={() => toggleEligibleFlavor(flavor.id)}
              className={`rounded-full px-3 py-1 text-sm transition ${
                miniBox.eligibleFlavorIds.includes(flavor.id)
                  ? "bg-espresso text-white"
                  : "border border-cinnamon/30 bg-white text-espresso"
              }`}
            >
              {flavor.name}
            </button>
          ))}
        </div>
      </section>

      {saving && <p className="text-sm text-espresso/50">Saving...</p>}
    </div>
  );
}
