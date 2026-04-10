# نظام حجوزات قاعة البلدية — مدابا هولز

![Version](https://img.shields.io/badge/الإصدار-1.1.0-brightgreen?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15.5.15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2.0-38bdf8?style=for-the-badge&logo=tailwind-css)

نظام إدارة حجوزات قاعات الفعاليات للبلديات

**[العرض المباشر](https://madabahalls.vercel.app)**

## الوصف

نظام متكامل لإدارة حجوزات قاعات الفعاليات في البلدية. يوفر النظام واجهة عربية كاملة مع دعم التقويم النبطي، ويتيح للجهات الحكومية والمؤسسات حجز القاعات لتنظيم الفعاليات والمؤتمرات والاجتماعات.

## المميزات

- ✅ لوحة تحكم شاملة تعرض الإحصائيات والتقارير
- ✅ نظام حجوزات متكامل مع التحقق من التعارضات
- ✅ تقويم تفاعلي لعرض جميع الحجوزات
- ✅ إدارة القاعات والجهات المتعاملة
- ✅ دعم التقويم النبطي (كانون ثاني، شباط، اذار، نيسان...)
- ✅ واجهة عربية بالكامل مع اتجاه RTL
- ✅ نظام مصادقة وأمان متكامل مع أدوار (admin/manager/user)
- ✅ دعم الأجهزة المحمولة
- ✅ حذف ناعم للحجوزات مع إمكانية الاسترجاع
- ✅ تتبع المدفوعات (المبلغ وتاريخ الدفع)
- ✅ حماية من أخطاء الـ rendering مع loading skeletons
- ✅ اختبارات وحدة مع Vitest

## المتطلبات

| المتطلب | الإصدار |
| ------- | ------- |
| Node.js | 18.x أو أحدث |
| npm | 9.x أو أحدث |
| Supabase | حساب نشط |

## التثبيت

```bash
# استنساخ المشروع
git clone https://github.com/Abdoocoder/AhmedHall.git
cd AhmedHall

# تثبيت المتطلبات
npm install

# تشغيل خادم التطوير
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000) في المتصفح.

## الإعداد

### متغيرات البيئة

أنشئ ملف `.env.local` يحتوي على:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### قاعدة البيانات

نفّذ السكريبتات بالترتيب في Supabase SQL Editor:

```text
scripts/001_create_tables.sql     — إنشاء الجداول
scripts/002_seed_data.sql         — بيانات تجريبية (اختياري)
scripts/003_add_roles_and_rls.sql — أدوار المستخدمين وسياسات الأمان
scripts/004_add_missing_fields.sql — حقول الحذف الناعم والمدفوعات
```

## هيكل المشروع

```text
AhmedHall/
├── app/                    # صفحات Next.js App Router
│   ├── actions/            # Server Actions
│   ├── auth/               # صفحات المصادقة
│   └── (dashboard)/        # صفحات لوحة التحكم
├── components/             # مكونات React
│   ├── bookings/           # مكونات الحجوزات
│   ├── calendar/           # مكونات التقويم
│   ├── dashboard/          # مكونات لوحة التحكم
│   ├── rooms/              # مكونات القاعات
│   ├── organizations/      # مكونات الجهات
│   └── ui/                 # مكونات واجهة المستخدم (Shadcn)
├── lib/                    # المكتبات والأدوات
│   ├── supabase/           # إعدادات Supabase
│   ├── nabataean-calendar.ts # التقويم النبطي
│   └── types.ts            # تعريفات الأنواع
├── scripts/                # سكريبتات قاعدة البيانات
└── public/                 # الأصول الثابتة
```

## الاستخدام

### تسجيل الدخول

1. انتقل إلى `/auth/login`
2. أدخل البريد الإلكتروني وكلمة المرور
3. سيتم توجيهك إلى لوحة التحكم

### إدارة الحجوزات

- **إضافة حجز جديد**: انقر على زر "حجز جديد" في صفحة الحجوزات
- **تعديل حجز**: انقر على أيقونة التعديل بجانب الحجز
- **حذف حجز**: استخدم زر الحذف مع تأكيد (حذف ناعم)

### إدارة القاعات والجهات

- انتقل إلى صفحة "القاعات" أو "الجهات"
- أضف أو عدّل أو احذف السجلات حسب الحاجة

## الاختبارات

```bash
npm test               # تشغيل جميع الاختبارات
npm run test:watch     # مراقبة التغييرات
npm run test:coverage  # تقرير التغطية
```

## استكشاف الأخطاء

### خطأ EPERM عند البناء (Windows/OneDrive)

```cmd
taskkill /f /im node.exe
rd /s /q .next
npm run build
npm run start
```

### مشاكل في قاعدة البيانات

تأكد من صحة متغيرات البيئة وتطبيق جميع سكريبتات الـ migration بالترتيب.

## الترخيص

MIT License

---

صُنع بـ ❤️ لبلدية مدابا — الإصدار 1.1.0
