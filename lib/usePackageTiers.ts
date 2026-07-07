"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";
import type { PackageTier } from "./types";

export function usePackageTiers() {
  const [tiers, setTiers] = useState<PackageTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "packageTiers"), orderBy("pieceCount", "asc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setTiers(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<PackageTier, "id">),
          })),
        );
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  return { tiers, loading, error };
}
