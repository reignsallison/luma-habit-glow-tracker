CREATE TABLE public.ai_provider_access (model text PRIMARY KEY, status integer NOT NULL, message text NOT NULL, blocked_at timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.ai_provider_access TO service_role;
ALTER TABLE public.ai_provider_access ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.ai_provider_access IS 'Persistent terminal AI access blocks; service-role only. Clear only after access is restored.';