import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { db, isFirebaseEnabled } from "../lib/firebase";
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
const LS_KEY   = "os_repos_v1";

function lsLoad(): Record<string, Partial<RepoDoc>> {
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? "{}"); }
  catch { return {}; }
}
function lsSave(data: Record<string, Partial<RepoDoc>>) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

export function useRepos() {
  const [overrides, setOverrides] = useState<Record<string, Partial<RepoDoc>>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // ── localStorage path (no Firebase configured) ──────────────────
    if (!isFirebaseEnabled) {
      setOverrides(lsLoad());
      setLoaded(true);
      return;
    }

    // ── Firestore path ───────────────────────────────────────────────
    let unsub: (() => void) | undefined;

    async function init() {
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

      unsub = onSnapshot(collection(db, "repos"), (snap) => {
        const next: Record<string, Partial<RepoDoc>> = {};
        snap.forEach((d) => { next[d.id] = d.data() as RepoDoc; });
        setOverrides(next);
        setLoaded(true);
      });
    }

    init();
    return () => unsub?.();
  }, []);

  // ── Merge static definition with live overrides ─────────────────────
  const repos: Repo[] = staticRepos.map((r) => ({
    ...r,
    ...(overrides[r.id] ?? {}),
  }));

  const activeCount = repos.filter((r) => r.status === "active").length;
  const atLimit     = activeCount >= ACTIVE_LIMIT;

  // ── localStorage mutation helper ────────────────────────────────────
  function lsMutate(id: string, patch: Partial<RepoDoc>) {
    const next = { ...overrides, [id]: { ...overrides[id], ...patch } };
    setOverrides(next);
    lsSave(next);
  }

  // ── Mutations ───────────────────────────────────────────────────────
  async function setStatus(id: string, status: RepoStatus): Promise<boolean> {
    if (status === "active" && !repos.find((r) => r.id === id && r.status === "active") && atLimit) {
      return false;
    }
    if (!isFirebaseEnabled) { lsMutate(id, { status }); return true; }
    await updateDoc(doc(db, "repos", id), { status });
    return true;
  }

  async function setPhase(id: string, phase: OSPhase) {
    if (!isFirebaseEnabled) { lsMutate(id, { phase }); return; }
    await updateDoc(doc(db, "repos", id), { phase });
  }

  async function setSprintGoal(id: string, sprintGoal: string) {
    if (!isFirebaseEnabled) { lsMutate(id, { sprintGoal }); return; }
    await updateDoc(doc(db, "repos", id), { sprintGoal });
  }

  async function setFocusToday(id: string, focusToday: string) {
    if (!isFirebaseEnabled) { lsMutate(id, { focusToday }); return; }
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
