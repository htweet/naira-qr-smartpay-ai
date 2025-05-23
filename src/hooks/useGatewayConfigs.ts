
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface GatewayConfig {
  id: string;
  gateway_id: string;
  gateway_name: string;
  enabled: boolean;
  max_retries: number;
  timeout_seconds: number;
  priority: number;
  fallback_enabled: boolean;
  webhook_validation: boolean;
  auto_reconciliation: boolean;
  fraud_detection: boolean;
  custom_headers: any;
  rate_limit: number;
  environment: string;
  api_credentials: any;
}

export const useGatewayConfigs = () => {
  const [configs, setConfigs] = useState<GatewayConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const defaultGateways = [
    {
      gateway_id: 'moniepoint',
      gateway_name: 'Moniepoint (Monnify)',
      enabled: false,
      max_retries: 3,
      timeout_seconds: 30,
      priority: 1,
      fallback_enabled: true,
      webhook_validation: true,
      auto_reconciliation: false,
      fraud_detection: true,
      custom_headers: {},
      rate_limit: 1000,
      environment: 'live',
      api_credentials: {}
    },
    {
      gateway_id: 'opay',
      gateway_name: 'Opay',
      enabled: false,
      max_retries: 2,
      timeout_seconds: 25,
      priority: 2,
      fallback_enabled: true,
      webhook_validation: true,
      auto_reconciliation: true,
      fraud_detection: true,
      custom_headers: {},
      rate_limit: 800,
      environment: 'live',
      api_credentials: {}
    },
    {
      gateway_id: 'palmpay',
      gateway_name: 'Palmpay',
      enabled: false,
      max_retries: 4,
      timeout_seconds: 35,
      priority: 3,
      fallback_enabled: false,
      webhook_validation: false,
      auto_reconciliation: false,
      fraud_detection: false,
      custom_headers: {},
      rate_limit: 500,
      environment: 'sandbox',
      api_credentials: {}
    }
  ];

  const fetchConfigs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('payment_gateway_configs')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // If no configs exist, create default ones
      if (!data || data.length === 0) {
        await initializeDefaultConfigs(user.id);
        return;
      }

      setConfigs(data);
    } catch (error) {
      console.error('Error fetching gateway configs:', error);
      toast({
        title: "Error",
        description: "Failed to load gateway configurations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaultConfigs = async (userId: string) => {
    try {
      const configsToInsert = defaultGateways.map(config => ({
        ...config,
        user_id: userId
      }));

      const { data, error } = await supabase
        .from('payment_gateway_configs')
        .insert(configsToInsert)
        .select();

      if (error) throw error;
      setConfigs(data);
    } catch (error) {
      console.error('Error initializing gateway configs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleGateway = async (gatewayId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const config = configs.find(c => c.gateway_id === gatewayId);
      if (!config) return;

      const { error } = await supabase
        .from('payment_gateway_configs')
        .update({ enabled: !config.enabled })
        .eq('user_id', user.id)
        .eq('gateway_id', gatewayId);

      if (error) throw error;

      setConfigs(prev => prev.map(c => 
        c.gateway_id === gatewayId 
          ? { ...c, enabled: !c.enabled }
          : c
      ));

      toast({
        title: `${config.gateway_name} ${!config.enabled ? 'Enabled' : 'Disabled'}`,
        description: `Payment gateway has been ${!config.enabled ? 'activated' : 'deactivated'} successfully.`,
      });
    } catch (error) {
      console.error('Error toggling gateway:', error);
      toast({
        title: "Error",
        description: "Failed to update gateway status",
        variant: "destructive"
      });
    }
  };

  const updateGatewaySettings = async (gatewayId: string, settings: Partial<GatewayConfig>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('payment_gateway_configs')
        .update(settings)
        .eq('user_id', user.id)
        .eq('gateway_id', gatewayId);

      if (error) throw error;

      setConfigs(prev => prev.map(c => 
        c.gateway_id === gatewayId 
          ? { ...c, ...settings }
          : c
      ));

      toast({
        title: "Settings Updated",
        description: "Gateway configuration has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating gateway settings:', error);
      toast({
        title: "Error",
        description: "Failed to update gateway settings",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  return {
    configs,
    loading,
    toggleGateway,
    updateGatewaySettings,
    refetch: fetchConfigs
  };
};
