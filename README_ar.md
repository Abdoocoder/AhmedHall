# نظام حجوزات قاعة البلدية

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.2.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2.0-38bdf8?style=for-the-badge&logo=tailwind-css)

نظام إدارة حجوزات قاعات الفعاليات municipalities والبلديات

</div>

## الوصف

نظام متكامل لإدارة حجوزات قاعات الفعاليات في البلدية. يوفر النظام واجهة عربية كاملة مع دعم التقويم النبطي، ويتيح للجهات الحكومية والمؤسسات حجز القاعات لتنظيم الفعاليات والمؤتمرات والاجتماعات.

## المميزات

- ✅ لوحة تحكم شاملة تعرض الإحصائيات والتقارير
- ✅ نظام حجوزات متكامل مع التحقق من التعارضات
- ✅ تقويم تفاعلي لعرض جميع الحجوزات
- ✅ إدارة القاعات والجهات المتعاملة
- ✅ دعم التقويم النبطي (كانون ثاني، شباط، اذار...)
- ✅ واجهة عربية بالكامل مع اتجاه RTL
- ✅ نظام مصادقة وآمان متكامل
- ✅ دعم الأجهزة المحمولة

## المتطلبات

| المتطلب | الإصدار |
|---------|---------|
| Node.js | 18.x أو أحدث |
| npm | 9.x أو أحدث |
| Supabase | حساب نشط |

## التثبيت

```bash
# استنساخ المشروع
git clone https://github.com/your-repo/ahmedhall.git
cd ahmedhall

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

1. أنشئ مشروع جديد في Supabase
2. نفّذ سكريبت إنشاء الجداول:
```bash
psql -h your-host -U postgres -d your-db -f scripts/001_create_tables.sql
```

3. (اختياري) نفّذ سكريبت البيانات التجريبية:
```bash
psql -h your-host -U postgres -d your-db -f scripts/002_seed_data.sql
```

## هيكل المشروع

```
ahmedhall/
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
│   └── ui/                 # مكونات واجهة المستخدم
├── lib/                    # المكتبات والأدوات
│   ├── supabase/           # إعدادات Supabase
│   ├── nabataean-calendar.ts # التقويم النبطي
│   └── types.ts            # تعريفات الأنواع
├── scripts/                 # سكريبتات قاعدة البيانات
└── public/                 # الأصول الثابتة
```

## الاستخدام

### تسجيل الدخول

1. انتقل إلى `/auth/login`
2. أدخل البريد الإلكتروني وكلمة المرور
3. سيتم توجيهك إلى لوحة التحكم

### إدارة الحجوزات

- **إضافة حجز جديد**: انقر على زر "حجز جديد" في صفحة الحجوزات
- **تعديل حجز**: انقر على أي حجز موجود
- **حذف حجز**: استخدم زر الحذف مع تأكيد

### إدارة القاعات والجهات

- انتقل إلى صفحة "القاعات" أو "الجهات"
- أضف أو عدّل أو احذف السجلات حسب الحاجة

## استكشاف الأخطاء وإصلاحها

### خطأ في الاتصال بقاعدة البيانات

تأكد من:
1. صحة متغيرات البيئة
2. تفعيل RLS في Supabase (أو تعطيله للاختبار)
3. صحة عنوان URL وقاعدة البيانات

### مشاكل في المصادقة

1. تأكد من تفعيل مصادقة Email في Supabase
2. تحقق من صحة SMTP (للرسائل الإلكترونية)

### مشاكل في العرض

- امسح ذاكرة التخزين المؤقت: `npm run build`
- تحقق من تشغيل Next.js: `npm run dev`

## المساهمة

نرحب بمساهماتكم! يرجى:

1. إنشاء Issue جديد لوصف المشكلة
2.Fork المشروع
3. إنشاء branch جديد: `git checkout -b feature/your-feature`
4. الالتزام بمعايير الكود
5. إرسال Pull Request

## الترخيص

MIT License - راجع ملف LICENSE للمزيد من التفاصيل.

## تواصل معنا

للاستفسارات والدعم:
- البريد الإلكتروني: support@municipality.gov.jo
- الهاتف: +962-6-xxxxxxx

---

<div align="center">

صُنع بـ ❤️ للبلدية

</div>
