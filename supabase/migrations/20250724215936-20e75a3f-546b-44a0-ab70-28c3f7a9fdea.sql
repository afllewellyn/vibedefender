-- Create subscription_plans table first (no foreign keys)
CREATE TABLE public.subscription_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  max_scans_per_month INTEGER NOT NULL DEFAULT 0,
  max_projects INTEGER NOT NULL DEFAULT 0,
  price_per_month DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_url CHECK (url ~* '^https?://[^\s/$.?#].[^\s]*$')
);

-- Create scans table
CREATE TABLE public.scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID,
  url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  score DECIMAL(5,2),
  grade TEXT CHECK (grade IN ('A', 'B', 'C', 'D', 'F')),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_url CHECK (url ~* '^https?://[^\s/$.?#].[^\s]*$'),
  CONSTRAINT valid_score CHECK (score >= 0 AND score <= 100)
);

-- Create scan_findings table
CREATE TABLE public.scan_findings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scan_id UUID NOT NULL REFERENCES public.scans(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT,
  recommendation TEXT,
  element_selector TEXT,
  impact_score DECIMAL(3,1),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_impact_score CHECK (impact_score >= 0 AND impact_score <= 10)
);

-- Create usage_tracking table
CREATE TABLE public.usage_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  subscription_plan_id UUID REFERENCES public.subscription_plans(id),
  scans_used INTEGER NOT NULL DEFAULT 0,
  month_year DATE NOT NULL DEFAULT date_trunc('month', CURRENT_DATE),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, month_year)
);

-- Enable RLS on all tables
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_plans (public read)
CREATE POLICY "Subscription plans are viewable by everyone"
ON public.subscription_plans
FOR SELECT
USING (true);

-- RLS Policies for projects
CREATE POLICY "Users can view their own projects"
ON public.projects
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects"
ON public.projects
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
ON public.projects
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
ON public.projects
FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for scans
CREATE POLICY "Anyone can create scans"
ON public.scans
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can view their own scans or guest scans"
ON public.scans
FOR SELECT
USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can update their own scans"
ON public.scans
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scans"
ON public.scans
FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for scan_findings
CREATE POLICY "Users can view findings for their scans or guest scans"
ON public.scan_findings
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.scans 
    WHERE scans.id = scan_findings.scan_id 
    AND (scans.user_id IS NULL OR scans.user_id = auth.uid())
  )
);

CREATE POLICY "Anyone can create scan findings"
ON public.scan_findings
FOR INSERT
WITH CHECK (true);

-- RLS Policies for usage_tracking
CREATE POLICY "Users can view their own usage"
ON public.usage_tracking
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage"
ON public.usage_tracking
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage"
ON public.usage_tracking
FOR UPDATE
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_scans_project_id ON public.scans(project_id);
CREATE INDEX idx_scans_user_id ON public.scans(user_id);
CREATE INDEX idx_scans_status ON public.scans(status);
CREATE INDEX idx_scan_findings_scan_id ON public.scan_findings(scan_id);
CREATE INDEX idx_scan_findings_severity ON public.scan_findings(severity);
CREATE INDEX idx_usage_tracking_user_id ON public.usage_tracking(user_id);
CREATE INDEX idx_usage_tracking_month_year ON public.usage_tracking(month_year);

-- Create functions with corrected syntax
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

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER calculate_scan_grade
BEFORE INSERT OR UPDATE ON public.scans
FOR EACH ROW
EXECUTE FUNCTION public.calculate_grade_from_score();

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scans_updated_at
BEFORE UPDATE ON public.scans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_usage_tracking_updated_at
BEFORE UPDATE ON public.usage_tracking
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add unique constraint for project names per user
ALTER TABLE public.projects 
ADD CONSTRAINT unique_user_project_name 
UNIQUE (user_id, name);

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, description, max_scans_per_month, max_projects, price_per_month) VALUES
('Free', 'Basic plan with limited scans', 5, 3, 0.00),
('Pro', 'Professional plan with more scans and projects', 50, 25, 29.99),
('Enterprise', 'Unlimited scans and projects', -1, -1, 99.99);