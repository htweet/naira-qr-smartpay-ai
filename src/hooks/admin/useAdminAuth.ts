
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Check if user is the super admin email first
      const isAdminUser = user.email === 'htweet@gmail.com';
      if (isAdminUser) {
        setIsAdmin(true);
        // Auto-create super admin entry if needed
        await createSuperAdminIfNeeded(user.id);
        setLoading(false);
        return;
      }

      // Use the edge function to check admin status
      const { data, error } = await supabase.functions.invoke('check-admin-status');

      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(data?.isAdmin || false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const createSuperAdminIfNeeded = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (!data && !error) {
        await supabase
          .from('admin_users')
          .insert({
            user_id: userId,
            role: 'super_admin',
            permissions: {
              full_access: true,
              manage_users: true,
              manage_system: true,
              manage_payments: true
            }
          });
      }
    } catch (error) {
      console.error('Error creating super admin:', error);
    }
  };

  const createSuperAdmin = async (email: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No authenticated user');
      }

      const { data, error } = await supabase.functions.invoke('create-super-admin', {
        body: { user_id: user.id, email: user.email }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Super admin user created successfully",
      });

      setIsAdmin(true);
    } catch (error: any) {
      console.error('Error creating super admin:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create super admin",
        variant: "destructive",
      });
    }
  };

  return {
    isAdmin,
    loading,
    createSuperAdmin,
    checkAdminStatus
  };
};
