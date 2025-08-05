-- Add phone column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Update the handle_new_user function to include additional data for hostel owners
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, role, phone)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    NEW.raw_user_meta_data->>'phone'
  );
  
  -- If this is a hostel owner, create a hostel entry
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
      (SELECT id FROM public.profiles WHERE user_id = NEW.id),
      NEW.raw_user_meta_data->>'hostel_name',
      NEW.raw_user_meta_data->>'hostel_location',
      'Welcome to ' || NEW.raw_user_meta_data->>'hostel_name' || '! Please update this description.',
      1000, -- Default price, owner can update
      NEW.raw_user_meta_data->>'full_name',
      NEW.email,
      NEW.raw_user_meta_data->>'phone'
    );
  END IF;
  
  RETURN NEW;
END;
$function$;