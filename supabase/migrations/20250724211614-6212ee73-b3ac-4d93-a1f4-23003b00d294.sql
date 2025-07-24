-- VibeAudit Complete Database Schema Implementation

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_project_url_format CHECK (url ~* '^https?://[^\s/$.?#].[^\s]*$')
);

-- Create scans table with A-F grading system
CREATE TABLE public.scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  scan_type TEXT NOT NULL DEFAULT 'security' CHECK (scan_type = 'security'),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  score INTEGER CHECK (score >= 0 AND score <= 100),
  grade TEXT CHECK (grade IN ('A', 'B', 'C', 'D', 'F')),
  platform_detected TEXT,
  scan_duration_ms INTEGER,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_scan_url_format CHECK (url ~* '^https?://[^\s/$.?#].[^\s]*$')
);

-- Create scan findings table
CREATE TABLE public.scan_findings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scan_id UUID NOT NULL REFERENCES public.scans(id) ON DELETE CASCADE,
  check_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low', 'info')),
  title TEXT NOT NULL,
  description TEXT,
  impact TEXT,
  recommendation TEXT,
  confidence INTEGER CHECK (confidence >= 0 AND confidence <= 100),
  evidence JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create subscription infrastructure (inactive for MVP)
CREATE TABLE public.subscription_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price_monthly INTEGER NOT NULL,
  max_scans_per_day INTEGER,
  features JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.usage_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  scans_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

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

-- RLS Policies for scans (supports guest scans)
CREATE POLICY "Authenticated users can view their own scans" 
ON public.scans 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create scans" 
ON public.scans 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own scans" 
ON public.scans 
FOR UPDATE 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own scans" 
ON public.scans 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for scan findings
CREATE POLICY "Users can view findings for their scans" 
ON public.scan_findings 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.scans 
    WHERE scans.id = scan_findings.scan_id 
    AND (scans.user_id = auth.uid() OR scans.user_id IS NULL)
  )
);

CREATE POLICY "System can create scan findings" 
ON public.scan_findings 
FOR INSERT 
WITH CHECK (true);

-- RLS Policies for subscription plans (public read for everyone)
CREATE POLICY "Everyone can view active subscription plans" 
ON public.subscription_plans 
FOR SELECT 
USING (active = true);

-- RLS Policies for usage tracking
CREATE POLICY "Users can view their own usage" 
ON public.usage_tracking 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert usage data" 
ON public.usage_tracking 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update usage data" 
ON public.usage_tracking 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_created_at ON public.projects(created_at DESC);

CREATE INDEX idx_scans_project_id ON public.scans(project_id);
CREATE INDEX idx_scans_user_id ON public.scans(user_id);
CREATE INDEX idx_scans_created_at ON public.scans(created_at DESC);
CREATE INDEX idx_scans_status ON public.scans(status);
CREATE PARTIAL INDEX idx_scans_running ON public.scans(id) WHERE status = 'running';

CREATE INDEX idx_scan_findings_scan_id ON public.scan_findings(scan_id);
CREATE INDEX idx_scan_findings_severity ON public.scan_findings(severity);

CREATE INDEX idx_usage_tracking_user_date ON public.usage_tracking(user_id, date);

-- Create function to calculate grade from score
CREATE OR REPLACE FUNCTION public.calculate_grade_from_score()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.score IS NOT NULL THEN
    CASE 
      WHEN NEW.score >= 90 THEN NEW.grade = 'A';
      WHEN NEW.score >= 80 THEN NEW.grade = 'B';
      WHEN NEW.score >= 70 THEN NEW.grade = 'C';
      WHEN NEW.score >= 60 THEN NEW.grade = 'D';
      ELSE NEW.grade = 'F';
    END CASE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scans_updated_at
BEFORE UPDATE ON public.scans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for automatic grade calculation
CREATE TRIGGER calculate_scan_grade
BEFORE INSERT OR UPDATE OF score ON public.scans
FOR EACH ROW
EXECUTE FUNCTION public.calculate_grade_from_score();

-- Insert sample subscription plans (inactive)
INSERT INTO public.subscription_plans (name, price_monthly, max_scans_per_day, features, active) VALUES
('Free', 0, 5, '{"basic_scans": true}', false),
('Pro', 2900, 50, '{"basic_scans": true, "detailed_reports": true, "api_access": true}', false),
('Enterprise', 9900, 500, '{"basic_scans": true, "detailed_reports": true, "api_access": true, "priority_support": true, "custom_integrations": true}', false);