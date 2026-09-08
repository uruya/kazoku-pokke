"use client";

import { useEffect, useState } from "react";

interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallButton() {
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const displayMode = window.matchMedia("(display-mode: standalone)");
    const updateDisplayMode = () => setInstalled(
      displayMode.matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true,
    );
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPrompt(event as InstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPrompt(null);
      setMessage("");
    };
    updateDisplayMode();
    displayMode.addEventListener("change", updateDisplayMode);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      displayMode.removeEventListener("change", updateDisplayMode);
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    if (!prompt || busy) return;
    setBusy(true);
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      setMessage(choice.outcome === "accepted"
        ? "追加を受け付けました。ホーム画面やアプリ一覧を確認してください。"
        : "追加はキャンセルされました。下の手順からも追加できます。");
    } catch {
      setMessage("追加画面を開けませんでした。下のブラウザの手順をお試しください。");
    } finally {
      setPrompt(null);
      setBusy(false);
    }
  }

  return (
    <div>
      {installed ? (
        <p className="font-bold text-[var(--primary)]">ホーム画面のアプリとして開いています。</p>
      ) : prompt ? (
        <button onClick={install} disabled={busy} className="min-h-12 rounded-xl bg-[var(--primary)] px-5 font-extrabold text-white disabled:opacity-60">
          {busy ? "追加画面を開いています…" : "ホーム画面に追加する"}
        </button>
      ) : (
        <p className="text-sm text-[var(--muted)]">お使いのブラウザに合わせて、下の手順で追加できます。</p>
      )}
      <p role="status" className="mt-2 text-sm text-[var(--muted)]">{message}</p>
    </div>
  );
}
