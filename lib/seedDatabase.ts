import {
  collection,
  doc,
  getDocs,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  SEED_FLAVORS,
  SEED_MINI_BOX,
  SEED_PACKAGE_TIERS,
  SEED_SETTINGS,
} from "./seedData";

export async function seedDatabase(): Promise<{ seeded: boolean; message: string }> {
  const flavorsSnap = await getDocs(collection(db, "flavors"));
  if (!flavorsSnap.empty) {
    return { seeded: false, message: "Database already has data — seed skipped." };
  }

  const batch = writeBatch(db);

  for (const flavor of SEED_FLAVORS) {
    const { id, ...data } = flavor;
    batch.set(doc(db, "flavors", id), data);
  }

  for (const tier of SEED_PACKAGE_TIERS) {
    const { id, ...data } = tier;
    batch.set(doc(db, "packageTiers", id), data);
  }

  batch.set(doc(db, "miniBox", "config"), SEED_MINI_BOX);
  batch.set(doc(db, "settings", "general"), SEED_SETTINGS);

  await batch.commit();

  return { seeded: true, message: "Menu data seeded successfully." };
}

export async function updateOrderStatus(orderId: string, status: "pending" | "reviewed") {
  await setDoc(doc(db, "orders", orderId), { status }, { merge: true });
}
