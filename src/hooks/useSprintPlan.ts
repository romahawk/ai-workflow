import { useEffect, useState } from "react";
import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db, isFirebaseEnabled } from "../lib/firebase";
import type { SprintDoc } from "../lib/db";

function lsKey(week: number) { return `os_sprint_w${week}`; }
function lsLoad(week: number): SprintDoc | null {
  try { return JSON.parse(localStorage.getItem(lsKey(week)) ?? "null"); }
  catch { return null; }
}
function lsSave(week: number, data: SprintDoc) {
  localStorage.setItem(lsKey(week), JSON.stringify(data));
}

function emptyPlan(week: number): SprintDoc {
  return { week, lockedAt: null, outcomes: {}, shipped: {} };
}

export function useSprintPlan(week: number) {
  const [plan, setPlan] = useState<SprintDoc | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // ── localStorage path ────────────────────────────────────────────
    if (!isFirebaseEnabled) {
      setPlan(lsLoad(week));
      setLoaded(true);
      return;
    }

    // ── Firestore path ───────────────────────────────────────────────
    const ref = doc(db, "sprints", `w${week}`);
    const unsub = onSnapshot(ref, (snap) => {
      setPlan(snap.exists() ? (snap.data() as SprintDoc) : null);
      setLoaded(true);
    });
    return unsub;
  }, [week]);

  const fsRef = () => doc(db, "sprints", `w${week}`);

  async function setOutcome(repoId: string, outcome: string) {
    if (!isFirebaseEnabled) {
      const next = { ...(plan ?? emptyPlan(week)), outcomes: { ...(plan?.outcomes ?? {}), [repoId]: outcome } };
      setPlan(next);
      lsSave(week, next);
      return;
    }
    if (!plan) await setDoc(fsRef(), emptyPlan(week), { merge: true });
    await updateDoc(fsRef(), { [`outcomes.${repoId}`]: outcome });
  }

  async function toggleShipped(repoId: string) {
    if (!isFirebaseEnabled) {
      const current = plan?.shipped?.[repoId] ?? false;
      const next = { ...(plan ?? emptyPlan(week)), shipped: { ...(plan?.shipped ?? {}), [repoId]: !current } };
      setPlan(next);
      lsSave(week, next);
      return;
    }
    if (!plan) await setDoc(fsRef(), emptyPlan(week), { merge: true });
    const current = plan?.shipped?.[repoId] ?? false;
    await updateDoc(fsRef(), { [`shipped.${repoId}`]: !current });
  }

  async function lock() {
    if (!isFirebaseEnabled) {
      const next = { ...(plan ?? emptyPlan(week)), lockedAt: new Date().toISOString() };
      setPlan(next);
      lsSave(week, next);
      return;
    }
    if (!plan) await setDoc(fsRef(), emptyPlan(week), { merge: true });
    await updateDoc(fsRef(), { lockedAt: new Date().toISOString() });
  }

  async function reset() {
    if (!isFirebaseEnabled) {
      setPlan(null);
      localStorage.removeItem(lsKey(week));
      return;
    }
    await deleteDoc(fsRef());
  }

  return {
    plan,
    loaded,
    locked: !!plan?.lockedAt,
    setOutcome,
    toggleShipped,
    lock,
    reset,
  };
}
