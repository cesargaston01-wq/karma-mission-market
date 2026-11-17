UPDATE auth.users SET email_confirmed_at = coalesce(email_confirmed_at, now()) WHERE id = '2ff48002-860d-4ad2-8207-b00c15262852';
UPDATE public.profiles SET status = 'accepted' WHERE id = '2ff48002-860d-4ad2-8207-b00c15262852';
INSERT INTO public.user_roles (user_id, role) VALUES ('2ff48002-860d-4ad2-8207-b00c15262852', 'admin') ON CONFLICT DO NOTHING;