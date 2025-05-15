create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user1_id uuid not null references public.users(id) on delete cascade,
  user2_id uuid not null references public.users(id) on delete cascade,
  user_a_id uuid not null,
  user_b_id uuid not null,
  created_at timestamp with time zone default timezone('utc', now()),
  constraint unique_user_pair unique (user_a_id, user_b_id)
); 