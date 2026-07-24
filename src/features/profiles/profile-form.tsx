"use client";
import { useActionState } from "react";
import { createProfile } from "./actions";

export function ProfileForm() {
  const [state, action, pending] = useActionState(createProfile, undefined);
  return (
    <form action={action} className="card grid" style={{ padding: "1.5rem" }}>
      <label className="field">
        اسم العرض
        <input name="displayName" required maxLength={80} />
      </label>
      <label className="field">
        اسم مختصر (اختياري)
        <input name="nickname" maxLength={80} />
      </label>
      <label className="field">
        لون الملف
        <input name="themeColor" type="color" defaultValue="#286f66" />
      </label>
      <div className="grid two">
        <label className="field">
          طول الدورة المعتاد
          <input
            name="expectedCycleLength"
            type="number"
            min={15}
            max={60}
            defaultValue={28}
          />
        </label>
        <label className="field">
          طول الحيض المعتاد
          <input
            name="expectedPeriodLength"
            type="number"
            min={1}
            max={12}
            defaultValue={5}
          />
        </label>
      </div>
      <input name="expectedLutealLength" type="hidden" value="14" />
      <label className="field">
        انتظام الدورة
        <select name="cycleRegularity" defaultValue="unknown">
          <option value="unknown">غير معروف</option>
          <option value="regular">منتظمة غالباً</option>
          <option value="variable">متغيرة</option>
        </select>
      </label>
      <label className="field">
        آخر بداية دورة (اختياري)
        <input
          name="latestPeriodStart"
          type="date"
          max={new Date().toISOString().slice(0, 10)}
        />
      </label>
      <p className="muted">لا يلزم إدخال معلومات حميمة أو غير ضرورية.</p>
      {state?.error && <p role="alert">{state.error}</p>}
      <button className="button" disabled={pending}>
        {pending ? "جارٍ الحفظ…" : "إنشاء الملف"}
      </button>
    </form>
  );
}
