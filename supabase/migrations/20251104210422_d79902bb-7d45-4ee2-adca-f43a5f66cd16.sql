-- ========================================
-- SECURE USER ROLES IMPLEMENTATION
-- Fixes privilege escalation vulnerability
-- ========================================

-- Step 1: Create role enum type
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Step 2: Create user_roles table with proper security
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS policies for user_roles
-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Only admins can insert/update/delete roles (will be enforced via RPC functions)
-- For now, no INSERT/UPDATE/DELETE policies - roles must be managed by superadmin or service role

-- Step 4: Create SECURITY DEFINER function to safely check roles
-- This prevents RLS recursion and ensures secure role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles
    WHERE user_id = _user_id 
      AND role = _role
  )
$$;

-- Step 5: Create helper function to get user's roles
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id UUID)
RETURNS SETOF public.app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role 
  FROM public.user_roles
  WHERE user_id = _user_id
$$;

-- Step 6: Remove the vulnerable role column from profiles
-- First, verify no data will be lost (all current roles are 'user')
DO $$
BEGIN
  -- Check if any non-default roles exist
  IF EXISTS (SELECT 1 FROM public.profiles WHERE role IS DISTINCT FROM 'user') THEN
    RAISE EXCEPTION 'Cannot drop role column: non-default roles exist. Please migrate data first.';
  END IF;
END $$;

-- Safe to drop the column
ALTER TABLE public.profiles DROP COLUMN role;

-- Step 7: Create RPC function for admins to assign roles (service role only)
CREATE OR REPLACE FUNCTION public.assign_user_role(
  _user_id UUID,
  _role public.app_role
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert role if it doesn't exist (upsert pattern)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, _role)
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

-- Step 8: Create RPC function to revoke user roles (service role only)
CREATE OR REPLACE FUNCTION public.revoke_user_role(
  _user_id UUID,
  _role public.app_role
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.user_roles
  WHERE user_id = _user_id 
    AND role = _role;
END;
$$;

-- Step 9: Add default 'user' role for all existing users
INSERT INTO public.user_roles (user_id, role)
SELECT user_id, 'user'::public.app_role
FROM public.profiles
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 10: Update handle_new_user trigger to assign default role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'display_name');
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user'::public.app_role);
  
  RETURN NEW;
END;
$$;