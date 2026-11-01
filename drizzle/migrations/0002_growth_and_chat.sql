CREATE TABLE public.growth_events (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), kind text NOT NULL CHECK (kind IN ('visit','signup','login')), actor text NOT NULL, occurred_at timestamptz NOT NULL DEFAULT now(), day date NOT NULL DEFAULT (now() AT TIME ZONE 'UTC')::date, UNIQUE(kind,actor,day));
GRANT ALL ON public.growth_events TO service_role;
ALTER TABLE public.growth_events ENABLE ROW LEVEL SECURITY;
CREATE INDEX growth_events_day ON public.growth_events(day,kind);
CREATE OR REPLACE FUNCTION public.record_signup_growth() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ BEGIN INSERT INTO public.growth_events(kind,actor,occurred_at,day) VALUES ('signup',NEW.id::text,NEW.created_at,(NEW.created_at AT TIME ZONE 'UTC')::date) ON CONFLICT DO NOTHING; RETURN NEW; END; $$;
REVOKE ALL ON FUNCTION public.record_signup_growth() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.record_signup_growth() TO service_role;
CREATE TRIGGER pulse_signup_growth AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.record_signup_growth();
INSERT INTO public.growth_events(kind,actor,occurred_at,day) SELECT 'signup',id::text,created_at,(created_at AT TIME ZONE 'UTC')::date FROM auth.users ON CONFLICT DO NOTHING;
CREATE OR REPLACE FUNCTION public.growth_summary(days integer DEFAULT 30) RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
WITH bounds AS (SELECT (now() AT TIME ZONE 'UTC')::date AS today, (now() AT TIME ZONE 'UTC')::date - (greatest(1,least(days,90))-1) AS start_day),
events AS (SELECT e.* FROM public.growth_events e,bounds b WHERE e.day BETWEEN b.start_day AND b.today),
returns AS (SELECT DISTINCT e.actor FROM events e WHERE e.kind='visit' AND EXISTS(SELECT 1 FROM public.growth_events p WHERE p.kind='visit' AND p.actor=e.actor AND p.day<e.day)),
daily AS (SELECT d::date AS day, count(DISTINCT e.actor) FILTER(WHERE e.kind='visit') AS visitors, count(*) FILTER(WHERE e.kind='signup') AS signups, count(*) FILTER(WHERE e.kind='login') AS logins FROM bounds b CROSS JOIN generate_series(b.start_day,b.today,'1 day') d LEFT JOIN events e ON e.day=d::date GROUP BY d)
SELECT jsonb_build_object('visitors',(SELECT count(DISTINCT actor) FROM events WHERE kind='visit'),'signups',(SELECT count(*) FROM events WHERE kind='signup'),'logins',(SELECT count(*) FROM events WHERE kind='login'),'returning',(SELECT count(*) FROM returns),'totalAccounts',(SELECT count(*) FROM public.growth_events WHERE kind='signup'),'trackingSince',(SELECT min(occurred_at) FROM public.growth_events WHERE kind='visit'),'daily',(SELECT coalesce(jsonb_agg(jsonb_build_object('day',day,'visitors',visitors,'signups',signups,'logins',logins) ORDER BY day),'[]'::jsonb) FROM daily)); $$;
REVOKE ALL ON FUNCTION public.growth_summary(integer) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.growth_summary(integer) TO authenticated,service_role;
CREATE TABLE public.chat_threads (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, title text NOT NULL DEFAULT 'New conversation', messages jsonb NOT NULL DEFAULT '[]'::jsonb, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT,INSERT,UPDATE,DELETE ON public.chat_threads TO authenticated;
GRANT ALL ON public.chat_threads TO service_role;
ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY chat_threads_owner ON public.chat_threads FOR ALL TO authenticated USING(auth.uid()=user_id) WITH CHECK(auth.uid()=user_id);
CREATE INDEX chat_threads_user_updated ON public.chat_threads(user_id,updated_at DESC);