create or replace function public.generate_verification_token()
returns text
language plpgsql
as $$
begin
  return encode(gen_random_bytes(32), 'hex');
end;
$$;

create or replace function public.verify_email(token text)
returns boolean
language plpgsql
as $$
begin
  update public.users
  set is_active = true
  where verification_token = token
    and verification_token_expires_at > now()
    and is_active = false;

  return found;
end;
$$;