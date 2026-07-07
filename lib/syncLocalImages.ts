import {
  collection,
  doc,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import { FLAVOR_LOCAL_IMAGES, HERO_DEFAULT_IMAGE } from "./localImages";

export async function syncLocalImages(): Promise<{ updated: number; message: string }> {
  const flavorsSnap = await getDocs(collection(db, "flavors"));
  if (flavorsSnap.empty) {
    return { updated: 0, message: "No flavors in database — seed menu data first." };
  }

  const batch = writeBatch(db);
  let updated = 0;

  for (const flavorDoc of flavorsSnap.docs) {
    const localPath = FLAVOR_LOCAL_IMAGES[flavorDoc.id];
    if (localPath) {
      batch.update(flavorDoc.ref, { imageUrl: localPath });
      updated++;
    }
  }

  batch.set(
    doc(db, "settings", "general"),
    { heroImageUrl: HERO_DEFAULT_IMAGE },
    { merge: true },
  );

  await batch.commit();

  return {
    updated,
    message: `Applied ${updated} flavor photo(s) and set hero to mini box image.`,
  };
}
