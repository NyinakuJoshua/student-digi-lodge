-- Update the handle_new_user function to be more robust with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  profile_id uuid;
BEGIN
  -- Create a profile for the new user with better error handling
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
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error and continue, don't block user creation
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$function$