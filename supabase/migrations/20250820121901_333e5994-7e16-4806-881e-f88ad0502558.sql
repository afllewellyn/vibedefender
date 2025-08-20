-- Harden calculate_grade_from_score with explicit search_path and security definer
CREATE OR REPLACE FUNCTION public.calculate_grade_from_score()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.score IS NOT NULL THEN
    IF NEW.score >= 90 THEN
      NEW.grade := 'A';
    ELSIF NEW.score >= 80 THEN
      NEW.grade := 'B';
    ELSIF NEW.score >= 70 THEN
      NEW.grade := 'C';
    ELSIF NEW.score >= 60 THEN
      NEW.grade := 'D';
    ELSE
      NEW.grade := 'F';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;