import Link from "next/link";
import { CalendarDays, Home, Lightbulb, Settings, Users } from "lucide-react";

const links = [
  ["/app", "الرئيسية", Home],
  ["/app/profiles", "البروفايلات", Users],
  ["/app/calendar", "التقويم", CalendarDays],
  ["/app/recommendations", "الاقتراحات", Lightbulb],
  ["/app/settings", "الإعدادات", Settings],
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header
        className="shell"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBlock: "1rem",
        }}
      >
        <Link href="/app">
          <strong style={{ fontSize: "1.35rem" }}>رِفق</strong>
        </Link>
        <span
          className="pill"
          style={{ background: "var(--brand-soft)", color: "var(--brand)" }}
        >
          مساحتك الخاصة
        </span>
      </header>
      <main className="shell" style={{ paddingBottom: "7rem" }}>
        {children}
      </main>
      <nav aria-label="التنقل الرئيسي" className="card app-nav">
        {links.map(([href, label, Icon]) => (
          <Link key={href} href={href}>
            <Icon size={19} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
