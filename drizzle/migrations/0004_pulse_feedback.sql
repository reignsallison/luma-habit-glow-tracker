CREATE TABLE public.feedback_submissions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL,
 topic text NOT NULL CHECK (topic IN ('feedback','help','privacy')),
 email text NOT NULL CHECK (char_length(email) <= 254),
 message text NOT NULL CHECK (char_length(message) BETWEEN 10 AND 3000),
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.feedback_submissions TO authenticated;
GRANT ALL ON public.feedback_submissions TO service_role;
ALTER TABLE public.feedback_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users submit their own feedback" ON public.feedback_submissions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE INDEX feedback_submissions_user_created ON public.feedback_submissions(user_id,created_at);
CREATE FUNCTION public.limit_feedback_submissions() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 PERFORM pg_advisory_xact_lock(hashtext(NEW.user_id::text));
 IF (SELECT count(*) FROM public.feedback_submissions WHERE user_id = NEW.user_id AND created_at > now() - interval '1 hour') >= 5 THEN
 RAISE EXCEPTION 'Please wait before sending more feedback.';
 END IF;
 RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.limit_feedback_submissions() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER feedback_submission_limit BEFORE INSERT ON public.feedback_submissions FOR EACH ROW EXECUTE FUNCTION public.limit_feedback_submissions();