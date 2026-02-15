import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Dispute {
  id: string;
  transaction_id?: string;
  merchant_id: string;
  customer_id?: string;
  reason: "fraud" | "not_received" | "not_as_described" | "duplicate" | "other";
  description?: string;
  status: "open" | "under_review" | "resolved_merchant" | "resolved_customer" | "closed";
  amount: number;
  evidence: Array<{ type: string; url: string; description: string }>;
  resolution_notes?: string;
  resolved_at?: string;
  merchant_response?: string;
  merchant_response_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDisputeData {
  transaction_id?: string;
  reason: Dispute["reason"];
  description?: string;
  amount: number;
  evidence?: Dispute["evidence"];
}

export const useDisputes = (merchantId: string | undefined, isAdmin = false) => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const fetchDisputes = useCallback(async () => {
    if (!merchantId && !isAdmin) {
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from("disputes")
        .select("*")
        .order("created_at", { ascending: false });

      if (!isAdmin && merchantId) {
        query = query.eq("merchant_id", merchantId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      const transformed = (data || []).map((d) => ({
        ...d,
        evidence: Array.isArray(d.evidence) ? d.evidence as unknown as Dispute["evidence"] : [],
      })) as unknown as Dispute[];
      
      setDisputes(transformed);
    } catch (error) {
      console.error("Error fetching disputes:", error);
    } finally {
      setLoading(false);
    }
  }, [merchantId, isAdmin]);

  useEffect(() => {
    if (!merchantId && !isAdmin) return;

    fetchDisputes();

    const filter = isAdmin ? undefined : `merchant_id=eq.${merchantId}`;
    
    const channel = supabase
      .channel(`disputes-${merchantId || "admin"}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "disputes",
          filter,
        },
        () => {
          fetchDisputes();
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [merchantId, isAdmin, fetchDisputes]);

  const createDispute = async (data: CreateDisputeData) => {
    if (!merchantId) throw new Error("No merchant ID");

    const { data: dispute, error } = await supabase
      .from("disputes")
      .insert({
        merchant_id: merchantId,
        transaction_id: data.transaction_id || null,
        reason: data.reason,
        description: data.description || null,
        amount: data.amount,
        evidence: data.evidence || [],
        status: "open",
      })
      .select()
      .single();

    if (error) throw error;

    toast({
      title: "Dispute Filed",
      description: "Your dispute has been submitted for review",
    });

    return dispute as unknown as Dispute;
  };

  const updateDisputeStatus = async (
    id: string,
    status: Dispute["status"],
    resolutionNotes?: string
  ) => {
    const updates: Partial<Dispute> = { status };
    
    if (resolutionNotes) {
      updates.resolution_notes = resolutionNotes;
    }
    
    if (status.startsWith("resolved") || status === "closed") {
      updates.resolved_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("disputes")
      .update(updates)
      .eq("id", id);

    if (error) throw error;

    toast({
      title: "Dispute Updated",
      description: `Dispute status changed to ${status.replace("_", " ")}`,
    });
  };

  const addEvidence = async (
    id: string,
    evidence: { type: string; url: string; description: string }
  ) => {
    const dispute = disputes.find((d) => d.id === id);
    if (!dispute) throw new Error("Dispute not found");

    const updatedEvidence = [...dispute.evidence, evidence];

    const { error } = await supabase
      .from("disputes")
      .update({ evidence: updatedEvidence })
      .eq("id", id);

    if (error) throw error;

    toast({
      title: "Evidence Added",
      description: "Evidence has been added to the dispute",
    });
  };

  const respondToDispute = async (id: string, response: string) => {
    const { error } = await supabase
      .from("disputes")
      .update({
        merchant_response: response,
        merchant_response_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;

    toast({
      title: "Response Submitted",
      description: "Your response has been submitted to the dispute",
    });
  };

  const getDisputeStats = useCallback(() => {
    const open = disputes.filter((d) => d.status === "open").length;
    const underReview = disputes.filter((d) => d.status === "under_review").length;
    const resolved = disputes.filter((d) =>
      ["resolved_merchant", "resolved_customer", "closed"].includes(d.status)
    ).length;
    const totalAmount = disputes.reduce((sum, d) => sum + d.amount, 0);

    return { open, underReview, resolved, total: disputes.length, totalAmount };
  }, [disputes]);

  return {
    disputes,
    loading,
    isConnected,
    createDispute,
    updateDisputeStatus,
    addEvidence,
    respondToDispute,
    getDisputeStats,
    refetch: fetchDisputes,
  };
};
