-- 1. Add role column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

-- 2. Make the very first user the Admin (this assumes the first signed-up user is the owner)
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id FROM public.profiles ORDER BY created_at ASC LIMIT 1
);

-- 3. Create the user_favorites table for the "My Library" feature
CREATE TABLE IF NOT EXISTS public.user_favorites (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    game_id text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, game_id)
);

-- 4. Enable Row Level Security (RLS) on user_favorites
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies so users can only manage their own favorites
CREATE POLICY "Users can view their own favorites" 
ON public.user_favorites FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" 
ON public.user_favorites FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" 
ON public.user_favorites FOR DELETE 
USING (auth.uid() = user_id);

-- 6. Grant basic privileges
GRANT SELECT, INSERT, DELETE ON public.user_favorites TO authenticated;
