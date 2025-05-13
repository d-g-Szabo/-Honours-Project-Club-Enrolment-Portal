create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text,
  date date not null,
  time time not null,
  duration integer not null, -- in minutes
  capacity integer not null,
  booked_slots integer not null default 0,
  price numeric(10,2) not null default 0,
  status text not null check (status in ('Booked', 'Available')),
  created_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now())
); 