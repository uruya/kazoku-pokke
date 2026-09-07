"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ToastTone = "success" | "error" | "info";

type Toast = {
  id: number;
  message: string;
  tone: ToastTone;
};

type ToastContextValue = {
  showToast: (message: string, tone?: ToastTone) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const nextId = useRef(0);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = null;
    setToast(null);
  }, []);

  const showToast = useCallback((message: string, tone: ToastTone = "info") => {
    if (timeout.current) clearTimeout(timeout.current);
    nextId.current += 1;
    setToast({ id: nextId.current, message, tone });
    timeout.current = setTimeout(() => {
      timeout.current = null;
      setToast(null);
    }, 4000);
  }, []);

  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast ? (
        <div
          key={toast.id}
          role={toast.tone === "error" ? "alert" : "status"}
          aria-live={toast.tone === "error" ? "assertive" : "polite"}
          aria-atomic="true"
          className={`app-toast fixed inset-x-4 top-4 z-50 mx-auto flex max-w-md items-start gap-3 rounded-2xl border p-4 shadow-xl sm:inset-x-auto sm:right-5 sm:top-5 sm:w-[24rem] ${
            toast.tone === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-950"
              : toast.tone === "error"
                ? "border-red-200 bg-red-50 text-red-950"
                : "border-[var(--line)] bg-white text-[var(--foreground)]"
          }`}
        >
          <span
            aria-hidden="true"
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-black ${
              toast.tone === "success"
                ? "bg-emerald-600 text-white"
                : toast.tone === "error"
                  ? "bg-red-600 text-white"
                  : "bg-[var(--primary)] text-white"
            }`}
          >
            {toast.tone === "success" ? "✓" : toast.tone === "error" ? "!" : "i"}
          </span>
          <p className="min-w-0 flex-1 pt-0.5 text-sm font-bold leading-6">
            {toast.message}
          </p>
          <button
            type="button"
            onClick={dismiss}
            aria-label="通知を閉じる"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg text-current opacity-60 hover:bg-black/5 hover:opacity-100"
          >
            ×
          </button>
        </div>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
