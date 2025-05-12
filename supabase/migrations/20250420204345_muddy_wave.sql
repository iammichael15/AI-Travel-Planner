--This is the user Authentication Policies

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can create their own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can delete own profile" ON users;

-- Create new policies
CREATE POLICY "Enable insert for authentication" ON public.users
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable select for authenticated users" ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Enable update for users based on id" ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable delete for users based on id" ON public.users
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);