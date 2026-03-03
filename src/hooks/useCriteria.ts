import { useEffect, useState } from "react";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { CriteriaDoc } from "../lib/db";

export function useCriteria(repoId: string, phaseId: string) {
  const docId = `${repoId}_${phaseId}`;
  const [items, setItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const ref = doc(db, "criteria", docId);
    const unsub = onSnapshot(ref, (snap) => {
      setItems(snap.exists() ? (snap.data() as CriteriaDoc).items : {});
    });
    return unsub;
  }, [docId]);

  async function toggleItem(acId: string) {
    const next = { ...items, [acId]: !items[acId] };
    setItems(next); // optimistic
    await setDoc(
      doc(db, "criteria", docId),
      { items: next } satisfies CriteriaDoc
    );
  }

  return { items, toggleItem };
}
