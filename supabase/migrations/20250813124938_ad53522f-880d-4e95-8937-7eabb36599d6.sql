-- First, create the trigger for the handle_new_user function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also, let's update the handle_new_user function to be more robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  profile_id uuid;
BEGIN
  -- Create a profile for the new user
  INSERT INTO public.profiles (user_id, full_name, email, role, phone)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  )
  RETURNING id INTO profile_id;
  
  -- If this is a hostel owner, create a hostel entry using the profile ID
  IF NEW.raw_user_meta_data->>'role' = 'hostel_owner' THEN
    INSERT INTO public.hostels (
      owner_id, 
      name, 
      location,
      description,
      price_per_semester,
      contact_name,
      contact_email,
      contact_phone
    ) VALUES (
      profile_id,
      COALESCE(NEW.raw_user_meta_data->>'hostel_name', 'New Hostel'),
      COALESCE(NEW.raw_user_meta_data->>'hostel_location', 'Location TBD'),
      'Welcome to ' || COALESCE(NEW.raw_user_meta_data->>'hostel_name', 'New Hostel') || '! Please update this description.',
      1000, -- Default price, owner can update
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'phone', '')
    );
  END IF;
  
  RETURN NEW;
END;
$function$