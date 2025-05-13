create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references public.payments(id) on delete cascade,
  status text not null,
  amount numeric(10,2) not null,
  currency text not null,
  paypal_transaction_id text not null,
  created_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now())
); 