
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, Settings, Key, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import GatewaySettings from './GatewaySettings';

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
            const credentials = config.api_credentials as ApiCredentials | null;
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

      // Update status
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

  const getGatewayInstructions = (gatewayId: string) => {
    const instructions = {
      stripe: {
        title: "Stripe Setup Instructions",
        steps: [
          "Sign up at stripe.com if you haven't already",
          "Go to Developers > API Keys in your Stripe dashboard",
          "Copy your Publishable Key and Secret Key",
          "For testing, use test keys; for live payments, use live keys"
        ],
        docs: "https://stripe.com/docs/keys"
      },
      paystack: {
        title: "Paystack Setup Instructions", 
        steps: [
          "Create account at paystack.com",
          "Go to Settings > API Keys & Webhooks",
          "Copy your Public Key and Secret Key",
          "Set up webhook URL for payment notifications"
        ],
        docs: "https://paystack.com/docs/api/"
      },
      flutterwave: {
        title: "Flutterwave Setup Instructions",
        steps: [
          "Register at flutterwave.com",
          "Navigate to Settings > API Keys",
          "Copy your Public Key and Secret Key",
          "Configure webhook endpoints for payment updates"
        ],
        docs: "https://developer.flutterwave.com/docs"
      },
      palmpay: {
        title: "PalmPay Setup Instructions",
        steps: [
          "Contact PalmPay for merchant account setup",
          "Obtain API credentials from PalmPay team",
          "Configure merchant ID and API keys",
          "Test in sandbox environment before going live"
        ],
        docs: "https://palmpay.com/business"
      }
    };

    return instructions[gatewayId as keyof typeof instructions];
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
              <TabsContent key={gateway.id} value={gateway.id} className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{gateway.name} Configuration</h3>
                    <p className="text-sm text-gray-600">
                      Configure API credentials and settings for {gateway.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`${gateway.id}-enabled`}
                        checked={gateway.enabled}
                        onCheckedChange={(enabled) => toggleGateway(gateway.id, enabled)}
                      />
                      <Label htmlFor={`${gateway.id}-enabled`}>
                        {gateway.enabled ? 'Enabled' : 'Disabled'}
                      </Label>
                    </div>
                    <GatewaySettings 
                      gateway={gateway} 
                      onUpdate={(gatewayId, settings) => {
                        // Update gateway with advanced settings
                        console.log('Updated settings for', gatewayId, settings);
                      }}
                    />
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">{getGatewayInstructions(gateway.id)?.title}</p>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        {getGatewayInstructions(gateway.id)?.steps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                      <p className="text-sm">
                        <a 
                          href={getGatewayInstructions(gateway.id)?.docs} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Official Documentation →
                        </a>
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`${gateway.id}-api-key`}>API Key / Public Key</Label>
                    <Input
                      id={`${gateway.id}-api-key`}
                      type="password"
                      value={gateway.api_key}
                      onChange={(e) => updateGatewayField(gateway.id, 'api_key', e.target.value)}
                      placeholder="Enter API key"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`${gateway.id}-secret-key`}>Secret Key</Label>
                    <Input
                      id={`${gateway.id}-secret-key`}
                      type="password"
                      value={gateway.secret_key}
                      onChange={(e) => updateGatewayField(gateway.id, 'secret_key', e.target.value)}
                      placeholder="Enter secret key"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`${gateway.id}-merchant-id`}>Merchant ID (Optional)</Label>
                    <Input
                      id={`${gateway.id}-merchant-id`}
                      value={gateway.merchant_id}
                      onChange={(e) => updateGatewayField(gateway.id, 'merchant_id', e.target.value)}
                      placeholder="Enter merchant ID"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`${gateway.id}-environment`}>Environment</Label>
                    <select
                      id={`${gateway.id}-environment`}
                      value={gateway.environment}
                      onChange={(e) => updateGatewayField(gateway.id, 'environment', e.target.value as 'live' | 'sandbox')}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="sandbox">Sandbox (Test)</option>
                      <option value="live">Live (Production)</option>
                    </select>
                  </div>
                </div>

                <Button 
                  onClick={() => saveGatewayConfig(gateway.id)}
                  disabled={saving}
                  className="w-full"
                >
                  {saving ? (
                    <>
                      <Settings className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save {gateway.name} Configuration
                    </>
                  )}
                </Button>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentGatewayManager;
