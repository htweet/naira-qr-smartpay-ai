import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface NQRPaymentRequest {
  amount: number;
  email?: string;
  fullname?: string;
  phone?: string;
  description?: string;
  merchant_id?: string;
}

interface NQRPaymentResponse {
  qr_image?: string;
  flw_ref?: string;
  tx_ref?: string;
  amount?: number;
}

export const useFlutterwaveNQR = () => {
  const [loading, setLoading] = useState(false);
  const [qrImage, setQrImage] = useState<string | null>(null);

  const createNQRPayment = async (request: NQRPaymentRequest): Promise<NQRPaymentResponse | null> => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke("flutterwave-nqr", {
        body: { action: "create_qr_payment", ...request },
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Failed to create NQR payment");

      const qrImg = data.data?.qr_image || data.data?.data?.qr_image;
      if (qrImg) setQrImage(qrImg);

      toast({
        title: "NQR Payment Created",
        description: "QR code generated. Customer can scan to pay.",
      });

      return data.data;
    } catch (error) {
      console.error("NQR payment error:", error);
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to create payment",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (transactionId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("flutterwave-nqr", {
        body: { action: "verify_payment", transaction_id: transactionId },
      });

      if (error) throw error;
      return data?.data;
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "Verification Error",
        description: "Failed to verify payment status",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createNQRPayment, verifyPayment, loading, qrImage };
};
