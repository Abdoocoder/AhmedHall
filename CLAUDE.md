# AhmedHall - AI Assistant Guidelines

This document contains guidelines and project context for AI assistants (like Claude, Gemini, Roo Cline) working on the **AhmedHall** (Municipality Hall Booking System) repository.

- **Version:** 1.1.0
- **Package name:** madabahalls
- **Live URL:** [madabahalls.vercel.app](https://madabahalls.vercel.app)
- **GitHub:** [Abdoocoder/AhmedHall](https://github.com/Abdoocoder/AhmedHall)

## Project Overview

**AhmedHall** is a web-based booking system for municipality halls. It tracks bookings, organizations, rooms, and integrates with a custom Nabataean Calendar specific to Jordan mapping (e.g., كانون ثاني, شباط, اذار).

## Technology Stack

- **Framework:** Next.js 15.5.15 (App Router)
- **UI & Components:** React 19, Radix UI primitives (`@radix-ui/react-*`)
- **Styling:** Tailwind CSS v4, Shadcn UI, Embla Carousel
- **Forms & Validation:** React Hook Form + Zod
- **Data & Auth:** Supabase SSR
- **Scheduling/Dates:** FullCalendar (`@fullcalendar/*`), `date-fns`, and a custom Nabataean mapping module.
- **Language:** TypeScript (`strict: true`)

## Build & Run Commands

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Starts the Next.js development server locally |
| `npm run build` | Compiles the application for production |
| `npm run start` | Running the compiled production server |
| `npm run typecheck` | Runs TypeScript compiler (`tsc --noEmit`) to verify types |
| `npm run eslint` | Runs the Next linting script |
| `npm test` | Runs all Vitest unit tests |
| `npm run test:watch` | Runs Vitest in watch mode |
| `npm run test:coverage` | Runs Vitest with coverage report |

## Architecture & Directory Structure

- **`/app`**: Next.js App Router views. Follows folder-based routing.
  - `(dashboard)` route group - protected dashboard pages
  - `/auth/login` - authentication page
  - `/` - landing/public page
- **`/components`**: Reusable UI components.
  - `/components/ui`: Base Shadcn components (60+ components)
  - `/components/bookings`: Booking management components
  - `/components/calendar`: Calendar components
  - `/components/dashboard`: Dashboard widgets
  - `/components/rooms`: Room management
  - `/components/organizations`: Organization management
- **`/lib`**: Core utilities, data access points, and types.
  - `nabataean-calendar.ts`: Jordanian calendar configuration
  - `/supabase`: `client.ts`, `server.ts`, `middleware.ts`
  - `types.ts`: TypeScript interfaces
  - `utils.ts`: Utility functions
- **`/hooks`**: Custom React hooks
- **`/scripts`**: Database scripts (SQL migrations)

## Database Schema

### Tables

- **organizations**: id, name, contact_person, phone, email, created_at, updated_at
- **rooms**: id, name, capacity, description, is_active, created_at, updated_at
- **bookings**: id, org_id, room_id, booking_date, start_time, end_time, event_name, coordinator_name, coordinator_phone, attendees_count, payment_status (enum), payment_amount, payment_date, notes, deleted_at, created_at, updated_at *(15 fields)*
- **user_roles**: id, user_id, role (admin/manager/user)

### Security Features

- Row Level Security (RLS) enabled on all tables with role-based policies
- `gen_random_uuid()` for auto IDs
- `CONSTRAINT valid_time_range` — enforces booking time logic
- Booking conflict prevention trigger
- Indexes for query performance

### Known Database Gaps

- No `created_by` field for audit tracking

### Applied Migrations

| File | Status | Description |
| ---- | ------ | ----------- |
| `scripts/001_create_tables.sql` | Applied | Base tables: organizations, rooms, bookings |
| `scripts/002_seed_data.sql` | Applied | Seed data |
| `scripts/003_add_roles_and_rls.sql` | Applied | user_roles table + role-based RLS policies |
| `scripts/004_add_missing_fields.sql` | Applied | Added deleted_at (soft delete), payment_amount, payment_date to bookings |

## Developer Guidelines

### 1. Code Style & Typing

- **Strict TypeScript:** All components and functions must declare proper TS interfaces or types. Re-use interfaces defined in `lib/types.ts` where possible.
- **Functional Components:** Always use modern React Functional Components with Hooks.
- **Styling:** Use Tailwind CSS utility classes. When building complex interactive components, lean onto existing Shadcn UI setups to maintain consistency.
- **RTL Support:** Always use RTL layout classes (`dir="rtl"`) for Arabic text.

### 2. State & Data Fetching

- For complex forms, ALWAYS utilize `react-hook-form` paired with `zod` schema resolvers.
- If implementing data fetching, utilize standard App Router features (Server Components where viable, Client Components only when interactivity requires `use client`).
- Ensure Supabase server and client functions are used in their respective secure contexts (import from `/lib/supabase/server` vs `/lib/supabase/client`).

### 3. Localization

- The application utilizes Arabic localization deeply (specifically the Nabataean calendar structure). Always preserve Arabic text strings if refactoring components. Ensure any newly implemented user-facing interfaces contain appropriate RTL layout utility classes when applicable.

## Known Project Quirks & Issues

- **Next.js 16.2.0:** This version is experimental/beta. Consider downgrading to Next.js 15.x for production stability.
- **React 19:** Also experimental - may cause compatibility issues with some packages.
- **Linting Edge Cases:** The `npm run eslint` command fails with "Invalid project directory" because `next lint` misinterprets the path on Windows — run `npx next lint` directly as a workaround.
- **Git Configuration:** Use `abdoocoder@gmail.com` as the git author email for proper Vercel/GitHub identification.
- **Missing Testing Suite:** `npm run test:coverage` will fail - requires Vitest or Jest integration.

## Windows / OneDrive Environment Issues

The project is located inside a OneDrive-synced folder. This causes the following known issues:

### Build Failures (EPERM)

OneDrive locks files in `.next/static/` during sync, causing `next build` to fail with:

```text
Error: EPERM: operation not permitted, unlink '.next/static/...'
```

**Fix:** Delete `.next` using Windows-native tools (not `rm -rf` from bash, which fails on locked files):

```cmd
# Command Prompt (run as Administrator if needed)
taskkill /f /im node.exe
rd /s /q .next
npm run build
npm run start
```

```powershell
# PowerShell
Stop-Process -Name node -Force -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .next
npm run build
npm run start
```

**Long-term fix:** Exclude `.next` from OneDrive sync by right-clicking the folder in Explorer → OneDrive → "Don't sync this folder", or move the project outside the OneDrive-synced directory entirely.

## Code Review Findings

Overall Score: 7.5/10

| Area            | Score  | Notes                                   |
| --------------- | ------ | --------------------------------------- |
| Code Quality    | 8/10   | TypeScript strict, clean structure      |
| Database        | 8/10   | Good schema, missing soft delete/audit  |
| Security        | 6/10   | RLS enabled but too permissive          |
| UI/UX           | 7.5/10 | Good components, missing loading states |
| Documentation   | 7/10   | CLAUDE.md exists, good context          |
| Maintainability | 7/10   | Duplicate files issue                   |

### Strengths

- Modern App Router architecture with route groups
- TypeScript strict mode — fully typed codebase
- Nabataean calendar integration (Arabic/Jordanian months)
- Full shadcn/ui component library (60+ components)
- Database triggers for conflict prevention
- RTL support throughout the UI
- Zod + React Hook Form for validated forms
- Role-based RLS policies (admin/manager/user)

### Security Notes

- RLS is enabled on all tables. SELECT policies use `USING (true)` intentionally — filtering of soft-deleted rows is handled in application code via `.is("deleted_at", null)`.
- Write policies (INSERT/UPDATE/DELETE) are role-restricted via `user_roles` table.
- `SECURITY DEFINER` used in `get_user_role()` and `soft_delete_booking()` functions — review before exposing publicly.
- No rate limiting implemented yet.
- No explicit CSRF protection.

### Improvement Priorities

**Medium:**

1. Add error boundaries
2. Add loading skeletons
3. Add rate limiting
4. Improve `middleware.ts`

**Low:**

1. Downgrade Next.js 16 → 15 (current version is experimental)
2. Add unit tests (Vitest or Jest)

## Page Routes

| Route | Description |
| ----- | ----------- |
| `/` | Landing page |
| `/auth/login` | Login page |
| `/dashboard` | Dashboard with stats |
| `/bookings` | Booking management |
| `/calendar` | FullCalendar view |
| `/rooms` | Room management |
| `/organizations` | Organization management |
