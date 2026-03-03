import { useEffect, useState } from "react";
import {
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { DailyDoc } from "../lib/db";

function todayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

export function useDailyChecks() {
  const [dateKey, setDateKey] = useState(todayKey);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const ref = doc(db, "daily", dateKey);
    const unsub = onSnapshot(ref, (snap) => {
      setChecked(snap.exists() ? (snap.data() as DailyDoc).checked : {});
      setLoaded(true);
    });
    return unsub;
  }, [dateKey]);

  // Midnight rollover
  useEffect(() => {
    const id = setInterval(() => {
      const k = todayKey();
      if (k !== dateKey) setDateKey(k);
    }, 60_000);
    return () => clearInterval(id);
  }, [dateKey]);

  const dailyRef = () => doc(db, "daily", dateKey);

  async function toggle(id: number) {
    const current = checked[id] ?? false;
    const next = { ...checked, [id]: !current };
    // Optimistic local update
    setChecked(next);
    try {
      await setDoc(dailyRef(), { checked: next } satisfies DailyDoc);
    } catch {
      // Revert on failure
      setChecked(checked);
    }
  }

  async function reset() {
    setChecked({});
    await deleteDoc(dailyRef());
  }

  return { checked, loaded, toggle, reset };
}
