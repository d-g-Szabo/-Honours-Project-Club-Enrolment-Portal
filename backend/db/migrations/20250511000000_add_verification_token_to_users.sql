alter table public.users
add column if not exists verification_token text,
add column if not exists verification_token_expires_at timestamp with time zone;