-- 1. Add all necessary columns FIRST so the trigger doesn't error out
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'user'::text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_customer_id text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_subscription_id text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS trial_seconds_remaining integer DEFAULT 3600 NOT NULL;

-- 2. Create the trigger function using the safest Supabase method
CREATE OR REPLACE FUNCTION public.protect_profile_fields()
RETURNS trigger AS $$
BEGIN
  -- auth.role() returns 'authenticated' or 'anon' when called from the client browser.
  -- When your backend server uses the service_role key, auth.role() is 'service_role'.
  -- When you run scripts in the SQL Editor, it is null.
  IF auth.role() IN ('authenticated', 'anon') THEN
    -- Silently ignore client attempts to update these protected fields
    NEW.plan = OLD.plan;
    NEW.role = OLD.role;
    NEW.stripe_customer_id = OLD.stripe_customer_id;
    NEW.stripe_subscription_id = OLD.stripe_subscription_id;
    NEW.trial_seconds_remaining = OLD.trial_seconds_remaining;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Attach the trigger to the profiles table
DROP TRIGGER IF EXISTS enforce_profile_security ON public.profiles;
CREATE TRIGGER enforce_profile_security
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE PROCEDURE public.protect_profile_fields();
