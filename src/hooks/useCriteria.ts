import { useEffect, useState } from "react";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db, isFirebaseEnabled } from "../lib/firebase";
import type { CriteriaDoc } from "../lib/db";

function lsKey(docId: string) { return `os_criteria_${docId}`; }
function lsLoad(docId: string): Record<string, boolean> {
  try { return JSON.parse(localStorage.getItem(lsKey(docId)) ?? "{}"); }
  catch { return {}; }
}

export function useCriteria(repoId: string, phaseId: string) {
  const docId = `${repoId}_${phaseId}`;
  const [items, setItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // ── localStorage path ────────────────────────────────────────────
    if (!isFirebaseEnabled) {
      setItems(lsLoad(docId));
      return;
    }

    // ── Firestore path ───────────────────────────────────────────────
    const ref = doc(db, "criteria", docId);
    const unsub = onSnapshot(ref, (snap) => {
      setItems(snap.exists() ? (snap.data() as CriteriaDoc).items : {});
    });
    return unsub;
  }, [docId]);

  async function toggleItem(acId: string) {
    const next = { ...items, [acId]: !items[acId] };
    setItems(next); // optimistic
    if (!isFirebaseEnabled) {
      localStorage.setItem(lsKey(docId), JSON.stringify(next));
      return;
    }
    await setDoc(doc(db, "criteria", docId), { items: next } satisfies CriteriaDoc);
  }

  return { items, toggleItem };
}
