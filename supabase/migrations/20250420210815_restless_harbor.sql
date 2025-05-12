--Fixing Users Table RLS Policies

-- Drop existing policies
DROP POLICY IF EXISTS "Enable insert for authentication" ON public.users;
DROP POLICY IF EXISTS "Enable select for authenticated users" ON public.users;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.users;
DROP POLICY IF EXISTS "Enable delete for users based on id" ON public.users;

-- Create new policies with proper permissions
CREATE POLICY "Allow insert during signup"
  ON public.users
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can read own data"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own data"
  ON public.users
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);