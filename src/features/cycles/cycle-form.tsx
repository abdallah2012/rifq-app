"use client";
import { useActionState } from "react";
import { addCycleRecord } from "@/features/profiles/actions";
export function CycleForm({ profileId }: { profileId: string }) {
  const [state, action, pending] = useActionState(addCycleRecord, undefined);
  return (
    <form action={action} className="card grid" style={{ padding: "1.25rem" }}>
      <input type="hidden" name="profileId" value={profileId} />
      <label className="field">
        بداية الدورة
        <input
          name="periodStartDate"
          type="date"
          max={new Date().toISOString().slice(0, 10)}
          required
        />
      </label>
      <label className="field">
        نهاية الحيض (اختياري)
        <input name="periodEndDate" type="date" />
      </label>
      <label className="field">
        ملاحظات خاصة
        <textarea name="notes" maxLength={2000} />
      </label>
      {state?.error && <p role="alert">{state.error}</p>}
      {state?.success && <p role="status">تم الحفظ وإعادة حساب التقديرات.</p>}
      <button className="button" disabled={pending}>
        حفظ السجل
      </button>
    </form>
  );
}
