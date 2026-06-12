-- Run this in your Supabase SQL Editor to create the crypto portfolio table

CREATE TABLE IF NOT EXISTS public.crypto_portfolio (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  coin_id text NOT NULL,
  amount numeric DEFAULT 0,
  is_watchlist boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Ensure a user can only have one entry per coin
  UNIQUE(user_id, coin_id)
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.crypto_portfolio ENABLE ROW LEVEL SECURITY;

-- Create policies so users can only see and manage their own portfolio data
CREATE POLICY "Users can view their own portfolio" 
ON public.crypto_portfolio FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own portfolio" 
ON public.crypto_portfolio FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own portfolio" 
ON public.crypto_portfolio FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own portfolio" 
ON public.crypto_portfolio FOR DELETE 
USING (auth.uid() = user_id);
