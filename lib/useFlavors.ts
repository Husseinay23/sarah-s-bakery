"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";
import type { Flavor } from "./types";

export function useFlavors() {
  const [flavors, setFlavors] = useState<Flavor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "flavors"), orderBy("sortOrder", "asc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setFlavors(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Flavor, "id">),
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

  const activeFlavors = flavors.filter((f) => f.active);

  return { flavors, activeFlavors, loading, error };
}
