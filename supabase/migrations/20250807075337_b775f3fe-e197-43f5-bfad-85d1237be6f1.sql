-- Fix the RLS policy issue by adding delete policy for completeness
create policy "Users can delete their own hostel registrations"
  on public.hostel_registrations for delete
  using (auth.uid() = user_id);