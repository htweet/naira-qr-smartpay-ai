
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { QRCodeConfig, QRCodeData, transformDatabaseRow, transformConfigToDatabase } from './useQRCodeData';

export const useQRCodeOperations = () => {
  const createQRCode = async (config: QRCodeConfig): Promise<QRCodeData> => {
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

      const transformedQR = transformDatabaseRow(data);

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

  const updateQRCode = async (id: string, updates: Partial<QRCodeConfig>): Promise<QRCodeData> => {
    try {
      const dbUpdates = transformConfigToDatabase(updates);
      
      const { data, error } = await supabase
        .from('qr_codes')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const transformedQR = transformDatabaseRow(data);

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

  const deleteQRCode = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('qr_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;

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

  return {
    createQRCode,
    updateQRCode,
    deleteQRCode,
  };
};
