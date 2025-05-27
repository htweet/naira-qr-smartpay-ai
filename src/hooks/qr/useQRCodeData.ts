
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface QRCodeData {
  id: string;
  qr_code_id: string;
  type: "static" | "dynamic";
  amount?: number;
  description?: string;
  reference?: string;
  gateway_id?: string;
  primary_color: string;
  secondary_color: string;
  logo_enabled: boolean;
  eye_style: string;
  pattern: string;
  frame_style: string;
  error_correction: string;
  scans: number;
  payments: number;
  revenue: number;
  created_at: string;
  updated_at: string;
}

export interface QRCodeConfig {
  type: "static" | "dynamic";
  amount: string;
  description: string;
  reference: string;
  gateway_id: string;
  primary_color: string;
  secondary_color: string;
  logo_enabled: boolean;
  eye_style: string;
  pattern: string;
  frame_style: string;
  error_correction: string;
}

// Transform database row to QRCodeData
export const transformDatabaseRow = (row: any): QRCodeData => ({
  id: row.id,
  qr_code_id: row.qr_code_id,
  type: row.type as "static" | "dynamic",
  amount: row.amount,
  description: row.description,
  reference: row.reference,
  gateway_id: row.gateway_id,
  primary_color: row.primary_color,
  secondary_color: row.secondary_color,
  logo_enabled: row.logo_enabled,
  eye_style: row.eye_style,
  pattern: row.pattern,
  frame_style: row.frame_style,
  error_correction: row.error_correction,
  scans: row.scans,
  payments: row.payments,
  revenue: row.revenue,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

// Transform QRCodeConfig to database format
export const transformConfigToDatabase = (config: Partial<QRCodeConfig>) => {
  const dbUpdate: any = { ...config };
  
  if (config.amount !== undefined) {
    dbUpdate.amount = config.amount ? parseFloat(config.amount) : null;
  }
  
  return dbUpdate;
};

export const useQRCodeData = () => {
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQRCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('qr_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const transformedData = data?.map(transformDatabaseRow) || [];
      setQrCodes(transformedData);
    } catch (error) {
      console.error('Error fetching QR codes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch QR codes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQRCodes();
  }, []);

  return {
    qrCodes,
    loading,
    setQrCodes,
    refetch: fetchQRCodes,
  };
};
