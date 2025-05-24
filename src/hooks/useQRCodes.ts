
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
const transformDatabaseRow = (row: any): QRCodeData => ({
  id: row.id,
  qr_code_id: row.qr_code_id,
  type: row.type as "static" | "dynamic", // Type assertion
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
const transformConfigToDatabase = (config: Partial<QRCodeConfig>) => {
  const dbUpdate: any = { ...config };
  
  // Convert amount string to number if present
  if (config.amount !== undefined) {
    dbUpdate.amount = config.amount ? parseFloat(config.amount) : null;
  }
  
  return dbUpdate;
};

export const useQRCodes = () => {
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQRCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('qr_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
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

  const createQRCode = async (config: QRCodeConfig) => {
    try {
      const qrCodeId = `QR${Date.now()}`;
      
      const { data, error } = await supabase
        .from('qr_codes')
        .insert({
          qr_code_id: qrCodeId,
          type: config.type,
          amount: config.amount ? parseFloat(config.amount) : null,
          description: config.description || "Payment Request",
          reference: config.reference || qrCodeId,
          gateway_id: config.gateway_id || null,
          primary_color: config.primary_color,
          secondary_color: config.secondary_color,
          logo_enabled: config.logo_enabled,
          eye_style: config.eye_style,
          pattern: config.pattern,
          frame_style: config.frame_style,
          error_correction: config.error_correction,
        })
        .select()
        .single();

      if (error) throw error;

      // Transform and add to state
      const transformedQR = transformDatabaseRow(data);
      setQrCodes(prev => [transformedQR, ...prev]);

      toast({
        title: "QR Code Generated",
        description: `${config.type} QR code created successfully`,
      });

      return transformedQR;
    } catch (error) {
      console.error('Error creating QR code:', error);
      toast({
        title: "Error",
        description: "Failed to create QR code",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateQRCode = async (id: string, updates: Partial<QRCodeConfig>) => {
    try {
      // Transform the config data to database format
      const dbUpdates = transformConfigToDatabase(updates);
      
      const { data, error } = await supabase
        .from('qr_codes')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Transform and update state
      const transformedQR = transformDatabaseRow(data);
      setQrCodes(prev => prev.map(qr => qr.id === id ? transformedQR : qr));

      toast({
        title: "QR Code Updated",
        description: "QR code updated successfully",
      });

      return transformedQR;
    } catch (error) {
      console.error('Error updating QR code:', error);
      toast({
        title: "Error",
        description: "Failed to update QR code",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteQRCode = async (id: string) => {
    try {
      const { error } = await supabase
        .from('qr_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setQrCodes(prev => prev.filter(qr => qr.id !== id));

      toast({
        title: "QR Code Deleted",
        description: "QR code deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting QR code:', error);
      toast({
        title: "Error",
        description: "Failed to delete QR code",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchQRCodes();
  }, []);

  return {
    qrCodes,
    loading,
    createQRCode,
    updateQRCode,
    deleteQRCode,
    refetch: fetchQRCodes,
  };
};
