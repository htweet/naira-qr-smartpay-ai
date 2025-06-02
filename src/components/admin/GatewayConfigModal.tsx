
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import GatewayBasicSettings from './gateway/GatewayBasicSettings';
import GatewayCredentials from './gateway/GatewayCredentials';
import GatewayAdvancedSettings from './gateway/GatewayAdvancedSettings';
import GatewayTestConnection from './gateway/GatewayTestConnection';

interface GatewayConfigModalProps {
  gateway: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

interface ApiCredentials {
  api_key?: string;
  secret_key?: string;
  merchant_id?: string;
  webhook_url?: string;
}

const GatewayConfigModal = ({ gateway, isOpen, onClose, onUpdate }: GatewayConfigModalProps) => {
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [formData, setFormData] = useState({
    enabled: false,
    environment: 'sandbox',
    api_key: '',
    secret_key: '',
    merchant_id: '',
    webhook_url: '',
    timeout_seconds: 30,
    max_retries: 3,
    rate_limit: 1000,
  });

  useEffect(() => {
    if (gateway && isOpen) {
      loadGatewayConfig();
    }
  }, [gateway, isOpen]);

  const loadGatewayConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_gateway_configs')
        .select('*')
        .eq('gateway_id', gateway.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        const credentials = data.api_credentials as ApiCredentials || {};
        setFormData({
          enabled: data.enabled || false,
          environment: data.environment || 'sandbox',
          api_key: credentials.api_key || '',
          secret_key: credentials.secret_key || '',
          merchant_id: credentials.merchant_id || '',
          webhook_url: credentials.webhook_url || '',
          timeout_seconds: data.timeout_seconds || 30,
          max_retries: data.max_retries || 3,
          rate_limit: data.rate_limit || 1000,
        });
      }
    } catch (error) {
      console.error('Error loading gateway config:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const configData = {
        gateway_id: gateway.id,
        gateway_name: gateway.name,
        enabled: formData.enabled,
        environment: formData.environment,
        api_credentials: {
          api_key: formData.api_key,
          secret_key: formData.secret_key,
          merchant_id: formData.merchant_id,
          webhook_url: formData.webhook_url,
        },
        timeout_seconds: formData.timeout_seconds,
        max_retries: formData.max_retries,
        rate_limit: formData.rate_limit,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('payment_gateway_configs')
        .upsert(configData);

      if (error) throw error;

      toast({
        title: "Configuration Saved",
        description: `${gateway.name} configuration has been saved successfully.`,
      });

      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error saving gateway config:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save gateway configuration.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Configure {gateway?.name} Gateway
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <GatewayBasicSettings
            enabled={formData.enabled}
            environment={formData.environment}
            onEnabledChange={(checked) => setFormData(prev => ({ ...prev, enabled: checked }))}
            onEnvironmentChange={(value) => setFormData(prev => ({ ...prev, environment: value }))}
          />

          <GatewayCredentials
            apiKey={formData.api_key}
            secretKey={formData.secret_key}
            merchantId={formData.merchant_id}
            webhookUrl={formData.webhook_url}
            onApiKeyChange={(value) => setFormData(prev => ({ ...prev, api_key: value }))}
            onSecretKeyChange={(value) => setFormData(prev => ({ ...prev, secret_key: value }))}
            onMerchantIdChange={(value) => setFormData(prev => ({ ...prev, merchant_id: value }))}
            onWebhookUrlChange={(value) => setFormData(prev => ({ ...prev, webhook_url: value }))}
          />

          <GatewayAdvancedSettings
            timeoutSeconds={formData.timeout_seconds}
            maxRetries={formData.max_retries}
            rateLimit={formData.rate_limit}
            onTimeoutChange={(value) => setFormData(prev => ({ ...prev, timeout_seconds: value }))}
            onMaxRetriesChange={(value) => setFormData(prev => ({ ...prev, max_retries: value }))}
            onRateLimitChange={(value) => setFormData(prev => ({ ...prev, rate_limit: value }))}
          />

          <div className="flex justify-between">
            <GatewayTestConnection
              apiKey={formData.api_key}
              secretKey={formData.secret_key}
              testResult={testResult}
              onTestResult={setTestResult}
            />
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? (
                  <>
                    <Save className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Configuration
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GatewayConfigModal;
