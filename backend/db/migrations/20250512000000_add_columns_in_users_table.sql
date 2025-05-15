alter table public.users
add column if not exists description text;
add column if not exists phone text;