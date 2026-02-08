import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Json } from "@/integrations/supabase/types";

export interface InvoiceItem {
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

export interface Invoice {
  id: string;
  merchant_id: string;
  customer_id?: string;
  invoice_number: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount_amount: number;
  total: number;
  currency: string;
  due_date?: string;
  paid_at?: string;
  notes?: string;
  items: InvoiceItem[];
  recurring: boolean;
  recurring_interval?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateInvoiceData {
  customer_id?: string;
  items: InvoiceItem[];
  tax_rate?: number;
  discount_amount?: number;
  currency?: string;
  due_date?: string;
  notes?: string;
  recurring?: boolean;
  recurring_interval?: string;
}

// Helper to convert Json to InvoiceItem[]
const parseInvoiceItems = (items: Json | null): InvoiceItem[] => {
  if (!items) return [];
  if (!Array.isArray(items)) return [];
  return items.map((item) => {
    if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
      return {
        description: String((item as Record<string, unknown>).description || ''),
        quantity: Number((item as Record<string, unknown>).quantity || 0),
        unit_price: Number((item as Record<string, unknown>).unit_price || 0),
        amount: Number((item as Record<string, unknown>).amount || 0),
      };
    }
    return { description: '', quantity: 0, unit_price: 0, amount: 0 };
  });
};

export const useInvoices = (merchantId: string | undefined) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const fetchInvoices = useCallback(async () => {
    if (!merchantId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .eq("merchant_id", merchantId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Transform items from JSONB to proper array
      const transformed = (data || []).map((inv) => ({
        ...inv,
        items: parseInvoiceItems(inv.items),
        status: inv.status as Invoice["status"],
      }));
      
      setInvoices(transformed as Invoice[]);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  }, [merchantId]);

  useEffect(() => {
    if (!merchantId) return;

    fetchInvoices();

    const channel = supabase
      .channel(`invoices-${merchantId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "invoices",
          filter: `merchant_id=eq.${merchantId}`,
        },
        () => {
          fetchInvoices();
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [merchantId, fetchInvoices]);

  const createInvoice = async (data: CreateInvoiceData) => {
    if (!merchantId) throw new Error("No merchant ID");

    const subtotal = data.items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = subtotal * ((data.tax_rate || 0) / 100);
    const total = subtotal + taxAmount - (data.discount_amount || 0);

    const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}`;

    const { data: invoice, error } = await supabase
      .from("invoices")
      .insert({
        merchant_id: merchantId,
        customer_id: data.customer_id || null,
        invoice_number: invoiceNumber,
        status: "draft",
        subtotal,
        tax_rate: data.tax_rate || 0,
        tax_amount: taxAmount,
        discount_amount: data.discount_amount || 0,
        total,
        currency: data.currency || "NGN",
        due_date: data.due_date || null,
        notes: data.notes || null,
        items: data.items as unknown as Json,
        recurring: data.recurring || false,
        recurring_interval: data.recurring_interval || null,
      })
      .select()
      .single();

    if (error) throw error;

    toast({
      title: "Invoice Created",
      description: `Invoice ${invoiceNumber} created successfully`,
    });

    return {
      ...invoice,
      items: parseInvoiceItems(invoice.items),
    } as Invoice;
  };

  const updateInvoice = async (id: string, updates: Partial<CreateInvoiceData>) => {
    const dbUpdates: Record<string, unknown> = { ...updates };
    
    if (updates.items) {
      dbUpdates.items = updates.items as unknown as Json;
    }

    const { data, error } = await supabase
      .from("invoices")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    toast({
      title: "Invoice Updated",
      description: "Invoice updated successfully",
    });

    return {
      ...data,
      items: parseInvoiceItems(data.items),
    } as Invoice;
  };

  const sendInvoice = async (id: string) => {
    const { error } = await supabase
      .from("invoices")
      .update({ status: "sent" })
      .eq("id", id);

    if (error) throw error;

    toast({
      title: "Invoice Sent",
      description: "Invoice has been sent to customer",
    });
  };

  const markAsPaid = async (id: string) => {
    const { error } = await supabase
      .from("invoices")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;

    toast({
      title: "Payment Recorded",
      description: "Invoice marked as paid",
    });
  };

  const deleteInvoice = async (id: string) => {
    const { error } = await supabase.from("invoices").delete().eq("id", id);

    if (error) throw error;

    toast({
      title: "Invoice Deleted",
      description: "Invoice deleted successfully",
    });
  };

  return {
    invoices,
    loading,
    isConnected,
    createInvoice,
    updateInvoice,
    sendInvoice,
    markAsPaid,
    deleteInvoice,
    refetch: fetchInvoices,
  };
};
