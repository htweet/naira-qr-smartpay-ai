import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface EscrowTransaction {
  id: string;
  transaction_id?: string;
  merchant_id: string;
  customer_id?: string;
  amount: number;
  currency: string;
  status: "held" | "released" | "disputed" | "refunded";
  release_conditions?: string;
  release_date?: string;
  released_at?: string;
  dispute_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEscrowData {
  transaction_id?: string;
  customer_id?: string;
  amount: number;
  currency?: string;
  release_conditions?: string;
  release_date?: string;
}

export const useEscrow = (merchantId: string | undefined) => {
  const [escrows, setEscrows] = useState<EscrowTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const fetchEscrows = useCallback(async () => {
    if (!merchantId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("escrow")
        .select("*")
        .eq("merchant_id", merchantId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEscrows((data as EscrowTransaction[]) || []);
    } catch (error) {
      console.error("Error fetching escrows:", error);
    } finally {
      setLoading(false);
    }
  }, [merchantId]);

  useEffect(() => {
    if (!merchantId) return;

    fetchEscrows();

    const channel = supabase
      .channel(`escrow-${merchantId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "escrow",
          filter: `merchant_id=eq.${merchantId}`,
        },
        () => {
          fetchEscrows();
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [merchantId, fetchEscrows]);

  const createEscrow = async (data: CreateEscrowData) => {
    if (!merchantId) throw new Error("No merchant ID");

    const { data: escrow, error } = await supabase
      .from("escrow")
      .insert({
        merchant_id: merchantId,
        transaction_id: data.transaction_id || null,
        customer_id: data.customer_id || null,
        amount: data.amount,
        currency: data.currency || "NGN",
        release_conditions: data.release_conditions || null,
        release_date: data.release_date || null,
        status: "held",
      })
      .select()
      .single();

    if (error) throw error;

    toast({
      title: "Escrow Created",
      description: "Funds are now held in escrow",
    });

    return escrow as EscrowTransaction;
  };

  const releaseEscrow = async (id: string) => {
    const { error } = await supabase
      .from("escrow")
      .update({
        status: "released",
        released_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;

    toast({
      title: "Escrow Released",
      description: "Funds have been released to the merchant",
    });
  };

  const refundEscrow = async (id: string) => {
    const { error } = await supabase
      .from("escrow")
      .update({
        status: "refunded",
        released_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;

    toast({
      title: "Escrow Refunded",
      description: "Funds have been refunded to the customer",
    });
  };

  const disputeEscrow = async (id: string, reason: string) => {
    const { error } = await supabase
      .from("escrow")
      .update({
        status: "disputed",
        dispute_reason: reason,
      })
      .eq("id", id);

    if (error) throw error;

    toast({
      title: "Escrow Disputed",
      description: "A dispute has been opened for this escrow",
    });
  };

  const getEscrowStats = useCallback(() => {
    const held = escrows.filter((e) => e.status === "held");
    const released = escrows.filter((e) => e.status === "released");
    const disputed = escrows.filter((e) => e.status === "disputed");
    const refunded = escrows.filter((e) => e.status === "refunded");

    const heldAmount = held.reduce((sum, e) => sum + e.amount, 0);
    const releasedAmount = released.reduce((sum, e) => sum + e.amount, 0);

    return {
      held: held.length,
      released: released.length,
      disputed: disputed.length,
      refunded: refunded.length,
      heldAmount,
      releasedAmount,
      total: escrows.length,
    };
  }, [escrows]);

  return {
    escrows,
    loading,
    isConnected,
    createEscrow,
    releaseEscrow,
    refundEscrow,
    disputeEscrow,
    getEscrowStats,
    refetch: fetchEscrows,
  };
};
