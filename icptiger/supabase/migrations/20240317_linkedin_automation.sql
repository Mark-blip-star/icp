-- Create the LinkedIn campaigns table
CREATE TABLE IF NOT EXISTS linkedin_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  linkedin_url TEXT NOT NULL,
  connection_message TEXT,
  follow_up_message TEXT,
  follow_up_days INTEGER NOT NULL DEFAULT 3,
  daily_limit INTEGER NOT NULL DEFAULT 20,
  status TEXT NOT NULL DEFAULT 'queued',
  status_message TEXT,
  total_profiles INTEGER,
  processed_profiles INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Add RLS policies for linkedin_campaigns
ALTER TABLE linkedin_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own campaigns" 
  ON linkedin_campaigns FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own campaigns" 
  ON linkedin_campaigns FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaigns" 
  ON linkedin_campaigns FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own campaigns" 
  ON linkedin_campaigns FOR DELETE 
  USING (auth.uid() = user_id);

-- Create the LinkedIn connections table
CREATE TABLE IF NOT EXISTS linkedin_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES linkedin_campaigns(id) ON DELETE CASCADE,
  profile_url TEXT NOT NULL,
  first_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  skip_reason TEXT,
  connection_message TEXT,
  follow_up_message TEXT,
  follow_up_error TEXT,
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  connected_at TIMESTAMP WITH TIME ZONE,
  follow_up_sent_at TIMESTAMP WITH TIME ZONE
);

-- Add RLS policies for linkedin_connections
ALTER TABLE linkedin_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own connections" 
  ON linkedin_connections FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT user_id FROM linkedin_campaigns 
      WHERE id = linkedin_connections.campaign_id
    )
  );

CREATE POLICY "Users can create their own connections" 
  ON linkedin_connections FOR INSERT 
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM linkedin_campaigns 
      WHERE id = linkedin_connections.campaign_id
    )
  );

CREATE POLICY "Users can update their own connections" 
  ON linkedin_connections FOR UPDATE 
  USING (
    auth.uid() IN (
      SELECT user_id FROM linkedin_campaigns 
      WHERE id = linkedin_connections.campaign_id
    )
  );

-- Create the LinkedIn settings table
CREATE TABLE IF NOT EXISTS linkedin_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credentials JSONB NOT NULL,
  security_settings JSONB NOT NULL,
  advanced_settings JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_settings UNIQUE (user_id)
);

-- Add RLS policies for linkedin_settings
ALTER TABLE linkedin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own settings" 
  ON linkedin_settings FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own settings" 
  ON linkedin_settings FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" 
  ON linkedin_settings FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create the LinkedIn blocked profiles table
CREATE TABLE IF NOT EXISTS linkedin_blocked_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_blocked_profile UNIQUE (user_id, profile_url)
);

-- Add RLS policies for linkedin_blocked_profiles
ALTER TABLE linkedin_blocked_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own blocked profiles" 
  ON linkedin_blocked_profiles FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add blocked profiles" 
  ON linkedin_blocked_profiles FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own blocked profiles" 
  ON linkedin_blocked_profiles FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for faster querying
CREATE INDEX linkedin_connections_campaign_id_idx ON linkedin_connections(campaign_id);
CREATE INDEX linkedin_campaigns_user_id_idx ON linkedin_campaigns(user_id);
CREATE INDEX linkedin_connections_status_idx ON linkedin_connections(status);
CREATE INDEX linkedin_blocked_profiles_user_id_idx ON linkedin_blocked_profiles(user_id);

-- Create update trigger for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_linkedin_campaigns_updated_at
BEFORE UPDATE ON linkedin_campaigns
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_linkedin_settings_updated_at
BEFORE UPDATE ON linkedin_settings
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column(); 