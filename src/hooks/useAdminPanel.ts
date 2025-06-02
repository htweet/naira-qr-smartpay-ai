
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SystemSetting {
  id: string;
  key: string;
  value: string;
  description: string;
  category: string;
  created_at: string;
  updated_at: string;
}

interface MerchantData {
  id: string;
  business_name: string;
  email?: string;
  created_at: string;
  merchant_management?: Array<{
    status: string;
    verification_status: string;
  }>;
}

interface CustomerData {
  id: string;
  business_name: string;
  email?: string;
  created_at: string;
  customer_management?: Array<{
    status: string;
    risk_level: string;
  }>;
}

export const useAdminPanel = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [merchants, setMerchants] = useState<MerchantData[]>([]);
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSetting[]>([]);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      loadMerchants();
      loadCustomers();
      loadSystemSettings();
    }
  }, [isAdmin]);

  const checkAdminStatus = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Check if user is super admin by email
      const isSuperAdmin = user.email === 'htweet@gmail.com';
      
      if (isSuperAdmin) {
        setIsAdmin(true);
        setLoading(false);
        return;
      }

      // Check admin_users table
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
      console.error('Error in checkAdminStatus:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMerchants = async () => {
    try {
      // Get profiles and their merchant management data
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      const { data: merchantManagement, error: managementError } = await supabase
        .from('merchant_management')
        .select('*');

      if (managementError) throw managementError;

      const merchantsWithManagement = profiles?.map(profile => ({
        id: profile.id,
        business_name: profile.business_name || 'Unknown Business',
        email: profile.user_id, // Using user_id as placeholder for email
        created_at: profile.created_at || new Date().toISOString(),
        merchant_management: merchantManagement?.filter(m => m.user_id === profile.user_id) || []
      })) || [];

      setMerchants(merchantsWithManagement);
    } catch (error) {
      console.error('Error loading merchants:', error);
    }
  };

  const loadCustomers = async () => {
    try {
      // Get profiles and their customer management data
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      const { data: customerManagement, error: managementError } = await supabase
        .from('customer_management')
        .select('*');

      if (managementError) throw managementError;

      const customersWithManagement = profiles?.map(profile => ({
        id: profile.id,
        business_name: profile.business_name || 'Customer',
        email: profile.user_id, // Using user_id as placeholder for email
        created_at: profile.created_at || new Date().toISOString(),
        customer_management: customerManagement?.filter(c => c.user_id === profile.user_id) || []
      })) || [];

      setCustomers(customersWithManagement);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  const loadSystemSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setSystemSettings(data || []);
    } catch (error) {
      console.error('Error loading system settings:', error);
      // Fallback to mock settings if table doesn't exist or has errors
      const mockSettings: SystemSetting[] = [
        {
          id: '1',
          key: 'platform_name',
          value: 'QR Payment Platform',
          description: 'The name of the platform',
          category: 'general',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          key: 'maintenance_mode',
          value: 'false',
          description: 'Enable maintenance mode',
          category: 'system',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      setSystemSettings(mockSettings);
    }
  };

  const createSuperAdmin = async (email: string) => {
    try {
      const { error } = await supabase
        .from('admin_users')
        .insert({
          user_id: user?.id,
          role: 'super_admin',
          permissions: {
            full_access: true,
            manage_users: true,
            manage_system: true,
            manage_payments: true
          }
        });

      if (error) throw error;
      
      await checkAdminStatus();
    } catch (error) {
      console.error('Error creating super admin:', error);
    }
  };

  const updateSystemSetting = async (key: string, value: string) => {
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          key,
          value,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setSystemSettings(prev => 
        prev.map(setting => 
          setting.key === key 
            ? { ...setting, value, updated_at: new Date().toISOString() }
            : setting
        )
      );
    } catch (error) {
      console.error('Error updating system setting:', error);
      // Fallback to local update if database update fails
      setSystemSettings(prev => 
        prev.map(setting => 
          setting.key === key 
            ? { ...setting, value, updated_at: new Date().toISOString() }
            : setting
        )
      );
    }
  };

  return {
    isAdmin,
    loading,
    merchants,
    customers,
    systemSettings,
    createSuperAdmin,
    updateSystemSetting,
    loadMerchants,
    loadCustomers,
    loadSystemSettings
  };
};
