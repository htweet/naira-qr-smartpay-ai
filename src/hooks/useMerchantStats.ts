import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MerchantStats {
  totalRevenue: number;
  revenueChange: number;
  totalTransactions: number;
  transactionsChange: number;
  successRate: number;
  activeQRCodes: number;
  pendingTransactions: number;
  completedTransactions: number;
  failedTransactions: number;
}

interface Transaction {
  id: string;
  amount: number;
  status: string | null;
  customer_id: string | null;
  description: string | null;
  payment_method: string | null;
  created_at: string;
  reference: string | null;
}

export const useMerchantStats = (merchantId: string | undefined) => {
  const [stats, setStats] = useState<MerchantStats>({
    totalRevenue: 0,
    revenueChange: 0,
    totalTransactions: 0,
    transactionsChange: 0,
    successRate: 0,
    activeQRCodes: 0,
    pendingTransactions: 0,
    completedTransactions: 0,
    failedTransactions: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!merchantId) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        // Fetch transactions
        const { data: transactions, error: txError } = await supabase
          .from("transactions")
          .select("*")
          .eq("merchant_id", merchantId)
          .order("created_at", { ascending: false });

        if (txError) throw txError;

        // Fetch QR codes count using type assertion
        const { data: qrCodes, error: qrError } = await (supabase as unknown as {
          from: (table: string) => {
            select: (columns: string) => {
              eq: (column: string, value: string) => {
                eq: (column: string, value: string) => Promise<{ data: unknown[]; error: unknown }>;
              };
            };
          };
        }).from("qr_codes")
          .select("id")
          .eq("merchant_id", merchantId)
          .eq("status", "active");

        if (qrError) console.error("QR codes fetch error:", qrError);

        const txList = transactions || [];
        const completedTx = txList.filter(tx => tx.status === "completed");
        const pendingTx = txList.filter(tx => tx.status === "pending");
        const failedTx = txList.filter(tx => tx.status === "failed");

        const totalRevenue = completedTx.reduce((sum, tx) => sum + Number(tx.amount), 0);
        const successRate = txList.length > 0 
          ? (completedTx.length / txList.length) * 100 
          : 0;

        // Calculate 30-day comparison for revenue change (simplified)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentTxRevenue = completedTx
          .filter(tx => new Date(tx.created_at) > thirtyDaysAgo)
          .reduce((sum, tx) => sum + Number(tx.amount), 0);

        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
        
        const previousTxRevenue = completedTx
          .filter(tx => {
            const txDate = new Date(tx.created_at);
            return txDate > sixtyDaysAgo && txDate <= thirtyDaysAgo;
          })
          .reduce((sum, tx) => sum + Number(tx.amount), 0);

        const revenueChange = previousTxRevenue > 0 
          ? ((recentTxRevenue - previousTxRevenue) / previousTxRevenue) * 100 
          : 0;

        setStats({
          totalRevenue,
          revenueChange: Math.round(revenueChange * 10) / 10,
          totalTransactions: txList.length,
          transactionsChange: 0, // Simplified for now
          successRate: Math.round(successRate * 10) / 10,
          activeQRCodes: (qrCodes as unknown[])?.length || 0,
          pendingTransactions: pendingTx.length,
          completedTransactions: completedTx.length,
          failedTransactions: failedTx.length,
        });

        setRecentTransactions(txList.slice(0, 10));
      } catch (error) {
        console.error("Error fetching merchant stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [merchantId]);

  return { stats, recentTransactions, loading };
};
