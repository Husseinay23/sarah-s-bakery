"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import type { MiniBoxConfig, SiteSettings } from "./types";

const defaultSettings: SiteSettings = {
  whatsappNumber: "",
  deliveryCharge: 4,
  deliveryFreeThreshold: "24 pieces or Signature Mini Box",
  storeName: "Sarah's Bakery",
  heroImageUrl: "",
  logoUrl: "",
  heroHeadline: "Cinnamon rolls, rolled fresh in Lebanon.",
  heroTagline: "you choose, we make it",
  preOrderNote: "Please order a day ahead — every roll is made fresh, not stocked.",
  instagramUrl: "#",
  facebookUrl: "#",
  tiktokUrl: "#",
};

const defaultMiniBox: MiniBoxConfig = {
  name: "Signature Mini Box",
  totalPieces: 12,
  price: 20,
  freeDelivery: true,
  eligibleFlavorIds: [],
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "settings", "general"), (snapshot) => {
      if (snapshot.exists()) {
        setSettings({ ...defaultSettings, ...(snapshot.data() as SiteSettings) });
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { settings, loading };
}

export function useMiniBoxConfig() {
  const [config, setConfig] = useState<MiniBoxConfig>(defaultMiniBox);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "miniBox", "config"), (snapshot) => {
      if (snapshot.exists()) {
        setConfig({ ...defaultMiniBox, ...(snapshot.data() as MiniBoxConfig) });
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { config, loading };
}
