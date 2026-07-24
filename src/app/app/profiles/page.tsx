import Link from "next/link";
import { requireUser } from "@/lib/supabase/server";
export default async function Page() {
  const auth = await requireUser();
  if (!auth) return null;
  const { data } = await auth.client
    .from("profiles")
    .select("id,display_name,nickname,is_archived")
    .order("created_at");
  return (
    <section>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>البروفايلات</h1>
        <Link className="button" href="/app/profiles/new">
          إضافة
        </Link>
      </div>
      <div className="grid two">
        {data?.map((p) => (
          <Link
            className="card"
            style={{ padding: "1.25rem" }}
            key={p.id}
            href={`/app/profiles/${p.id}`}
          >
            <h2>{p.display_name}</h2>
            <p className="muted">
              {p.nickname || "ملف مستقل"}
              {p.is_archived ? " · مؤرشف" : ""}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
