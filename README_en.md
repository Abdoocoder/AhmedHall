# Municipality Hall Booking System

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.2.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2.0-38bdf8?style=for-the-badge&logo=tailwind-css)

Event Hall Booking Management System for Municipalities

</div>

## Description

A comprehensive system for managing event hall bookings in municipality facilities. The system provides a complete Arabic interface with Nabataean calendar support, allowing government agencies and institutions to book halls for events, conferences, and meetings.

## Features

- ✅ Comprehensive dashboard with statistics and reports
- ✅ Integrated booking system with conflict detection
- ✅ Interactive calendar for viewing all bookings
- ✅ Hall and organization management
- ✅ Nabataean calendar support (Kanun Thanii, Shubat, Athar...)
- ✅ Full Arabic interface with RTL support
- ✅ Complete authentication and security system
- ✅ Mobile-responsive design

## Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | 18.x or higher |
| npm | 9.x or higher |
| Supabase | Active account |

## Installation

```bash
# Clone the repository
git clone https://github.com/your-repo/ahmedhall.git
cd ahmedhall

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

1. Create a new project in Supabase
2. Execute the table creation script:
```bash
psql -h your-host -U postgres -d your-db -f scripts/001_create_tables.sql
```

3. (Optional) Execute the seed data script:
```bash
psql -h your-host -U postgres -d your-db -f scripts/002_seed_data.sql
```

## Project Structure

```
ahmedhall/
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
│   └── ui/                 # UI components
├── lib/                    # Libraries and utilities
│   ├── supabase/           # Supabase configuration
│   ├── nabataean-calendar.ts # Nabataean calendar
│   └── types.ts            # Type definitions
├── scripts/                 # Database scripts
└── public/                 # Static assets
```

## Usage

### Login

1. Navigate to `/auth/login`
2. Enter email and password
3. You will be redirected to the dashboard

### Managing Bookings

- **Add new booking**: Click "New Booking" button on bookings page
- **Edit booking**: Click on any existing booking
- **Delete booking**: Use delete button with confirmation

### Managing Halls and Organizations

- Navigate to "Halls" or "Organizations" pages
- Add, edit, or delete records as needed

## Troubleshooting

### Database Connection Error

Ensure:
1. Environment variables are correct
2. RLS is enabled in Supabase (or disabled for testing)
3. Database URL is correct

### Authentication Issues

1. Make sure email authentication is enabled in Supabase
2. Verify SMTP is configured (for emails)

### Rendering Issues

- Clear cache: `npm run build`
- Verify Next.js is running: `npm run dev`

## Contributing

We welcome contributions! Please:

1. Create an Issue to describe the problem
2. Fork the project
3. Create a new branch: `git checkout -b feature/your-feature`
4. Follow code standards
5. Submit a Pull Request

## License

MIT License - See LICENSE file for details.

## Contact

For inquiries and support:
- Email: support@municipality.gov.jo
- Phone: +962-6-xxxxxxx

---

<div align="center">

Made with ❤️ for the Municipality

</div>
