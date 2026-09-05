"use client";

import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", icon: "⌂", label: "ホーム" },
  { href: "/todos", icon: "✓", label: "TODO" },
  { href: "/nursery", icon: "⌘", label: "保育園" },
  { href: "/shopping", icon: "□", label: "買い物" },
  { href: "/more", icon: "•••", label: "その他" },
] as const;

const navigationHiddenPaths = ["/login", "/welcome", "/invite", "/auth"];

function NavigationIcon({ icon }: { icon: string }) {
  const { pending } = useLinkStatus();

  return (
    <span
      aria-hidden="true"
      className="flex h-7 min-w-8 items-center justify-center rounded-full px-2 text-lg leading-none"
    >
      {pending ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none" />
      ) : (
        icon
      )}
    </span>
  );
}

export function BottomNavigation() {
  const pathname = usePathname();

  if (navigationHiddenPaths.some((path) => pathname.startsWith(path))) {
    return null;
  }

  return (
    <nav
      aria-label="メインナビゲーション"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:left-1/2 md:max-w-2xl md:-translate-x-1/2 md:rounded-t-2xl md:border-x"
    >
      <div className="grid h-[68px] grid-cols-5">
        {items.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href) ||
                (item.href === "/more" &&
                  ["/medical", "/children", "/households"].some((path) =>
                    pathname.startsWith(path),
                  ));

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              aria-label={item.label}
              className={`flex min-h-11 flex-col items-center justify-center gap-0.5 text-xs font-bold transition-colors ${active ? "text-[var(--primary)]" : "text-[var(--muted)]"}`}
            >
              <span
                className={`rounded-full ${active ? "bg-[var(--primary-soft)]" : ""}`}
              >
                <NavigationIcon icon={item.icon} />
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
