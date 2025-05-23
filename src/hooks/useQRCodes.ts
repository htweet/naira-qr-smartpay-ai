
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface QRCodeData {
  id: string;
  qr_code_id: string;
  gateway_id?: string;
  type: 'static' | 'dynamic';
  amount?: number;
  description?: string;
  reference?: string;
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
}

export const useQRCodes = () => {
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchQRCodes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQrCodes(data || []);
    } catch (error) {
      console.error('Error fetching QR codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async (config: any, selectedGateway?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const qrCodeId = `QR${String(qrCodes.length + 1).padStart(3, '0')}`;
      
      const qrData = {
        user_id: user.id,
        qr_code_id: qrCodeId,
        gateway_id: selectedGateway,
        type: config.type,
        amount: config.amount ? parseFloat(config.amount) : null,
        description: config.description || "Payment Request",
        reference: config.reference || `REF-${Date.now()}`,
        primary_color: config.primaryColor,
        secondary_color: config.secondaryColor,
        logo_enabled: config.logoEnabled,
        eye_style: config.eyeStyle,
        pattern: config.pattern,
        frame_style: config.frameStyle,
        error_correction: config.errorCorrection
      };

      const { data, error } = await supabase
        .from('qr_codes')
        .insert([qrData])
        .select()
        .single();

      if (error) throw error;

      setQrCodes(prev => [data, ...prev]);
      
      toast({
        title: "QR Code Generated",
        description: `${config.type} QR code created successfully${selectedGateway ? ` with ${selectedGateway}` : ''}`,
      });

      return data;
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive"
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
    generateQRCode,
    refetch: fetchQRCodes
  };
};
