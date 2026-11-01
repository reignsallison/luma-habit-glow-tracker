REVOKE ALL ON public.growth_events FROM anon,authenticated;
REVOKE ALL ON public.ai_provider_access FROM anon,authenticated;
GRANT ALL ON public.growth_events,public.ai_provider_access TO service_role;