-- Add jsessionid column to linkedin_accounts table
ALTER TABLE linkedin_accounts ADD COLUMN IF NOT EXISTS jsessionid TEXT;

-- Add comment to the column
COMMENT ON COLUMN linkedin_accounts.jsessionid IS 'LinkedIn JSESSIONID cookie for authentication';
