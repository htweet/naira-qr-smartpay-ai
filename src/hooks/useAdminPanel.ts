
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

      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking admin status:', error);
      }

      setIsAdmin(!!data);
    } catch (error) {
      console.error('Error checking admin status:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSuperAdmin = async (email: string) => {
    try {
      // First, get the user by email
      const { data: users, error: userError } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('email', email)
        .maybeSingle();

      if (userError) {
        throw new Error('User not found');
      }

      if (!users) {
        throw new Error('No user found with that email');
      }

      // Create admin user entry
      const { error } = await supabase
        .from('admin_users')
        .insert({
          user_id: users.user_id,
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
        .select(`
          *,
          merchant_management (*)
        `)
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
        .select(`
          *,
          customer_management (*)
        `)
        .eq('user_type', 'customer');

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchSystemSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setSystemSettings(data || []);
    } catch (error) {
      console.error('Error fetching system settings:', error);
    }
  };

  const updateSystemSetting = async (key: string, value: any) => {
    try {
      const { error } = await supabase
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
