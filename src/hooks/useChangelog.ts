import { useEffect, useState } from "react";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { ChangelogDoc, ChangelogEntry } from "../lib/db";

export function useChangelog(repoId: string) {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);

  useEffect(() => {
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
    await setDoc(
      doc(db, "changelog", repoId),
      { entries: next } satisfies ChangelogDoc
    );
  }

  return { entries, addEntry };
}
