CREATE TABLE IF NOT EXISTS app_user (
  id text PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text,
  password_salt text,
  password_hash text,
  email_verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

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
