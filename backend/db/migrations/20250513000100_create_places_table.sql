create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.sessions(id) on delete cascade,
  club_id uuid not null references public.users(id) on delete cascade,
  type text not null check (type in ('Physical', 'Virtual')),
  address1 text,
  address2 text,
  city text,
  state text,
  county text,
  postal_code text,
  link text,
  fee_type text not null check (fee_type in ('Paid', 'Free')),
  created_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now()),
  constraint physical_address_required check (
    (type = 'Physical' and address1 is not null and city is not null and state is not null and postal_code is not null)
    or (type = 'Virtual' and link is not null)
  )
); 