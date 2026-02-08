import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface SplitPayment {
  id: string;
  transaction_id?: string;
  merchant_id: string;
  recipient_merchant_id?: string;
  recipient_account?: string;
  recipient_bank?: string;
  amount: number;
  percentage?: number;
  status: "pending" | "processing" | "completed" | "failed";
  processed_at?: string;
  created_at: string;
}

export interface SplitRecipient {
  recipient_merchant_id?: string;
  recipient_account?: string;
  recipient_bank?: string;
  amount?: number;
  percentage?: number;
}

export interface CreateSplitPaymentData {
  transaction_id?: string;
  recipients: SplitRecipient[];
  total_amount: number;
}

export const useSplitPayments = (merchantId: string | undefined) => {
  const [splits, setSplits] = useState<SplitPayment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSplits = useCallback(async () => {
    if (!merchantId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("split_payments")
        .select("*")
        .or(`merchant_id.eq.${merchantId},recipient_merchant_id.eq.${merchantId}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSplits((data as SplitPayment[]) || []);
    } catch (error) {
      console.error("Error fetching split payments:", error);
    } finally {
      setLoading(false);
    }
  }, [merchantId]);

  useEffect(() => {
    fetchSplits();
  }, [fetchSplits]);

  const createSplitPayment = async (data: CreateSplitPaymentData) => {
    if (!merchantId) throw new Error("No merchant ID");

    const splits = data.recipients.map((recipient) => {
      const amount = recipient.amount || 
        (recipient.percentage ? (data.total_amount * recipient.percentage) / 100 : 0);

      return {
        merchant_id: merchantId,
        transaction_id: data.transaction_id || null,
        recipient_merchant_id: recipient.recipient_merchant_id || null,
        recipient_account: recipient.recipient_account || null,
        recipient_bank: recipient.recipient_bank || null,
        amount,
        percentage: recipient.percentage || null,
        status: "pending" as const,
      };
    });

    const { data: createdSplits, error } = await supabase
      .from("split_payments")
      .insert(splits)
      .select();

    if (error) throw error;

    toast({
      title: "Split Payment Created",
      description: `${splits.length} split payments created`,
    });

    return createdSplits as SplitPayment[];
  };

  const processSplit = async (id: string) => {
    const { error } = await supabase
      .from("split_payments")
      .update({
        status: "processing",
      })
      .eq("id", id);

    if (error) throw error;

    // Simulate processing delay
    setTimeout(async () => {
      const { error: completeError } = await supabase
        .from("split_payments")
        .update({
          status: "completed",
          processed_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (completeError) {
        console.error("Error completing split payment:", completeError);
      }
    }, 2000);

    toast({
      title: "Processing Split",
      description: "Split payment is being processed",
    });
  };

  const getSplitStats = useCallback(() => {
    const pending = splits.filter((s) => s.status === "pending");
    const completed = splits.filter((s) => s.status === "completed");
    const failed = splits.filter((s) => s.status === "failed");

    const pendingAmount = pending.reduce((sum, s) => sum + s.amount, 0);
    const completedAmount = completed.reduce((sum, s) => sum + s.amount, 0);

    return {
      pending: pending.length,
      completed: completed.length,
      failed: failed.length,
      pendingAmount,
      completedAmount,
      total: splits.length,
    };
  }, [splits]);

  return {
    splits,
    loading,
    createSplitPayment,
    processSplit,
    getSplitStats,
    refetch: fetchSplits,
  };
};
