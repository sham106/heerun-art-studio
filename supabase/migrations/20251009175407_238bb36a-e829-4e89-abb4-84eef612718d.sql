-- Add policy for admin_users table so admins can view admin list
CREATE POLICY "Admins can view admin users"
ON public.admin_users
FOR SELECT
USING (is_admin((SELECT auth.jwt()->>'email')));