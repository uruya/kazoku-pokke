import type { Metadata } from "next";
import "./globals.css";
import { BottomNavigation } from "@/components/bottom-navigation";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "かぞくポッケ",
    template: "%s | かぞくポッケ",
  },
  description:
    "保育園、育児TODO、病院予定、買い物を一か所で管理できる家族向けアプリ",
  openGraph: {
    title: "かぞくポッケ",
    description: "育児の予定を、ひとつの場所に。",
    type: "website",
    locale: "ja_JP",
    images: [{ url: "/og.png", width: 1731, height: 909 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "かぞくポッケ",
    description: "育児の予定を、ひとつの場所に。",
    images: ["/og.png"],
  },
};

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
