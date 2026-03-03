import { useEffect, useState } from "react";
import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { SprintDoc } from "../lib/db";

export function useSprintPlan(week: number) {
  const [plan, setPlan] = useState<SprintDoc | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const ref = doc(db, "sprints", `w${week}`);
    const unsub = onSnapshot(ref, (snap) => {
      setPlan(snap.exists() ? (snap.data() as SprintDoc) : null);
      setLoaded(true);
    });
    return unsub;
  }, [week]);

  const sprintRef = () => doc(db, "sprints", `w${week}`);

  // Ensure doc exists before calling updateDoc
  async function ensureDoc() {
    const base: SprintDoc = {
      week,
      lockedAt: null,
      outcomes: {},
      shipped:  {},
    };
    await setDoc(sprintRef(), base, { merge: true });
  }

  async function setOutcome(repoId: string, outcome: string) {
    if (!plan) await ensureDoc();
    await updateDoc(sprintRef(), { [`outcomes.${repoId}`]: outcome });
  }

  async function toggleShipped(repoId: string) {
    if (!plan) await ensureDoc();
    const current = plan?.shipped?.[repoId] ?? false;
    await updateDoc(sprintRef(), { [`shipped.${repoId}`]: !current });
  }

  async function lock() {
    if (!plan) await ensureDoc();
    await updateDoc(sprintRef(), { lockedAt: new Date().toISOString() });
  }

  async function reset() {
    await deleteDoc(sprintRef());
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
