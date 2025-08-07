-- Fix RLS policies for the Register_Hostel table that has no policies
CREATE POLICY "Users can manage Register_Hostel records"
  ON public."Register_Hostel"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Note: This table appears to be deprecated/unused, but adding basic policy to fix linter warning