
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Key, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import GatewayCard from './GatewayCard';
import { getGatewayInstructions } from './GatewayInstructions';

interface ApiCredentials {
  api_key: string;
  secret_key: string;
  merchant_id: string;
}

interface Gateway {
  id: string;
  name: string;
  enabled: boolean;
  api_key: string;
  secret_key: string;
  merchant_id: string;
  environment: 'live' | 'sandbox';
  status: 'active' | 'inactive' | 'error';
}

const PaymentGatewayManager = () => {
  const { user } = useAuth();
  const [gateways, setGateways] = useState<Gateway[]>([
    {
      id: 'stripe',
      name: 'Stripe',
      enabled: false,
      api_key: '',
      secret_key: '',
      merchant_id: '',
      environment: 'sandbox',
      status: 'inactive'
    },
    {
      id: 'paystack',
      name: 'Paystack',
      enabled: false,
      api_key: '',
      secret_key: '',
      merchant_id: '',
      environment: 'sandbox',
      status: 'inactive'
    },
    {
      id: 'flutterwave',
      name: 'Flutterwave',
      enabled: false,
      api_key: '',
      secret_key: '',
      merchant_id: '',
      environment: 'sandbox',
      status: 'inactive'
    },
    {
      id: 'palmpay',
      name: 'PalmPay',
      enabled: false,
      api_key: '',
      secret_key: '',
      merchant_id: '',
      environment: 'sandbox',
      status: 'inactive'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadGatewayConfigs();
  }, [user]);

  const loadGatewayConfigs = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payment_gateway_configs')
        .select('*')
        .eq('user_id', user.id);

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data && data.length > 0) {
        setGateways(prev => prev.map(gateway => {
          const config = data.find(d => d.gateway_id === gateway.id);
          if (config) {
            const credentials = config.api_credentials as unknown as ApiCredentials;
            return {
              ...gateway,
              enabled: config.enabled || false,
              api_key: credentials?.api_key || '',
              secret_key: credentials?.secret_key || '',
              merchant_id: credentials?.merchant_id || '',
              environment: config.environment as 'live' | 'sandbox' || 'sandbox',
              status: config.enabled ? 'active' : 'inactive'
            };
          }
          return gateway;
        }));
      }
    } catch (error) {
      console.error('Error loading gateway configs:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveGatewayConfig = async (gatewayId: string) => {
    if (!user) return;

    const gateway = gateways.find(g => g.id === gatewayId);
    if (!gateway) return;

    try {
      setSaving(true);

      const { error } = await supabase
        .from('payment_gateway_configs')
        .upsert({
          user_id: user.id,
          gateway_id: gateway.id,
          gateway_name: gateway.name,
          enabled: gateway.enabled,
          environment: gateway.environment,
          api_credentials: {
            api_key: gateway.api_key,
            secret_key: gateway.secret_key,
            merchant_id: gateway.merchant_id
          },
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `${gateway.name} configuration saved successfully`,
      });

      setGateways(prev => prev.map(g => 
        g.id === gatewayId 
          ? { ...g, status: g.enabled ? 'active' : 'inactive' }
          : g
      ));
    } catch (error: any) {
      console.error('Error saving gateway config:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to save ${gateway.name} configuration`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleGateway = (gatewayId: string, enabled: boolean) => {
    setGateways(prev => prev.map(g => 
      g.id === gatewayId ? { ...g, enabled } : g
    ));
  };

  const updateGatewayField = (gatewayId: string, field: keyof Gateway, value: any) => {
    setGateways(prev => prev.map(g => 
      g.id === gatewayId ? { ...g, [field]: value } : g
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Inactive</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Payment Gateway Configuration
          </CardTitle>
          <CardDescription>
            Configure your payment gateways and API credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={gateways[0]?.id} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {gateways.map(gateway => (
                <TabsTrigger key={gateway.id} value={gateway.id} className="flex items-center gap-2">
                  {gateway.name}
                  {getStatusBadge(gateway.status)}
                </TabsTrigger>
              ))}
            </TabsList>

            {gateways.map(gateway => (
              <TabsContent key={gateway.id} value={gateway.id}>
                <GatewayCard
                  gateway={gateway}
                  saving={saving}
                  onToggle={toggleGateway}
                  onFieldUpdate={updateGatewayField}
                  onSave={saveGatewayConfig}
                  getStatusBadge={getStatusBadge}
                  getInstructions={getGatewayInstructions}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentGatewayManager;
