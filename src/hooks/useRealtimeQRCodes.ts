import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface QRCodeData {
  id: string;
  qr_code_id: string;
  merchant_id: string;
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
  status: string;
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

export const useRealtimeQRCodes = (merchantId: string | undefined) => {
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const fetchQRCodes = useCallback(async () => {
    if (!merchantId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("qr_codes")
        .select("*")
        .eq("merchant_id", merchantId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setQrCodes((data as QRCodeData[]) || []);
    } catch (error) {
      console.error("Error fetching QR codes:", error);
      toast({
        title: "Error",
        description: "Failed to fetch QR codes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [merchantId]);

  useEffect(() => {
    if (!merchantId) return;

    fetchQRCodes();

    // Set up realtime subscription
    const channel = supabase
      .channel(`qr-codes-${merchantId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "qr_codes",
          filter: `merchant_id=eq.${merchantId}`,
        },
        (payload) => {
          console.log("Realtime QR code update:", payload);

          if (payload.eventType === "INSERT") {
            setQrCodes((prev) => [payload.new as QRCodeData, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setQrCodes((prev) =>
              prev.map((qr) =>
                qr.id === (payload.new as QRCodeData).id
                  ? (payload.new as QRCodeData)
                  : qr
              )
            );
          } else if (payload.eventType === "DELETE") {
            setQrCodes((prev) =>
              prev.filter((qr) => qr.id !== (payload.old as { id: string }).id)
            );
          }
        }
      )
      .subscribe((status) => {
        console.log("QR codes realtime status:", status);
        setIsConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [merchantId, fetchQRCodes]);

  const createQRCode = async (config: QRCodeConfig) => {
    if (!merchantId) throw new Error("No merchant ID");

    const qrCodeId = `QR${Date.now()}`;

    const { data, error } = await supabase
      .from("qr_codes")
      .insert({
        merchant_id: merchantId,
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
        status: "active",
      })
      .select()
      .single();

    if (error) throw error;

    toast({
      title: "QR Code Generated",
      description: `${config.type} QR code created successfully`,
    });

    return data as QRCodeData;
  };

  const updateQRCode = async (id: string, updates: Partial<QRCodeConfig>) => {
    const dbUpdates: Record<string, unknown> = { ...updates };
    if (updates.amount !== undefined) {
      dbUpdates.amount = updates.amount ? parseFloat(updates.amount) : null;
    }

    const { data, error } = await supabase
      .from("qr_codes")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    toast({
      title: "QR Code Updated",
      description: "QR code updated successfully",
    });

    return data as QRCodeData;
  };

  const deleteQRCode = async (id: string) => {
    const { error } = await supabase.from("qr_codes").delete().eq("id", id);

    if (error) throw error;

    toast({
      title: "QR Code Deleted",
      description: "QR code deleted successfully",
    });
  };

  const toggleQRStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    const { error } = await supabase
      .from("qr_codes")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) throw error;

    toast({
      title: `QR Code ${newStatus === "active" ? "Activated" : "Deactivated"}`,
      description: `QR code is now ${newStatus}`,
    });
  };

  return {
    qrCodes,
    loading,
    isConnected,
    createQRCode,
    updateQRCode,
    deleteQRCode,
    toggleQRStatus,
    refetch: fetchQRCodes,
  };
};
