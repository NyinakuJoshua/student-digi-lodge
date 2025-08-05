-- Add role column to profiles table to distinguish regular users from hostel owners (admins)
ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'hostel_owner'));

-- Update existing profiles that own hostels to have hostel_owner role
UPDATE public.profiles 
SET role = 'hostel_owner' 
WHERE id IN (SELECT DISTINCT owner_id FROM public.hostels);

-- Create index for better performance
CREATE INDEX idx_profiles_role ON public.profiles(role);