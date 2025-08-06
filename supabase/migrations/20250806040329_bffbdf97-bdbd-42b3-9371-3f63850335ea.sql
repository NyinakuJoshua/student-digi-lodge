-- Create hostel_registrations table without touching existing tables
create table if not exists public.hostel_registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null, -- stores auth.uid() directly (no FK to avoid coupling)
  email text not null,
  full_name text not null,
  hostel_name text not null,
  phone text,
  hostel_location text,
  status text not null default 'pending', -- pending | approved | rejected
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.hostel_registrations enable row level security;

-- Policies: users can manage their own registration rows
create policy if not exists "Users can create their own hostel registrations"
  on public.hostel_registrations for insert
  with check (auth.uid() = user_id);

create policy if not exists "Users can view their own hostel registrations"
  on public.hostel_registrations for select
  using (auth.uid() = user_id);

create policy if not exists "Users can update their own hostel registrations"
  on public.hostel_registrations for update
  using (auth.uid() = user_id);

-- Optional: prevent deletes for now (no delete policy)

-- Trigger to keep updated_at fresh (uses existing function)
create trigger if not exists trg_hostel_registrations_updated_at
before update on public.hostel_registrations
for each row execute function public.update_updated_at_column();

-- Index for faster lookups by user
create index if not exists idx_hostel_registrations_user_id on public.hostel_registrations(user_id);
