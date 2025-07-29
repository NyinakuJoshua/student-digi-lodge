-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  student_id TEXT,
  university TEXT DEFAULT 'AAMUSTED',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create hostels table
CREATE TABLE public.hostels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  detailed_address TEXT,
  price_per_semester DECIMAL(10,2) NOT NULL,
  price_per_month DECIMAL(10,2),
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  rooms_available INTEGER DEFAULT 0,
  total_rooms INTEGER DEFAULT 0,
  distance_from_campus TEXT,
  amenities TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  contact_whatsapp TEXT,
  owner_id UUID REFERENCES public.profiles(id),
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create favorites table
CREATE TABLE public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, hostel_id)
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  hostel_id UUID NOT NULL REFERENCES public.hostels(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, hostel_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for hostels (public read, authenticated users can see all)
CREATE POLICY "Hostels are viewable by everyone" ON public.hostels
  FOR SELECT USING (is_active = true);

CREATE POLICY "Hostel owners can update their hostels" ON public.hostels
  FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = owner_id));

CREATE POLICY "Authenticated users can create hostels" ON public.hostels
  FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = owner_id));

-- RLS Policies for favorites
CREATE POLICY "Users can view their own favorites" ON public.favorites
  FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = user_id));

CREATE POLICY "Users can create their own favorites" ON public.favorites
  FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = user_id));

CREATE POLICY "Users can delete their own favorites" ON public.favorites
  FOR DELETE USING (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = user_id));

-- RLS Policies for reviews
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = user_id));

CREATE POLICY "Users can update their own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = user_id));

CREATE POLICY "Users can delete their own reviews" ON public.reviews
  FOR DELETE USING (auth.uid() = (SELECT user_id FROM public.profiles WHERE id = user_id));

-- Function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hostels_updated_at
  BEFORE UPDATE ON public.hostels
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample hostels data
INSERT INTO public.hostels (name, description, location, detailed_address, price_per_semester, price_per_month, rating, total_reviews, rooms_available, total_rooms, distance_from_campus, amenities, contact_name, contact_phone, contact_email, is_verified, is_active) VALUES
('AAMUSTED Student Lodge', 'Modern student accommodation with all essential amenities. Close to campus with excellent security and study facilities.', 'Near Main Campus Gate', 'Plot 15, University Road, Sunyani', 1200.00, 400.00, 4.8, 156, 12, 50, '0.2km from campus', '{"WiFi", "Security", "Common Room", "Kitchen", "Laundry", "Study Room", "Parking"}', 'Mr. Kwame Asante', '+233 24 123 4567', 'contact@aamustudentlodge.com', true, true),

('University Heights Hostel', 'Affordable accommodation with modern facilities. Perfect for students looking for comfort and convenience near AAMUSTED campus.', 'Sunyani Campus Area', 'Block C, University Heights, Sunyani', 950.00, 316.67, 4.5, 89, 8, 40, '0.5km from campus', '{"WiFi", "Parking", "Laundry", "Study Room", "Security", "Generator", "Water Supply"}', 'Mrs. Akosua Mensah', '+233 20 987 6543', 'info@uniheights.gh', true, true),

('Campus View Residence', 'Premium student accommodation offering luxury living with outstanding amenities and services for discerning students.', 'Behind Library Complex', 'Academic Area, Campus View Estate, Sunyani', 1400.00, 466.67, 4.9, 203, 5, 30, '0.1km from campus', '{"WiFi", "AC", "Generator", "Security", "Gym", "Swimming Pool", "Cafeteria", "24/7 Water", "DSTV"}', 'Dr. Emmanuel Osei', '+233 26 555 7890', 'admin@campusview.edu.gh', true, true),

('Green Valley Hostel', 'Eco-friendly student accommodation with solar power and green spaces. Affordable rates with excellent facilities.', 'Abesim Junction', '23 Green Valley Road, Abesim, Sunyani', 800.00, 266.67, 4.2, 67, 15, 35, '1.2km from campus', '{"WiFi", "Solar Power", "Garden", "Security", "Study Hall", "Kitchen", "Borehole Water"}', 'Mr. Joseph Boateng', '+233 24 777 8888', 'greenvalley@gmail.com', true, true),

('Royal Student Palace', 'Luxurious accommodation with modern amenities and excellent service. Perfect for students who value comfort and style.', 'Fiapre Road', 'Royal Estate, Fiapre Road, Sunyani', 1600.00, 533.33, 4.7, 134, 7, 25, '0.8km from campus', '{"WiFi", "AC", "Elevator", "Security", "Housekeeping", "Restaurant", "Conference Room", "Backup Generator"}', 'Princess Adwoa Serwaa', '+233 20 333 4444', 'info@royalpalace.com.gh', true, true),

('Harmony Hall', 'Budget-friendly accommodation with basic amenities. Clean and safe environment for students on a tight budget.', 'Magazine', 'Harmony Street, Magazine, Sunyani', 650.00, 216.67, 3.9, 45, 20, 60, '1.8km from campus', '{"WiFi", "Security", "Common Kitchen", "Study Area", "Water Supply", "Shared Bathroom"}', 'Mr. Isaac Owusu', '+233 24 999 1111', 'harmonyhall@yahoo.com', true, true);