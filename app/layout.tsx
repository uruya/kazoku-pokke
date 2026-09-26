import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNavigation } from "@/components/bottom-navigation";
import { ToastProvider } from "@/components/ui/toast";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  appleWebApp: { capable: true, title: "かぞくポッケ", statusBarStyle: "default" },
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "かぞくポッケ",
    template: "%s | かぞくポッケ",
  },
  description:
    "保育園の持ち物・提出物・期限を家族で共有。準備できたらチェックして、ひとりで覚えて毎回伝える手間を減らします。",
  openGraph: {
    title: "明日の保育園の準備を、家族で共有 | かぞくポッケ",
    description: "保育園の持ち物・提出物・期限をまとめて、準備できたらチェック。家族への「明日これお願い」を、共有リストに。",
    type: "website",
    locale: "ja_JP",
    images: [{ url: "/og.png", width: 1731, height: 909 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "明日の保育園の準備を、家族で共有 | かぞくポッケ",
    description: "保育園の持ち物・提出物・期限をまとめて、準備できたらチェック。家族への「明日これお願い」を、共有リストに。",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = { themeColor: "#26715f" };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <ToastProvider>
          <div className="mx-auto min-h-dvh max-w-6xl bg-[var(--surface)] pb-24 md:pb-8">
            {children}
          </div>
          <BottomNavigation />
        </ToastProvider>
      </body>
    </html>
  );
}
