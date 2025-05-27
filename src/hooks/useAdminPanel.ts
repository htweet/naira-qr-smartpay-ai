
import { useEffect } from 'react';
import { useAdminAuth } from './admin/useAdminAuth';
import { useAdminData } from './admin/useAdminData';
import { useSystemSettings } from './admin/useSystemSettings';

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
  const { isAdmin, loading, createSuperAdmin } = useAdminAuth();
  const { merchants, customers, systemSettings, fetchMerchants, fetchCustomers, fetchSystemSettings } = useAdminData();
  const { updateSystemSetting } = useSystemSettings();

  useEffect(() => {
    if (isAdmin) {
      fetchMerchants();
      fetchCustomers();
      fetchSystemSettings();
    }
  }, [isAdmin]);

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
