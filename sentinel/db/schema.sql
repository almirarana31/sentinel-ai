CREATE TABLE IF NOT EXISTS app_user (
  id text PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text,
  role text NOT NULL DEFAULT 'user',
  password_salt text,
  password_hash text,
  email_verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE app_user ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user';

CREATE TABLE IF NOT EXISTS email_verification_token (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  token_hash text NOT NULL,
  attempts int NOT NULL DEFAULT 0,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_email_verification_token_hash ON email_verification_token(token_hash);
CREATE INDEX IF NOT EXISTS idx_email_verification_token_user_id ON email_verification_token(user_id);

CREATE TABLE IF NOT EXISTS app_session (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  token_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_app_session_token_hash ON app_session(token_hash);

CREATE TABLE IF NOT EXISTS consent_submission (
  id text PRIMARY KEY,
  user_id text REFERENCES app_user(id) ON DELETE SET NULL,
  code_collection_point text NOT NULL,
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_consent_submission_user_id ON consent_submission(user_id);
CREATE INDEX IF NOT EXISTS idx_consent_submission_created_at ON consent_submission(created_at);

CREATE TABLE IF NOT EXISTS consent_collection_point (
  code text PRIMARY KEY,
  name text NOT NULL,
  consents jsonb NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO consent_collection_point (code, name, consents, is_active)
VALUES (
  'cp_sentinel_demo_001',
  'Sentinel Demo Collection Point',
  '[
    {"code_consent":"MARKETING","label":"Marketing"},
    {"code_consent":"BIO_METRIK","label":"Bio Metrik"},
    {"code_consent":"DATA_ANAK","label":"Data Anak"}
  ]'::jsonb,
  true
)
ON CONFLICT (code) DO UPDATE
SET
  name = EXCLUDED.name,
  consents = EXCLUDED.consents,
  is_active = EXCLUDED.is_active,
  updated_at = now();

UPDATE app_user
SET role = 'admin'
WHERE email = 'almira@gmail.com';
