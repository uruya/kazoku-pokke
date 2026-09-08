"use client";

import { useEffect, useState } from "react";
import {
  removePushSubscription,
  savePushSubscription,
  sendTestPushNotification,
  type SerializedPushSubscription,
} from "@/app/actions/push-notifications";

type DeviceState = "checking" | "unsupported" | "off" | "on";

function urlBase64ToUint8Array(value: string) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replaceAll("-", "+").replaceAll("_", "/");
  const decoded = window.atob(base64);
  return Uint8Array.from(decoded, (character) => character.charCodeAt(0));
}

function serializeSubscription(
  subscription: PushSubscription,
): SerializedPushSubscription {
  const value = subscription.toJSON();
  return {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: value.keys?.p256dh ?? "",
      auth: value.keys?.auth ?? "",
    },
  };
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function PushNotificationSettings({
  vapidPublicKey,
}: {
  vapidPublicKey: string;
}) {
  const [deviceState, setDeviceState] = useState<DeviceState>("checking");
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [needsIosInstall, setNeedsIosInstall] = useState(false);

  useEffect(() => {
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setNeedsIosInstall(ios && !isStandalone());

    if (
      !vapidPublicKey ||
      !("serviceWorker" in navigator) ||
      !("PushManager" in window) ||
      !("Notification" in window)
    ) {
      setDeviceState("unsupported");
      return;
    }

    let active = true;
    void navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .then((registration) => registration.pushManager.getSubscription())
      .then(async (current) => {
        if (!active) return;
        if (current) {
          const result = await savePushSubscription(
            serializeSubscription(current),
          );
          if (!active) return;
          if (!result.success) {
            setDeviceState("off");
            setMessage(result.message);
            return;
          }
        }
        setSubscription(current);
        setDeviceState(current ? "on" : "off");
      })
      .catch(() => {
        if (active) setDeviceState("unsupported");
      });

    return () => {
      active = false;
    };
  }, [vapidPublicKey]);

  async function enable() {
    if (busy || deviceState === "unsupported") return;
    setBusy(true);
    setMessage("");
    let current: PushSubscription | null = null;
    try {
      if (Notification.permission === "denied") {
        setMessage("ブラウザの設定で、かぞくポッケの通知を許可してください。");
        return;
      }
      const registration = await navigator.serviceWorker.ready;
      current =
        (await registration.pushManager.getSubscription()) ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        }));
      const result = await savePushSubscription(serializeSubscription(current));
      if (!result.success) {
        await current.unsubscribe();
        setSubscription(null);
        setDeviceState("off");
        setMessage(result.message);
        return;
      }
      setSubscription(current);
      setDeviceState("on");
      setMessage(result.message);
    } catch {
      setMessage("通知をONにできませんでした。通知の許可と通信状態をご確認ください。");
    } finally {
      setBusy(false);
    }
  }

  async function disable() {
    if (!subscription || busy) return;
    setBusy(true);
    setMessage("");
    try {
      const result = await removePushSubscription(subscription.endpoint);
      if (!result.success) {
        setMessage(result.message);
        return;
      }
      await subscription.unsubscribe();
      setSubscription(null);
      setDeviceState("off");
      setMessage(result.message);
    } catch {
      setMessage("通知をOFFにできませんでした。時間をおいてお試しください。");
    } finally {
      setBusy(false);
    }
  }

  async function sendTest() {
    if (!subscription || busy) return;
    setBusy(true);
    setMessage("");
    try {
      const result = await sendTestPushNotification(subscription.endpoint);
      setMessage(result.message);
      if (!result.success && result.message.includes("期限")) {
        await subscription.unsubscribe();
        setSubscription(null);
        setDeviceState("off");
      }
    } catch {
      setMessage("テスト通知を送れませんでした。");
    } finally {
      setBusy(false);
    }
  }

  if (deviceState === "checking") {
    return (
      <p className="mt-4 text-sm text-[var(--muted)]">
        この端末の通知状態を確認中…
      </p>
    );
  }

  if (deviceState === "unsupported") {
    return (
      <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
        {needsIosInstall
          ? "iPhone・iPadではSafariからホーム画面に追加し、ホーム画面のアイコンから開くと通知を設定できます。"
          : vapidPublicKey
            ? "このブラウザはスマホ通知に対応していません。対応ブラウザでお試しください。"
            : "スマホ通知は現在準備中です。管理者による通知キーの設定後に利用できます。"}
      </p>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex min-h-14 items-center gap-3 rounded-xl bg-[var(--surface)] px-4">
        <span className="flex-1 font-bold">この端末で前日通知を受け取る</span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-extrabold ${
            deviceState === "on"
              ? "bg-[var(--primary-soft)] text-[var(--primary)]"
              : "bg-slate-200 text-slate-600"
          }`}
        >
          {deviceState === "on" ? "ON" : "OFF"}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={deviceState === "on" ? disable : enable}
          className="min-h-12 rounded-xl bg-[var(--primary)] px-4 text-sm font-extrabold text-white disabled:opacity-60"
        >
          {busy
            ? "処理中…"
            : deviceState === "on"
              ? "この端末の通知をOFF"
              : "この端末の通知をON"}
        </button>
        {deviceState === "on" && (
          <button
            type="button"
            disabled={busy}
            onClick={sendTest}
            className="min-h-12 rounded-xl bg-[var(--surface)] px-4 text-sm font-extrabold text-[var(--primary)] disabled:opacity-60"
          >
            テスト通知を送る
          </button>
        )}
      </div>
      <p role="status" className="mt-2 text-sm text-[var(--muted)]">
        {message}
      </p>
    </div>
  );
}
