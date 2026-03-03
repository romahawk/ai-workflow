import { useEffect, useState } from "react";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db, isFirebaseEnabled } from "../lib/firebase";
import type { ChangelogDoc, ChangelogEntry } from "../lib/db";

function lsKey(repoId: string) { return `os_changelog_${repoId}`; }
function lsLoad(repoId: string): ChangelogEntry[] {
  try {
    const raw = localStorage.getItem(lsKey(repoId));
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function useChangelog(repoId: string) {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);

  useEffect(() => {
    // ── localStorage path ────────────────────────────────────────────
    if (!isFirebaseEnabled) {
      setEntries(lsLoad(repoId));
      return;
    }

    // ── Firestore path ───────────────────────────────────────────────
    const ref = doc(db, "changelog", repoId);
    const unsub = onSnapshot(ref, (snap) => {
      setEntries(snap.exists() ? (snap.data() as ChangelogDoc).entries : []);
    });
    return unsub;
  }, [repoId]);

  async function addEntry(text: string) {
    const next: ChangelogEntry[] = [
      { ts: new Date().toISOString(), text },
      ...entries,
    ];
    setEntries(next); // optimistic
    if (!isFirebaseEnabled) {
      localStorage.setItem(lsKey(repoId), JSON.stringify(next));
      return;
    }
    await setDoc(doc(db, "changelog", repoId), { entries: next } satisfies ChangelogDoc);
  }

  return { entries, addEntry };
}
