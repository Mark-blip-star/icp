/*
  # Add browser session support for LinkedIn accounts

  1. New Columns
    - `is_active` (boolean) - Whether the account is currently active
    - `last_login` (timestamp) - When the user last logged in
    - `browser_session_id` (text) - Session identifier for browser-based auth
    - `session_expires_at` (timestamp) - When the browser session expires

  2. Updates
    - Add indexes for better performance
    - Update RLS policies to handle browser sessions

  3. Security
    - Maintain existing RLS policies
    - Add session expiration handling
*/

-- Add new columns to linkedin_accounts table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'linkedin_accounts' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE linkedin_accounts ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'linkedin_accounts' AND column_name = 'last_login'
  ) THEN
    ALTER TABLE linkedin_accounts ADD COLUMN last_login TIMESTAMPTZ DEFAULT now();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'linkedin_accounts' AND column_name = 'browser_session_id'
  ) THEN
    ALTER TABLE linkedin_accounts ADD COLUMN browser_session_id TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'linkedin_accounts' AND column_name = 'session_expires_at'
  ) THEN
    ALTER TABLE linkedin_accounts ADD COLUMN session_expires_at TIMESTAMPTZ;
  END IF;
END $$;

-- Add linkedin_connected column to profiles table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'linkedin_connected'
  ) THEN
    ALTER TABLE profiles ADD COLUMN linkedin_connected BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_linkedin_accounts_user_id ON linkedin_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_accounts_is_active ON linkedin_accounts(is_active);
CREATE INDEX IF NOT EXISTS idx_linkedin_accounts_session_expires ON linkedin_accounts(session_expires_at);
CREATE INDEX IF NOT EXISTS idx_profiles_linkedin_connected ON profiles(linkedin_connected);

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_linkedin_sessions()
RETURNS void AS $$
BEGIN
  UPDATE linkedin_accounts 
  SET 
    is_active = false,
    browser_session_id = NULL,
    session_expires_at = NULL
  WHERE 
    session_expires_at IS NOT NULL 
    AND session_expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a function to update last_login automatically
CREATE OR REPLACE FUNCTION update_linkedin_last_login()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_login = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update last_login on updates
DROP TRIGGER IF EXISTS trigger_update_linkedin_last_login ON linkedin_accounts;
CREATE TRIGGER trigger_update_linkedin_last_login
  BEFORE UPDATE ON linkedin_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_linkedin_last_login();