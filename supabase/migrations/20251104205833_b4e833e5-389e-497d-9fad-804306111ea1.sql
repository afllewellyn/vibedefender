-- Drop the public access policy
DROP POLICY "Subscription plans are viewable by everyone" ON public.subscription_plans;

-- Create a new restricted policy for authenticated users
CREATE POLICY "authenticated_users_view_subscription_plans" 
ON public.subscription_plans
FOR SELECT 
TO authenticated
USING (auth.uid() IS NOT NULL);