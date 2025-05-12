CREATE OR REPLACE FUNCTION create_user_profile(user_id uuid, user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO users (id, email)
  VALUES (user_id, user_email)
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email;
END;
$$;