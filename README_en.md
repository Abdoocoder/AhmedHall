# Municipality Hall Booking System — MadabaHalls

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-brightgreen?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.2.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2.0-38bdf8?style=for-the-badge&logo=tailwind-css)

Event Hall Booking Management System for Municipalities

**[Live Demo](https://madabahalls.vercel.app)**

</div>

## Description

A comprehensive system for managing event hall bookings in municipality facilities. The system provides a complete Arabic interface with Nabataean calendar support, allowing government agencies and institutions to book halls for events, conferences, and meetings.

## Features

- ✅ Comprehensive dashboard with statistics and reports
- ✅ Integrated booking system with conflict detection
- ✅ Interactive calendar for viewing all bookings
- ✅ Hall and organization management
- ✅ Nabataean calendar support (Jordanian month names)
- ✅ Full Arabic interface with RTL support
- ✅ Role-based authentication system (admin/manager/user)
- ✅ Mobile-responsive design
- ✅ Soft delete for bookings with recovery support
- ✅ Payment tracking (amount and payment date)

## Prerequisites

| Requirement | Version |
| ----------- | ------- |
| Node.js | 18.x or higher |
| npm | 9.x or higher |
| Supabase | Active account |

## Installation

```bash
# Clone the repository
git clone https://github.com/Abdoocoder/AhmedHall.git
cd AhmedHall

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

### Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Database

Run migration scripts in order via Supabase SQL Editor:

```
scripts/001_create_tables.sql     — Create tables
scripts/002_seed_data.sql         — Seed data (optional)
scripts/003_add_roles_and_rls.sql — User roles and RLS policies
scripts/004_add_missing_fields.sql — Soft delete and payment fields
```

## Project Structure

```
AhmedHall/
├── app/                    # Next.js App Router pages
│   ├── actions/            # Server Actions
│   ├── auth/               # Authentication pages
│   └── (dashboard)/        # Dashboard pages
├── components/             # React components
│   ├── bookings/           # Booking components
│   ├── calendar/           # Calendar components
│   ├── dashboard/          # Dashboard components
│   ├── rooms/              # Room components
│   ├── organizations/      # Organization components
│   └── ui/                 # UI components (Shadcn)
├── lib/                    # Libraries and utilities
│   ├── supabase/           # Supabase configuration
│   ├── nabataean-calendar.ts # Nabataean calendar
│   └── types.ts            # Type definitions
├── scripts/                # Database migration scripts
└── public/                 # Static assets
```

## Usage

### Login

1. Navigate to `/auth/login`
2. Enter email and password
3. You will be redirected to the dashboard

### Managing Bookings

- **Add new booking**: Click "New Booking" button on the bookings page
- **Edit booking**: Click the edit icon next to a booking
- **Delete booking**: Use the delete button with confirmation (soft delete)

### Managing Halls and Organizations

- Navigate to "Halls" or "Organizations" pages
- Add, edit, or delete records as needed

## Troubleshooting

### EPERM Build Error (Windows/OneDrive)

```cmd
taskkill /f /im node.exe
rd /s /q .next
npm run build
npm run start
```

### Database Issues

Ensure environment variables are correct and all migration scripts have been applied in order.

## License

MIT License

---

<div align="center">

Made with ❤️ for Madaba Municipality — Version 1.0.0

</div>
