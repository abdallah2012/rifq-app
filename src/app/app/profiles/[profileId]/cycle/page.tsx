import { CycleForm } from "@/features/cycles/cycle-form";
export default async function Page({params}:{params:Promise<{profileId:string}>}){return <section style={{maxWidth:640,marginInline:"auto"}}><h1>بدأت الدورة</h1><p className="muted">اختر التاريخ الصحيح. سيُنبهك رِفق عند وجود تكرار أو تعارض.</p><CycleForm profileId={(await params).profileId}/></section>}
