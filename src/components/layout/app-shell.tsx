import Link from "next/link";
import { CalendarDays, Home, Lightbulb, Settings, Users } from "lucide-react";

const links = [["/app","الرئيسية",Home],["/app/profiles","البروفايلات",Users],["/app/calendar","التقويم",CalendarDays],["/app/recommendations","الاقتراحات",Lightbulb],["/app/settings","الإعدادات",Settings]] as const;
export function AppShell({ children }: { children: React.ReactNode }) {
  return <><header className="shell" style={{ display:"flex",justifyContent:"space-between",alignItems:"center",paddingBlock:"1rem" }}><Link href="/app"><strong style={{fontSize:"1.35rem"}}>رِفق</strong></Link><span className="muted">مساحتك الخاصة</span></header><main className="shell" style={{paddingBottom:"7rem"}}>{children}</main><nav aria-label="التنقل الرئيسي" className="card" style={{position:"fixed",insetInline:"1rem",bottom:"1rem",zIndex:10,maxWidth:720,marginInline:"auto",display:"flex",justifyContent:"space-around",padding:".55rem"}}>{links.map(([href,label,Icon])=><Link key={href} href={href} style={{display:"grid",justifyItems:"center",gap:".2rem",fontSize:".75rem",padding:".35rem"}}><Icon size={19}/><span>{label}</span></Link>)}</nav></>;
}
