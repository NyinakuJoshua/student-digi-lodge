-- Create bookings table to handle hostel reservations
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  hostel_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  student_id TEXT,
  check_in_date DATE NOT NULL,
  check_out_date DATE,
  room_type TEXT,
  special_requests TEXT,
  total_amount NUMERIC,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for bookings
CREATE POLICY "Users can view their own bookings" 
ON public.bookings 
FOR SELECT 
USING (auth.uid() = (SELECT profiles.user_id FROM profiles WHERE profiles.id = bookings.user_id));

CREATE POLICY "Users can create their own bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (auth.uid() = (SELECT profiles.user_id FROM profiles WHERE profiles.id = bookings.user_id));

CREATE POLICY "Users can update their own bookings" 
ON public.bookings 
FOR UPDATE 
USING (auth.uid() = (SELECT profiles.user_id FROM profiles WHERE profiles.id = bookings.user_id));

CREATE POLICY "Hostel owners can view bookings for their hostels" 
ON public.bookings 
FOR SELECT 
USING (auth.uid() = (SELECT profiles.user_id FROM profiles JOIN hostels ON profiles.id = hostels.owner_id WHERE hostels.id = bookings.hostel_id));

CREATE POLICY "Hostel owners can update booking status for their hostels" 
ON public.bookings 
FOR UPDATE 
USING (auth.uid() = (SELECT profiles.user_id FROM profiles JOIN hostels ON profiles.id = hostels.owner_id WHERE hostels.id = bookings.hostel_id));

-- Create trigger for updating updated_at column
CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();