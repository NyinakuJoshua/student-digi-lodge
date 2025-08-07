-- Fix hostel registration issues by cleaning up the data flow

-- 1. Drop the deprecated Register_Hostel table as it's not being used properly
DROP TABLE IF EXISTS public."Register_Hostel";

-- 2. Update the handle_new_user function to properly handle hostel owners
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Create a profile for the new user
  INSERT INTO public.profiles (user_id, full_name, email, role, phone)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    NEW.raw_user_meta_data->>'phone'
  );
  
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
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Fix RLS policies for hostel_registrations table to use profile IDs correctly
DROP POLICY IF EXISTS "Users can create their own hostel registrations" ON public.hostel_registrations;
DROP POLICY IF EXISTS "Users can view their own hostel registrations" ON public.hostel_registrations;
DROP POLICY IF EXISTS "Users can update their own hostel registrations" ON public.hostel_registrations;
DROP POLICY IF EXISTS "Users can delete their own hostel registrations" ON public.hostel_registrations;

CREATE POLICY "Users can create their own hostel registrations" 
  ON public.hostel_registrations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own hostel registrations" 
  ON public.hostel_registrations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own hostel registrations" 
  ON public.hostel_registrations 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own hostel registrations" 
  ON public.hostel_registrations 
  FOR DELETE 
  USING (auth.uid() = user_id);