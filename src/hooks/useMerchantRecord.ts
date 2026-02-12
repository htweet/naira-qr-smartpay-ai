import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MerchantRecord {
  id: string;
  user_id: string;
  business_name: string;
  status: string | null;
}

export const useMerchantRecord = (userId: string | undefined) => {
  const [merchant, setMerchant] = useState<MerchantRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchOrCreateMerchant = async () => {
      try {
        // Try to fetch existing merchant
        const { data, error } = await supabase
          .from("merchants")
          .select("id, user_id, business_name, status")
          .eq("user_id", userId)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setMerchant(data);
        } else {
          // Auto-create merchant record
          const { data: { user } } = await supabase.auth.getUser();
          const businessName = user?.user_metadata?.business_name || user?.email?.split("@")[0] || "My Business";

          const { data: newMerchant, error: createError } = await supabase
            .from("merchants")
            .insert({
              user_id: userId,
              business_name: businessName,
              business_email: user?.email || null,
              status: "active",
            })
            .select("id, user_id, business_name, status")
            .single();

          if (createError) throw createError;
          setMerchant(newMerchant);
        }
      } catch (error) {
        console.error("Error fetching/creating merchant:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrCreateMerchant();
  }, [userId]);

  return { merchant, loading };
};
