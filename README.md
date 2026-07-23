# رِفق — RIFQ

تطبيق عربي RTL خاص لدعم العلاقة وتتبع الدورة بصورة تقديرية ومحترمة. يتضمن ملفات مستقلة، حساب المراحل والثقة، DEVI وFrame، حالات يومية، اقتراحات حتمية، تقويماً، تصديراً، حذفاً، ووضع خصوصية.

> لا يُستخدم رِفق لتأكيد الإباضة أو منع الحمل أو التشخيص أو اتخاذ قرارات طبية.

## الإعداد المحلي

يتطلب Node.js 22 LTS، وnpm، ومشروع Supabase.

```bash
cp .env.example .env.local
npm install
supabase db push
supabase db seed
npm run dev
```

اضبط المتغيرات التالية في `.env.local` ولا تلتزم الملف في Git:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SECRET_KEY
NEXT_PUBLIC_APP_URL
```

في Supabase Auth أضف `NEXT_PUBLIC_APP_URL/auth/callback` إلى Redirect URLs. طبّق migration ثم `supabase/seed.sql`.

## الجودة

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npx playwright install chromium
npm run test:e2e
npm run build
```

## النشر (توثيق فقط)

أنشئ بيئة Next.js، وأضف المتغيرات الأربعة في مخزن الأسرار، وطبّق migrations وseed، ثم نفّذ `npm ci && npm run build`. لا تنشر إلا بعد نجاح الاختبارات والمراجعة. لم يُنفّذ أي نشر من هذا الفرع.
