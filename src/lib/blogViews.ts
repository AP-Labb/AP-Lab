import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";

const BASE_VIEW_OFFSET = 2679;

export async function incrementAndGetBlogViews(slug: string): Promise<number> {
  const localKey = `aplab_blog_views_${slug}`;
  let currentViews = BASE_VIEW_OFFSET;

  // Try fetching / updating in Firestore for cross-device sync
  if (db && typeof db.collection === "function" || db?.type === "firestore") {
    try {
      const docRef = doc(db, "blog_views", slug);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        await updateDoc(docRef, {
          views: increment(1),
        });
        const updatedSnap = await getDoc(docRef);
        currentViews = updatedSnap.data()?.views || BASE_VIEW_OFFSET + 1;
      } else {
        const initialCount = BASE_VIEW_OFFSET + 1;
        await setDoc(docRef, { views: initialCount });
        currentViews = initialCount;
      }
    } catch (err) {
      console.warn("Firestore view counter fallback:", err);
      currentViews = getLocalStorageFallback(localKey);
    }
  } else {
    currentViews = getLocalStorageFallback(localKey);
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(localKey, currentViews.toString());
  }

  return currentViews;
}

function getLocalStorageFallback(localKey: string): number {
  if (typeof window === "undefined") return BASE_VIEW_OFFSET;
  const saved = localStorage.getItem(localKey);
  const parsed = saved ? parseInt(saved, 10) : BASE_VIEW_OFFSET;
  const next = parsed + 1;
  localStorage.setItem(localKey, next.toString());
  return next;
}
