# Madaraka Transfers

A production-ready shuttle booking platform for SGR (Standard Gauge Railway) shared transport in Coastal Kenya. Similar to Buupass but tailored for Mombasa and surrounding towns.

## Features

- **Flat per-route pricing** - Each route has its own base fare
- **Door-to-door service** - Configurable per route (+KES 150)
- **Seat management** - Support for 7, 11, 14, 16, 28, 32 seater vehicles
- **Static routes & schedules** - Day-of-week operation
- **Full admin CRUD** - Routes, schedules, vehicles, bookings, manifests
- **M-Pesa STK Push** - Full Daraja API integration
- **SMS confirmations** - Africa's Talking integration
- **Booking tracking** - Public status lookup by reference
- **Driver manifests** - Grouped by schedule with WhatsApp share
- **Mobile-first design** - Responsive down to 375px

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Prisma ORM + PostgreSQL
- NextAuth.js authentication
- M-Pesa Daraja API
- Africa's Talking SMS

## Quick Start

```bash
# 1. Clone and install
cd madaraka-transfers
npm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local with your credentials

# 3. Database
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed

# 4. Run dev server
npm run dev

# 5. Open http://localhost:3000
# Admin: http://localhost:3000/admin/login
# Default: admin / Madaraka2024!
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random secret for JWT |
| `NEXTAUTH_URL` | Your app URL |
| `ADMIN_USERNAME` | Admin login username |
| `ADMIN_PASSWORD` | Admin login password |
| `MPESA_CONSUMER_KEY` | Daraja API consumer key |
| `MPESA_CONSUMER_SECRET` | Daraja API consumer secret |
| `MPESA_PASSKEY` | Daraja passkey |
| `MPESA_SHORTCODE` | Paybill number |
| `AT_API_KEY` | Africa's Talking API key |
| `AT_USERNAME` | Africa's Talking username |

## Deployment

### Vercel + Supabase
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Connect Supabase PostgreSQL database
5. Run `npx prisma migrate deploy`

### Docker
```bash
docker-compose up -d
```

## Project Structure

```
madaraka-transfers/
├── prisma/              # Database schema + seed
├── src/
│   ├── app/             # Next.js app router
│   │   ├── (public)/    # Public pages
│   │   ├── (admin)/     # Admin dashboard
│   │   └── api/         # API routes
│   ├── components/      # UI components
│   ├── hooks/           # React hooks
│   ├── lib/             # Utilities
│   └── types/           # TypeScript types
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## License

MIT
