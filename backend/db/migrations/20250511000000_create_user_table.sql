create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  is_active boolean not null default true,
  type text not null check (type in ('user', 'club')),
  created_at timestamp with time zone default timezone('utc', now())
);