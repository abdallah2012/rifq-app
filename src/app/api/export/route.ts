import { NextResponse } from "next/server";
import { requireUser } from "@/lib/supabase/server";
export async function GET() {
  const a = await requireUser();
  if (!a) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const tables = [
    "profiles",
    "cycle_records",
    "daily_checkins",
    "profile_activity_preferences",
    "activity_feedback",
    "profile_phase_preferences",
    "notification_preferences",
    "user_settings",
  ] as const;
  const entries = await Promise.all(
    tables.map(
      async (t) =>
        [t, (await a.client.from(t).select("*")).data ?? []] as const,
    ),
  );
  return new NextResponse(
    JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        data: Object.fromEntries(entries),
      },
      null,
      2,
    ),
    {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="rifq-export.json"',
        "Cache-Control": "no-store",
      },
    },
  );
}
