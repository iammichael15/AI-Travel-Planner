--This is User Creation RLS

-- Drop existing policies
DROP POLICY IF EXISTS "Allow insert during signup" ON public.users;
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Users can delete own data" ON public.users;

-- Create new policies with proper permissions
CREATE POLICY "Enable all operations for service role"
  ON public.users
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable insert for all users"
  ON public.users
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Enable select for individual users"
  ON public.users
  FOR SELECT
  TO public
  USING (auth.uid() = id);

CREATE POLICY "Enable update for individual users"
  ON public.users
  FOR UPDATE
  TO public
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable delete for individual users"
  ON public.users
  FOR DELETE
  TO public
  USING (auth.uid() = id);