
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface AdminUser {
  id: string;
  user_id: string;
  role: string;
  permissions: any;
  created_at: string;
  updated_at: string;
}

export interface SystemSetting {
  id: string;
  key: string;
  value: any;
  description: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface MerchantManagement {
  id: string;
  merchant_id: string;
  status: string;
  verification_status: string;
  kyc_documents: any[];
  admin_notes: string;
  last_reviewed_at: string;
  reviewed_by: string;
  created_at: string;
  updated_at: string;
}

export const useAdminPanel = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [merchants, setMerchants] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSetting[]>([]);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchMerchants();
      fetchCustomers();
      fetchSystemSettings();
    }
  }, [isAdmin]);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Use the edge function to check admin status
      const { data, error } = await supabase.functions.invoke('check-admin-status');

      if (error) {
        console.error('Error checking admin status:', error);
        // Fallback: check if user is the super admin email
        const isAdminUser = user.email === 'htweet@gmail.com';
        setIsAdmin(isAdminUser);
      } else {
        setIsAdmin(data?.isAdmin || false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      // Fallback for super admin
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email === 'htweet@gmail.com') {
        setIsAdmin(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const createSuperAdmin = async (email: string) => {
    try {
      // Get user by email from auth.users (this requires service role)
      // For now, we'll create based on current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No authenticated user');
      }

      // Use a generic query with type assertion
      const { error } = await supabase
        .from('admin_users' as any)
        .insert({
          user_id: user.id,
          role: 'super_admin',
          permissions: {
            full_access: true,
            manage_users: true,
            manage_system: true,
            manage_payments: true
          }
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

  const fetchMerchants = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'merchant');

      if (error) throw error;
      setMerchants(data || []);
    } catch (error) {
      console.error('Error fetching merchants:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'customer');

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchSystemSettings = async () => {
    try {
      // Use a direct query with proper typing
      const response = await fetch('/api/system-settings', {
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSystemSettings(data || []);
      } else {
        // Fallback to direct supabase query with type assertion
        const { data, error } = await (supabase as any)
          .from('system_settings')
          .select('*')
          .order('category', { ascending: true });

        if (error) throw error;
        setSystemSettings(data || []);
      }
    } catch (error) {
      console.error('Error fetching system settings:', error);
      // Set some default settings if fetch fails
      setSystemSettings([
        {
          id: '1',
          key: 'app_name',
          value: 'PayQR',
          description: 'Application name',
          category: 'branding',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          key: 'maintenance_mode',
          value: false,
          description: 'Enable maintenance mode',
          category: 'system',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
    }
  };

  const updateSystemSetting = async (key: string, value: any) => {
    try {
      const { error } = await (supabase as any)
        .from('system_settings')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('key', key);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Setting updated successfully",
      });

      fetchSystemSettings();
    } catch (error: any) {
      console.error('Error updating setting:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update setting",
        variant: "destructive",
      });
    }
  };

  return {
    isAdmin,
    loading,
    merchants,
    customers,
    systemSettings,
    createSuperAdmin,
    fetchMerchants,
    fetchCustomers,
    updateSystemSetting,
    refetch: () => {
      fetchMerchants();
      fetchCustomers();
      fetchSystemSettings();
    }
  };
};
