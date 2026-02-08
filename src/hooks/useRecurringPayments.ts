import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface RecurringPayment {
  id: string;
  merchant_id: string;
  customer_id?: string;
  name: string;
  amount: number;
  currency: string;
  interval: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  next_payment_date: string;
  last_payment_date?: string;
  status: "active" | "paused" | "cancelled" | "completed";
  total_payments: number;
  max_payments?: number;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface CreateRecurringPaymentData {
  name: string;
  amount: number;
  currency?: string;
  interval: RecurringPayment["interval"];
  customer_id?: string;
  start_date?: string;
  max_payments?: number;
}

export const useRecurringPayments = (merchantId: string | undefined) => {
  const [payments, setPayments] = useState<RecurringPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const fetchPayments = useCallback(async () => {
    if (!merchantId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("recurring_payments")
        .select("*")
        .eq("merchant_id", merchantId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPayments((data as RecurringPayment[]) || []);
    } catch (error) {
      console.error("Error fetching recurring payments:", error);
    } finally {
      setLoading(false);
    }
  }, [merchantId]);

  useEffect(() => {
    if (!merchantId) return;

    fetchPayments();

    const channel = supabase
      .channel(`recurring-payments-${merchantId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "recurring_payments",
          filter: `merchant_id=eq.${merchantId}`,
        },
        () => {
          fetchPayments();
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [merchantId, fetchPayments]);

  const createRecurringPayment = async (data: CreateRecurringPaymentData) => {
    if (!merchantId) throw new Error("No merchant ID");

    const nextPaymentDate = data.start_date || new Date().toISOString();

    const { data: payment, error } = await supabase
      .from("recurring_payments")
      .insert({
        merchant_id: merchantId,
        name: data.name,
        amount: data.amount,
        currency: data.currency || "NGN",
        interval: data.interval,
        customer_id: data.customer_id || null,
        next_payment_date: nextPaymentDate,
        max_payments: data.max_payments || null,
        status: "active",
        total_payments: 0,
      })
      .select()
      .single();

    if (error) throw error;

    toast({
      title: "Recurring Payment Created",
      description: `${data.name} scheduled successfully`,
    });

    return payment as RecurringPayment;
  };

  const pausePayment = async (id: string) => {
    const { error } = await supabase
      .from("recurring_payments")
      .update({ status: "paused" })
      .eq("id", id);

    if (error) throw error;

    toast({
      title: "Payment Paused",
      description: "Recurring payment has been paused",
    });
  };

  const resumePayment = async (id: string) => {
    const { error } = await supabase
      .from("recurring_payments")
      .update({ status: "active" })
      .eq("id", id);

    if (error) throw error;

    toast({
      title: "Payment Resumed",
      description: "Recurring payment is now active",
    });
  };

  const cancelPayment = async (id: string) => {
    const { error } = await supabase
      .from("recurring_payments")
      .update({ status: "cancelled" })
      .eq("id", id);

    if (error) throw error;

    toast({
      title: "Payment Cancelled",
      description: "Recurring payment has been cancelled",
    });
  };

  const deletePayment = async (id: string) => {
    const { error } = await supabase
      .from("recurring_payments")
      .delete()
      .eq("id", id);

    if (error) throw error;

    toast({
      title: "Payment Deleted",
      description: "Recurring payment deleted successfully",
    });
  };

  return {
    payments,
    loading,
    isConnected,
    createRecurringPayment,
    pausePayment,
    resumePayment,
    cancelPayment,
    deletePayment,
    refetch: fetchPayments,
  };
};
