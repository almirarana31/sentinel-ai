# Sentinel — AI-Powered Gamified Professional Training

Sentinel is a Next.js demo app with a consent flow plus email verification.

## Tech Stack
- **Frontend**: Next.js (Pages Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API routes
- **Database**: PostgreSQL (`pg`)
- **Email**: Nodemailer (SMTP)

## Local Setup

### 1. Prerequisites
- Node.js 18+
- PostgreSQL 15+ (or Docker Desktop)

### 2. Environment Configuration
Copy `sentinel/.env.example` to `sentinel/.env.local` and fill in values.

Notes:
- `.env` files must be `KEY=value` per line (no commas).
- Gmail App Passwords are sometimes displayed with spaces; remove the spaces.

### 3. Start PostgreSQL
If you already have a local DB named `sentinel_db`, skip Docker.

Optional: start the Docker services:
```bash
docker-compose up -d
```
If you use Docker, Postgres is exposed on port `5433` (see `docker-compose.yml`) so your `DATABASE_URL` must use `:5433`.

### 4. Install Dependencies
```bash
npm install
```

### 5. Database Setup
Run the schema once (recommended):
```bash
psql -U postgres -d sentinel_db -f db/schema.sql
```

### 6. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000`.

## Test Email Verification
1. Open `http://localhost:3000/signup`
2. Register with `name + email + password`
3. Check your inbox for the 6-digit code
4. Enter it at `http://localhost:3000/verify-email`
5. Sign in at `http://localhost:3000/login`

