-- Check if monthly_imports column exists before adding it
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'monthly_imports'
    ) THEN
        ALTER TABLE profiles ADD COLUMN monthly_imports INTEGER DEFAULT 0;
    END IF;
END $$;

-- Drop trial_end_date column as we're moving to a free tier model
ALTER TABLE profiles DROP COLUMN IF EXISTS trial_end_date;

-- Create function to increment monthly_imports
CREATE OR REPLACE FUNCTION increment_monthly_imports()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles 
  SET monthly_imports = COALESCE(monthly_imports, 0) + 1
  WHERE id = (
    SELECT user_id 
    FROM linkedin_campaigns 
    WHERE id = NEW.campaign_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to increment monthly_imports when a new contact is imported
DROP TRIGGER IF EXISTS increment_monthly_imports_trigger ON linkedin_connections;
CREATE TRIGGER increment_monthly_imports_trigger
  AFTER INSERT ON linkedin_connections
  FOR EACH ROW
  EXECUTE FUNCTION increment_monthly_imports();

-- Create function to reset monthly_imports at the start of each month
CREATE OR REPLACE FUNCTION reset_monthly_imports()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles SET monthly_imports = 0;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to reset monthly_imports at the start of each month
DROP TRIGGER IF EXISTS reset_monthly_imports_trigger ON profiles;
CREATE TRIGGER reset_monthly_imports_trigger
  AFTER INSERT OR UPDATE ON profiles
  FOR EACH STATEMENT
  WHEN (EXTRACT(DAY FROM CURRENT_TIMESTAMP) = 1 AND EXTRACT(HOUR FROM CURRENT_TIMESTAMP) = 0)
  EXECUTE FUNCTION reset_monthly_imports(); 