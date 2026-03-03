import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import {
  repos as staticRepos,
  ACTIVE_LIMIT,
  type Repo,
  type RepoStatus,
  type OSPhase,
} from "../data/repos";
import type { RepoDoc } from "../lib/db";

// localStorage flag so seeding only runs once per browser
const SEED_KEY = "os_fb_seeded_v1";

export function useRepos() {
  const [overrides, setOverrides] = useState<Record<string, Partial<RepoDoc>>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let unsub: (() => void) | undefined;

    async function init() {
      // ── 1. Seed missing Firestore docs from repos.ts defaults ──────
      if (!localStorage.getItem(SEED_KEY)) {
        await Promise.all(
          staticRepos.map(async (r) => {
            const ref = doc(db, "repos", r.id);
            const snap = await getDoc(ref);
            if (!snap.exists()) {
              await setDoc(ref, {
                status:     r.status,
                phase:      r.phase,
                sprintGoal: r.sprintGoal,
                focusToday: "",
              } satisfies RepoDoc);
            }
          })
        );
        localStorage.setItem(SEED_KEY, "1");
      }

      // ── 2. Subscribe to live repo documents ────────────────────────
      unsub = onSnapshot(collection(db, "repos"), (snap) => {
        const next: Record<string, Partial<RepoDoc>> = {};
        snap.forEach((d) => {
          next[d.id] = d.data() as RepoDoc;
        });
        setOverrides(next);
        setLoaded(true);
      });
    }

    init();
    return () => unsub?.();
  }, []);

  // ── Merge static definition with live Firestore overrides ──────────
  const repos: Repo[] = staticRepos.map((r) => ({
    ...r,
    ...(overrides[r.id] ?? {}),
  }));

  const activeCount = repos.filter((r) => r.status === "active").length;
  const atLimit     = activeCount >= ACTIVE_LIMIT;

  // ── Mutations ──────────────────────────────────────────────────────
  async function setStatus(id: string, status: RepoStatus): Promise<boolean> {
    if (status === "active" && !repos.find((r) => r.id === id && r.status === "active") && atLimit) {
      return false;
    }
    await updateDoc(doc(db, "repos", id), { status });
    return true;
  }

  async function setPhase(id: string, phase: OSPhase) {
    await updateDoc(doc(db, "repos", id), { phase });
  }

  async function setSprintGoal(id: string, sprintGoal: string) {
    await updateDoc(doc(db, "repos", id), { sprintGoal });
  }

  async function setFocusToday(id: string, focusToday: string) {
    await updateDoc(doc(db, "repos", id), { focusToday });
  }

  return {
    repos,
    activeCount,
    atLimit,
    loaded,
    setStatus,
    setPhase,
    setSprintGoal,
    setFocusToday,
  };
}
