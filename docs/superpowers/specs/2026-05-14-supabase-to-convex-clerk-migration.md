# Supabase to Convex + Clerk Migration

## Goal

Replace Supabase (auth + database) with Convex (database + server functions) and Clerk (authentication), preserving all existing UI, behavior, and user flows.

## Architecture

```
ClerkProvider ──> ConvexProviderWithClerk ──> ThemeProvider ──> app
```

- Clerk handles auth (login page keeps custom UI, using `useSignIn` hook)
- Convex handles all data (replaces Supabase queries + server actions)
- Middleware uses `clerkMiddleware` instead of Supabase session
- All dashboard pages become Client Components using Convex `useQuery`/`useMutation` hooks

## Schema (convex/schema.ts)

### organizations
- `_id`, `name: v.string()`, `contactPerson: v.optional(v.string())`, `phone: v.optional(v.string())`, `email: v.optional(v.string())`, `createdAt: v.number()`, `updatedAt: v.number()`

### rooms
- `_id`, `name: v.string()`, `capacity: v.number()`, `description: v.optional(v.string())`, `isActive: v.boolean()`, `createdAt: v.number()`, `updatedAt: v.number()`

### bookings
- `_id`, `orgId: v.id("organizations")`, `roomId: v.id("rooms")`, `bookingDate: v.string()`, `startTime: v.string()`, `endTime: v.string()`, `eventName: v.string()`, `coordinatorName: v.string()`, `coordinatorPhone: v.optional(v.string())`, `attendeesCount: v.number()`, `paymentStatus: v.union(v.literal("pending"), v.literal("paid"), v.literal("cancelled"))`, `paymentAmount: v.optional(v.number())`, `paymentDate: v.optional(v.string())`, `notes: v.optional(v.string())`, `deletedAt: v.optional(v.number())`, `createdAt: v.number()`, `updatedAt: v.number()`
- **Indexes:** `by_room_date` on `["roomId", "bookingDate"]`, `by_org` on `["orgId"]`, `by_date` on `["bookingDate"]`

### bookingRequests
- `_id`, `eventName: v.string()`, `bookingDate: v.string()`, `startTime: v.string()`, `endTime: v.string()`, `attendeesCount: v.number()`, `notes: v.optional(v.string())`, `roomId: v.id("rooms")`, `citizenName: v.string()`, `citizenPhone: v.string()`, `citizenEmail: v.optional(v.string())`, `organizationName: v.string()`, `status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"))`, `rejectionReason: v.optional(v.string())`, `reviewedAt: v.optional(v.number())`, `createdAt: v.number()`, `updatedAt: v.number()`
- **Indexes:** `by_status` on `["status"]`, `by_date` on `["createdAt"]`

### userRoles
- `_id`, `userId: v.string()`, `role: v.union(v.literal("admin"), v.literal("manager"), v.literal("user"))`
- **Indexes:** `by_userId` on `["userId"]`

## Auth Flow

### Login Page (preserved custom UI)
- `app/auth/login/page.tsx` stays as a Client Component with the same custom design
- Replaces `supabase.auth.signInWithPassword()` with Clerk's `useSignIn().attemptFirstFactor()`
- Replaces `createClient()` from supabase with Clerk's `useSignIn()` hook
- Preserves: same form layout, same error display, same loading states

### Middleware
- `middleware.ts` rewritten to use `clerkMiddleware` instead of Supabase
- Protects all dashboard routes, allows public `/request` and auth pages

### User Sync (Webhook)
- `app/api/webhooks/clerk/route.ts` receives `user.created` / `user.deleted` events
- Calls Convex internal mutations to upsert/delete userRoles entries

### Logout
- `useClerk().signOut()` replaces `supabase.auth.signOut()`
- Redirects to `/auth/login`

## Files to Create

| File | Purpose |
|------|---------|
| `convex/schema.ts` | Schema definitions for all 5 tables |
| `convex/auth.config.ts` | Clerk JWT validation config |
| `convex/organizations.ts` | CRUD mutations + queries |
| `convex/rooms.ts` | CRUD mutations + queries |
| `convex/bookings.ts` | CRUD mutations + queries, conflict checking |
| `convex/bookingRequests.ts` | CRUD mutations + queries, approve/reject |
| `convex/userRoles.ts` | User role queries |
| `convex/users.ts` | Internal mutations for Clerk webhook sync |
| `components/ConvexClientProvider.tsx` | Convex + Clerk provider wrapper |
| `app/api/webhooks/clerk/route.ts` | Clerk webhook endpoint |

## Files to Modify

| File | Change |
|------|--------|
| `app/layout.tsx` | Add ClerkProvider → ConvexClientProvider wrapper |
| `middleware.ts` | Rewrite with `clerkMiddleware` |
| `app/auth/login/page.tsx` | Swap supabase auth → Clerk useSignIn |
| `app/(dashboard)/layout.tsx` | Add `currentUser` check via Convex |
| `app/(dashboard)/dashboard/page.tsx` | Server → Client component, use Convex queries |
| `app/(dashboard)/bookings/page.tsx` | Server → Client component |
| `app/(dashboard)/calendar/page.tsx` | Server → Client component |
| `app/(dashboard)/rooms/page.tsx` | Server → Client component |
| `app/(dashboard)/organizations/page.tsx` | Server → Client component |
| `app/(dashboard)/requests/page.tsx` | Server → Client component |
| `app/request/page.tsx` | Use Convex mutation instead of server action |
| `app/page.tsx` | No change (redirects to dashboard) |
| `lib/types.ts` | Remove Supabase-specific types, add Convex-compatible types |
| `package.json` | Add convex, clerk deps; remove supabase deps |
| `.env.local` | Replace Supabase vars with Convex + Clerk vars |

## Files to Delete

| File | Reason |
|------|--------|
| `lib/supabase/` | Entire directory — no longer used |
| `app/actions/` | Entire directory — server actions replaced by Convex mutations |
| `app/auth/callback/route.ts` | Supabase OAuth callback — not needed with Clerk |
| `components/theme-provider.tsx` | No change — stays as is |
