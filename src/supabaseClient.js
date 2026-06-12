import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://eurrfbiavliahmhdxybp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1cnJmYmlhdmxpYWhtaGR4eWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyMDYyMTUsImV4cCI6MjA5Njc4MjIxNX0.hW7E5Z-02WTBiezSjUzjIBjfMc3OgYexFlvzlgJO3p0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
