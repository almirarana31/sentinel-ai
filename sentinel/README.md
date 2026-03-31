# Sentinel - Next.js Demo App

Sentinel is a Next.js demo app with:

- email/password signup
- email verification with Gmail SMTP through Nodemailer
- login + session token creation
- consent collection points loaded from PostgreSQL
- consent submission storage
- admin consent listing

## Stack

- Frontend: Next.js (Pages Router), TypeScript, Tailwind CSS
- Backend: Next.js API routes
- Database: PostgreSQL with `pg`
- Email: Nodemailer with Gmail SMTP

## 1. Prerequisites

- Node.js 18+
- npm
- PostgreSQL running locally
- a Gmail account with a Google App Password

## 2. Create `.env.local`

Create `sentinel/.env.local` with:

```env
DATABASE_URL=postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/sentinel_db

NEXT_PUBLIC_APP_URL=http://localhost:3000
APP_URL=http://localhost:3000

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your@gmail.com
SMTP_PASS=your_16_char_gmail_app_password
SMTP_FROM="Sentinel <your@gmail.com>"
```

Important notes:

- If your Postgres password contains special characters like `@`, `:`, `/`, or `#`, URL-encode them in `DATABASE_URL`.
- Use `.env.local` for Next.js local development.
- Gmail must use an App Password, not your normal Gmail password.

## 3. PostgreSQL setup

If your database already exists as `sentinel_db`, you can keep using it.

### Option A: create the database from `psql`

```sql
CREATE DATABASE sentinel_db;
```

### Option B: use your existing database

If `sentinel_db` already exists, do not recreate it.

## 4. Install dependencies

```bash
npm install
```

## 5. Start the app

```bash
npm run dev
```

Open:

- app: `http://localhost:3000`
- health check: `http://localhost:3000/api/health`

## 6. How PostgreSQL is connected

The app uses:

- [`pool.ts`](C:\Users\almir\sentinel-ai\sentinel\lib\db\pool.ts)
- [`schema.ts`](C:\Users\almir\sentinel-ai\sentinel\lib\db\schema.ts)

How it works:

1. `DATABASE_URL` is read from `.env.local`
2. `pg.Pool` opens the connection
3. `ensureSchema()` runs automatically the first time an API route touches the DB
4. tables are created if they do not exist
5. the default consent collection point `cp_sentinel_demo_001` is seeded automatically

You do not need to run a separate migration command for local testing because the API bootstraps the schema on first use.

## 7. Tables created automatically

The backend creates:

- `app_user`
- `email_verification_token`
- `app_session`
- `consent_collection_point`
- `consent_submission`

## 8. API endpoints

### Health

- `GET /api/health`

Checks if PostgreSQL is reachable.

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/verify-email`
- `POST /api/auth/resend-verification`

### Consent

- `GET /api/user/consents/cp_sentinel_demo_001`
- `POST /api/user/consents/cp_sentinel_demo_001`
- `GET /api/admin/consents`

## 9. Insomnia testing guide

Base URL:

```text
http://localhost:3000
```

### Step 1: test DB connectivity

Request:

- Method: `GET`
- URL: `http://localhost:3000/api/health`

Expected response:

```json
{
  "ok": true,
  "database": "connected"
}
```

If this fails, your Postgres connection is not set up yet.

### Step 2: sign up a user

Request:

- Method: `POST`
- URL: `http://localhost:3000/api/auth/signup`
- Header: `Content-Type: application/json`

Body:

```json
{
  "name": "Almira",
  "email": "your_test_email@gmail.com",
  "password": "Password123"
}
```

Expected result:

- status `201`
- response says verification is required
- a 6-digit code is sent to the email

### Step 3: verify email

Request:

- Method: `POST`
- URL: `http://localhost:3000/api/auth/verify-email`
- Header: `Content-Type: application/json`

Body:

```json
{
  "email": "your_test_email@gmail.com",
  "code": "123456"
}
```

Expected result:

```json
{
  "ok": true
}
```

### Step 4: log in

Request:

- Method: `POST`
- URL: `http://localhost:3000/api/auth/login`
- Header: `Content-Type: application/json`

Body:

```json
{
  "email": "your_test_email@gmail.com",
  "password": "Password123",
  "name": "Almira"
}
```

Expected result:

- status `200`
- response contains:
  - `token`
  - `user`

Save the `token`. You will use it as a Bearer token for consent submission.

### Step 5: fetch consent collection point

Request:

- Method: `GET`
- URL: `http://localhost:3000/api/user/consents/cp_sentinel_demo_001`

Expected result:

```json
{
  "ok": true,
  "code_collection_point": "cp_sentinel_demo_001",
  "name": "Sentinel Demo Collection Point",
  "consents": [
    { "code_consent": "MARKETING", "label": "Marketing" },
    { "code_consent": "BIO_METRIK", "label": "Bio Metrik" },
    { "code_consent": "DATA_ANAK", "label": "Data Anak" }
  ]
}
```

### Step 6: submit consent

Request:

- Method: `POST`
- URL: `http://localhost:3000/api/user/consents/cp_sentinel_demo_001`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_LOGIN_TOKEN`

Body:

```json
{
  "consents": [
    { "code_consent": "MARKETING", "is_agree": true },
    { "code_consent": "BIO_METRIK", "is_agree": false },
    { "code_consent": "DATA_ANAK", "is_agree": false }
  ]
}
```

Expected result:

```json
{
  "ok": true
}
```

### Step 7: read admin consent records

Request:

- Method: `GET`
- URL: `http://localhost:3000/api/admin/consents`

Expected result:

- latest consent records from PostgreSQL
- includes email, name, collection point, payload, created time

## 10. Troubleshooting

### `password authentication failed for user "postgres"`

Your `DATABASE_URL` password is wrong. Update `.env.local`.

### `Missing DATABASE_URL`

You created `.env.local` in the wrong folder or the dev server needs a restart.

### Gmail does not send

Check:

- `SMTP_USER` is your Gmail address
- `SMTP_PASS` is a Google App Password
- `SMTP_SECURE=true`
- `SMTP_PORT=465`

### Consent page does not load definitions

Test:

```text
GET http://localhost:3000/api/user/consents/cp_sentinel_demo_001
```

If it fails, test:

```text
GET http://localhost:3000/api/health
```

## 11. Quick local test flow

1. Start Postgres
2. Start `npm run dev`
3. Check `GET /api/health`
4. `POST /api/auth/signup`
5. read the email code
6. `POST /api/auth/verify-email`
7. `POST /api/auth/login`
8. copy the returned token
9. `GET /api/user/consents/cp_sentinel_demo_001`
10. `POST /api/user/consents/cp_sentinel_demo_001`
11. `GET /api/admin/consents`
