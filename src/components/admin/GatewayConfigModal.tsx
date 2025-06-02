
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, TestTube, CheckCircle, XCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface GatewayConfigModalProps {
  gateway: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const GatewayConfigModal = ({ gateway, isOpen, onClose, onUpdate }: GatewayConfigModalProps) => {
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
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
        setFormData({
          enabled: data.enabled || false,
          environment: data.environment || 'sandbox',
          api_key: data.api_credentials?.api_key || '',
          secret_key: data.api_credentials?.secret_key || '',
          merchant_id: data.api_credentials?.merchant_id || '',
          webhook_url: data.api_credentials?.webhook_url || '',
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

  const handleTest = async () => {
    setTesting(true);
    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Random success/failure for demo (in real implementation, you'd test actual API)
      const success = Math.random() > 0.3;
      setTestResult(success ? 'success' : 'error');

      toast({
        title: success ? "Test Successful" : "Test Failed",
        description: success 
          ? "Gateway connection is working correctly."
          : "Failed to connect to gateway. Please check your credentials.",
        variant: success ? "default" : "destructive",
      });
    } catch (error) {
      setTestResult('error');
      toast({
        title: "Test Failed",
        description: "Failed to test gateway connection.",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Configure {gateway?.name} Gateway
            {testResult === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
            {testResult === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enabled">Enable Gateway</Label>
                  <p className="text-sm text-gray-600">Allow payments through this gateway</p>
                </div>
                <Switch
                  id="enabled"
                  checked={formData.enabled}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enabled: checked }))}
                />
              </div>
              
              <div>
                <Label htmlFor="environment">Environment</Label>
                <Select value={formData.environment} onValueChange={(value) => setFormData(prev => ({ ...prev, environment: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select environment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sandbox">Sandbox (Test)</SelectItem>
                    <SelectItem value="live">Live (Production)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">API Credentials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="api_key">API Key / Public Key</Label>
                  <Input
                    id="api_key"
                    type="password"
                    value={formData.api_key}
                    onChange={(e) => setFormData(prev => ({ ...prev, api_key: e.target.value }))}
                    placeholder="Enter API key"
                  />
                </div>
                <div>
                  <Label htmlFor="secret_key">Secret Key</Label>
                  <Input
                    id="secret_key"
                    type="password"
                    value={formData.secret_key}
                    onChange={(e) => setFormData(prev => ({ ...prev, secret_key: e.target.value }))}
                    placeholder="Enter secret key"
                  />
                </div>
                <div>
                  <Label htmlFor="merchant_id">Merchant ID</Label>
                  <Input
                    id="merchant_id"
                    value={formData.merchant_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, merchant_id: e.target.value }))}
                    placeholder="Enter merchant ID"
                  />
                </div>
                <div>
                  <Label htmlFor="webhook_url">Webhook URL</Label>
                  <Input
                    id="webhook_url"
                    value={formData.webhook_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, webhook_url: e.target.value }))}
                    placeholder="https://yoursite.com/webhook"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Advanced Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="timeout_seconds">Timeout (seconds)</Label>
                  <Input
                    id="timeout_seconds"
                    type="number"
                    value={formData.timeout_seconds}
                    onChange={(e) => setFormData(prev => ({ ...prev, timeout_seconds: parseInt(e.target.value) || 30 }))}
                    min="5"
                    max="300"
                  />
                </div>
                <div>
                  <Label htmlFor="max_retries">Max Retries</Label>
                  <Input
                    id="max_retries"
                    type="number"
                    value={formData.max_retries}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_retries: parseInt(e.target.value) || 3 }))}
                    min="0"
                    max="10"
                  />
                </div>
                <div>
                  <Label htmlFor="rate_limit">Rate Limit (req/min)</Label>
                  <Input
                    id="rate_limit"
                    type="number"
                    value={formData.rate_limit}
                    onChange={(e) => setFormData(prev => ({ ...prev, rate_limit: parseInt(e.target.value) || 1000 }))}
                    min="1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleTest}
              disabled={testing || !formData.api_key || !formData.secret_key}
            >
              {testing ? (
                <>
                  <TestTube className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <TestTube className="h-4 w-4 mr-2" />
                  Test Connection
                </>
              )}
            </Button>
            
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
