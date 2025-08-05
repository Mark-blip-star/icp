-- Add trial_end_date column to profiles table
ALTER TABLE profiles ADD COLUMN trial_end_date TIMESTAMP WITH TIME ZONE;

-- Drop credits table as it's no longer needed
DROP TABLE IF EXISTS credits;

-- Update existing profiles to have no trial end date
UPDATE profiles SET trial_end_date = NULL WHERE trial_end_date IS NULL; 