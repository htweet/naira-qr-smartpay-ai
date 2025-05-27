
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SystemSetting {
  id: string;
  key: string;
  value: any;
  description: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export const useAdminData = () => {
  const [merchants, setMerchants] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSetting[]>([]);

  const fetchMerchants = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;
      setMerchants(profiles || []);
    } catch (error) {
      console.error('Error fetching merchants:', error);
      setMerchants([]);
    }
  };

  const fetchCustomers = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;
      setCustomers(profiles || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]);
    }
  };

  const fetchSystemSettings = async () => {
    try {
      const defaultSettings: SystemSetting[] = [
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
        },
        {
          id: '3',
          key: 'max_qr_codes',
          value: 100,
          description: 'Maximum QR codes per user',
          category: 'limits',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      setSystemSettings(defaultSettings);
    } catch (error) {
      console.error('Error fetching system settings:', error);
      setSystemSettings([]);
    }
  };

  return {
    merchants,
    customers,
    systemSettings,
    fetchMerchants,
    fetchCustomers,
    fetchSystemSettings
  };
};
