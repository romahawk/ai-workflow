import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";

const ACCESS_KEY = import.meta.env.VITE_ACCESS_KEY ?? "os2024";
const SESSION_KEY = "os_access";

function PinModal({ onSuccess }: { onSuccess: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pin === ACCESS_KEY) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setError(false);
      onSuccess();
    } else {
      setError(true);
      setPin("");
    }
  }

  return (
    <div className="fixed inset-0 bg-[#0d0f12] flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        <div className="text-center mb-2">
          <p className="text-xs font-mono text-zinc-500 tracking-widest uppercase mb-1">
            Execution Layer
          </p>
          <h1 className="text-xl font-semibold text-zinc-100">
            AI Production OS
          </h1>
        </div>

        <input
          type="password"
          autoFocus
          placeholder="Access key"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className={`w-full px-4 py-2.5 bg-zinc-900 border rounded-md font-mono text-sm text-zinc-100 outline-none focus:border-zinc-500 transition-colors ${
            error ? "border-red-500" : "border-zinc-700"
          }`}
        />

        {error && (
          <p className="text-xs text-red-400 text-center -mt-2">
            Invalid key
          </p>
        )}

        <button
          type="submit"
          className="w-full py-2.5 bg-zinc-100 text-zinc-900 rounded-md text-sm font-medium hover:bg-white transition-colors"
        >
          Enter
        </button>

        <p className="text-xs text-zinc-600 text-center">
          Set{" "}
          <span className="font-mono text-zinc-500">VITE_ACCESS_KEY</span> in{" "}
          <span className="font-mono text-zinc-500">.env.local</span>
        </p>
      </form>
    </div>
  );
}

export function PrivateGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check URL key param first
    const params = new URLSearchParams(location.search);
    const keyParam = params.get("key");
    if (keyParam === ACCESS_KEY) {
      sessionStorage.setItem(SESSION_KEY, "1");
    }

    const hasAccess = sessionStorage.getItem(SESSION_KEY) === "1";
    setUnlocked(hasAccess);
    setChecking(false);
  }, [location.search, navigate]);

  if (checking) return null;

  if (!unlocked) {
    return <PinModal onSuccess={() => setUnlocked(true)} />;
  }

  return <>{children}</>;
}
