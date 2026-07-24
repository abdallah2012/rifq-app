"use client";
import { useActionState } from "react";
import { deleteAccountData, deleteProfile } from "./delete-actions";

export function DeleteProfileForm({ profileId }: { profileId: string }) {
  const [state, action, pending] = useActionState(deleteProfile, undefined);
  return (
    <form
      action={action}
      className="card grid"
      style={{ padding: "1.25rem", borderColor: "#d98a8a" }}
    >
      <input type="hidden" name="profileId" value={profileId} />
      <h2>حذف الملف</h2>
      <p>
        يحذف سجلات الدورة، والحالات، والتفضيلات، والتقييمات، والملاحظات المرتبطة
        بهذا الملف.
      </p>
      <label className="field">
        اكتب «حذف الملف»
        <input name="confirmation" required />
      </label>
      {state?.error && <p role="alert">{state.error}</p>}
      <button className="button" disabled={pending}>
        حذف نهائي
      </button>
    </form>
  );
}

export function DeleteAccountForm() {
  const [state, action, pending] = useActionState(deleteAccountData, undefined);
  return (
    <form
      action={action}
      className="card grid"
      style={{ padding: "1.25rem", borderColor: "#d98a8a" }}
    >
      <h2>حذف كل بيانات الحساب</h2>
      <p>
        هذه خطوة ثانية ونهائية. نزّل نسخة التصدير أولاً إن أردت الاحتفاظ بها.
      </p>
      <label className="field">
        اكتب «حذف كل بياناتي»
        <input name="confirmation" required />
      </label>
      {state?.error && <p role="alert">{state.error}</p>}
      <button className="button" disabled={pending}>
        حذف كل البيانات
      </button>
    </form>
  );
}
