import { useEffect, useState } from "react";
import {
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db, isFirebaseEnabled } from "../lib/firebase";
import type { DailyDoc } from "../lib/db";

function todayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}
function lsKey(dateKey: string) { return `os_daily_${dateKey}`; }
function lsLoad(dateKey: string): Record<string, boolean> {
  try { return JSON.parse(localStorage.getItem(lsKey(dateKey)) ?? "{}"); }
  catch { return {}; }
}

export function useDailyChecks() {
  const [dateKey, setDateKey] = useState(todayKey);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // ── localStorage path ────────────────────────────────────────────
    if (!isFirebaseEnabled) {
      setChecked(lsLoad(dateKey));
      setLoaded(true);
      return;
    }

    // ── Firestore path ───────────────────────────────────────────────
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

  async function toggle(id: number) {
    const next = { ...checked, [id]: !(checked[id] ?? false) };
    setChecked(next); // optimistic
    if (!isFirebaseEnabled) {
      localStorage.setItem(lsKey(dateKey), JSON.stringify(next));
      return;
    }
    try {
      await setDoc(doc(db, "daily", dateKey), { checked: next } satisfies DailyDoc);
    } catch {
      setChecked(checked); // revert on failure
    }
  }

  async function reset() {
    setChecked({});
    if (!isFirebaseEnabled) {
      localStorage.removeItem(lsKey(dateKey));
      return;
    }
    await deleteDoc(doc(db, "daily", dateKey));
  }

  return { checked, loaded, toggle, reset };
}
