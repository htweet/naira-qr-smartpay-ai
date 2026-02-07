import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Transaction {
  id: string;
  amount: number;
  status: string | null;
  customer_id: string | null;
  description: string | null;
  payment_method: string | null;
  created_at: string;
  reference: string | null;
  merchant_id: string;
}

export const useRealtimeTransactions = (merchantId: string | undefined) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!merchantId) return;

    // Initial fetch
    const fetchTransactions = async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("merchant_id", merchantId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (!error && data) {
        setTransactions(data);
      }
    };

    fetchTransactions();

    // Set up realtime subscription
    const channel = supabase
      .channel(`transactions-${merchantId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "transactions",
          filter: `merchant_id=eq.${merchantId}`,
        },
        (payload) => {
          console.log("Realtime transaction update:", payload);
          
          if (payload.eventType === "INSERT") {
            setTransactions((prev) => [payload.new as Transaction, ...prev].slice(0, 20));
          } else if (payload.eventType === "UPDATE") {
            setTransactions((prev) =>
              prev.map((tx) =>
                tx.id === (payload.new as Transaction).id ? (payload.new as Transaction) : tx
              )
            );
          } else if (payload.eventType === "DELETE") {
            setTransactions((prev) =>
              prev.filter((tx) => tx.id !== (payload.old as { id: string }).id)
            );
          }
        }
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
        setIsConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [merchantId]);

  return { transactions, isConnected };
};
