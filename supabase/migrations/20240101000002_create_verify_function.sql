-- Create function to verify admin password
CREATE OR REPLACE FUNCTION verify_admin_password(
  username_input TEXT,
  password_input TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  stored_password TEXT;
BEGIN
  -- Get the stored password for the given username
  SELECT password INTO stored_password
  FROM admin
  WHERE username = username_input;

  -- Compare the stored password with the input password
  RETURN stored_password = crypt(password_input, stored_password);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;