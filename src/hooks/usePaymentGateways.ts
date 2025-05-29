
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface PaymentGateway {
  id: string;
  name: string;
  status: "active" | "warning" | "error";
  enabled: boolean;
  successRate: number;
  avgProcessingTime: number;
  transactionFee: number;
  monthlyVolume: number;
  monthlyCount: number;
  lastTransaction: string;
  features: string[];
  maxRetries: number;
  timeout: number;
  priority: number;
  fallbackEnabled: boolean;
  webhookValidation: boolean;
  autoReconciliation: boolean;
  fraudDetection: boolean;
  customHeaders: string;
  rateLimit: number;
  environment: string;
  performance: Array<{
    date: string;
    success: number;
    volume: number;
  }>;
}

export const usePaymentGateways = () => {
  const [gateways, setGateways] = useState<PaymentGateway[]>([
    {
      id: "moniepoint",
      name: "Moniepoint (Monnify)",
      status: "active",
      enabled: true,
      successRate: 98.5,
      avgProcessingTime: 2.3,
      transactionFee: 0.75,
      monthlyVolume: 1250000,
      monthlyCount: 847,
      lastTransaction: "2 minutes ago",
      features: ["Virtual Accounts", "Bank Transfer", "Card Payments", "Customer Verification"],
      maxRetries: 3,
      timeout: 30,
      priority: 1,
      fallbackEnabled: true,
      webhookValidation: true,
      autoReconciliation: false,
      fraudDetection: true,
      customHeaders: "",
      rateLimit: 1000,
      environment: "live",
      performance: [
        { date: "Mon", success: 98, volume: 180000 },
        { date: "Tue", success: 99, volume: 195000 },
        { date: "Wed", success: 97, volume: 175000 },
        { date: "Thu", success: 98, volume: 210000 },
        { date: "Fri", success: 99, volume: 225000 },
        { date: "Sat", success: 98, volume: 205000 },
        { date: "Sun", success: 97, volume: 190000 }
      ]
    },
    {
      id: "opay",
      name: "Opay",
      status: "active", 
      enabled: true,
      successRate: 97.8,
      avgProcessingTime: 3.1,
      transactionFee: 0.85,
      monthlyVolume: 980000,
      monthlyCount: 623,
      lastTransaction: "5 minutes ago",
      features: ["3DS Card Payment", "E-Wallet", "Bank Debit", "Mobile SDKs"],
      maxRetries: 2,
      timeout: 25,
      priority: 2,
      fallbackEnabled: true,
      webhookValidation: true,
      autoReconciliation: true,
      fraudDetection: true,
      customHeaders: "",
      rateLimit: 800,
      environment: "live",
      performance: [
        { date: "Mon", success: 96, volume: 140000 },
        { date: "Tue", success: 98, volume: 155000 },
        { date: "Wed", success: 97, volume: 142000 },
        { date: "Thu", success: 99, volume: 165000 },
        { date: "Fri", success: 98, volume: 172000 },
        { date: "Sat", success: 97, volume: 158000 },
        { date: "Sun", success: 98, volume: 148000 }
      ]
    },
    {
      id: "palmpay",
      name: "Palmpay",
      status: "active",
      enabled: false,
      successRate: 96.2,
      avgProcessingTime: 4.2,
      transactionFee: 0.95,
      monthlyVolume: 450000,
      monthlyCount: 298,
      lastTransaction: "1 hour ago",
      features: ["Zero-fee Transfers", "Business Tools", "POS Integration", "Bulk Payments"],
      maxRetries: 4,
      timeout: 35,
      priority: 3,
      fallbackEnabled: false,
      webhookValidation: false,
      autoReconciliation: false,
      fraudDetection: false,
      customHeaders: "",
      rateLimit: 500,
      environment: "sandbox",
      performance: [
        { date: "Mon", success: 95, volume: 65000 },
        { date: "Tue", success: 97, volume: 72000 },
        { date: "Wed", success: 96, volume: 68000 },
        { date: "Thu", success: 97, volume: 75000 },
        { date: "Fri", success: 96, volume: 78000 },
        { date: "Sat", success: 95, volume: 70000 },
        { date: "Sun", success: 96, volume: 67000 }
      ]
    }
  ]);

  const toggleGateway = async (gatewayId: string) => {
    console.log('Toggling gateway:', gatewayId);
    
    const gateway = gateways.find(g => g.id === gatewayId);
    if (!gateway) {
      toast({
        title: "Error",
        description: "Gateway not found",
        variant: "destructive",
      });
      return;
    }

    const newEnabled = !gateway.enabled;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { error } = await supabase
        .from('payment_gateway_configs')
        .upsert({
          user_id: user.id,
          gateway_id: gatewayId,
          gateway_name: gateway.name,
          enabled: newEnabled,
        }, {
          onConflict: 'gateway_id,user_id'
        });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      // Update local state
      setGateways(prevGateways => 
        prevGateways.map(g => 
          g.id === gatewayId ? { ...g, enabled: newEnabled } : g
        )
      );

      toast({
        title: `${gateway.name} ${newEnabled ? 'Enabled' : 'Disabled'}`,
        description: `Payment gateway has been ${newEnabled ? 'activated' : 'deactivated'} successfully.`,
      });
    } catch (error: any) {
      console.error('Error toggling gateway:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update gateway status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateGatewaySettings = async (gatewayId: string, settings: any) => {
    console.log('Updating gateway settings:', gatewayId, settings);
    
    try {
      const gateway = gateways.find(g => g.id === gatewayId);
      if (!gateway) {
        throw new Error("Gateway not found");
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { error } = await supabase
        .from('payment_gateway_configs')
        .upsert({
          user_id: user.id,
          gateway_id: gatewayId,
          gateway_name: gateway.name,
          enabled: gateway.enabled,
          ...settings,
        }, {
          onConflict: 'gateway_id,user_id'
        });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      // Update local state
      setGateways(prevGateways => 
        prevGateways.map(gateway => 
          gateway.id === gatewayId 
            ? { ...gateway, ...settings }
            : gateway
        )
      );

      toast({
        title: "Settings Updated",
        description: "Gateway configuration has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error updating gateway settings:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update gateway settings",
        variant: "destructive",
      });
    }
  };

  return {
    gateways,
    toggleGateway,
    updateGatewaySettings,
  };
};
