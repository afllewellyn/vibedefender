-- Fix the grade calculation function with proper syntax
CREATE OR REPLACE FUNCTION public.calculate_grade_from_score()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Add the missing update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scans_updated_at
BEFORE UPDATE ON public.scans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Fix guest scan visibility - update existing policy
DROP POLICY IF EXISTS "Users can view their own scans" ON public.scans;

CREATE POLICY "Users can view their own scans or guest scans"
ON public.scans
FOR SELECT
USING (user_id IS NULL OR auth.uid() = user_id);

-- Add unique constraint for project names per user (optional improvement)
ALTER TABLE public.projects 
ADD CONSTRAINT unique_user_project_name 
UNIQUE (user_id, name);