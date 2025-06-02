
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GatewayCredentialsProps {
  apiKey: string;
  secretKey: string;
  merchantId: string;
  webhookUrl: string;
  onApiKeyChange: (value: string) => void;
  onSecretKeyChange: (value: string) => void;
  onMerchantIdChange: (value: string) => void;
  onWebhookUrlChange: (value: string) => void;
}

const GatewayCredentials = ({ 
  apiKey, 
  secretKey, 
  merchantId, 
  webhookUrl, 
  onApiKeyChange, 
  onSecretKeyChange, 
  onMerchantIdChange, 
  onWebhookUrlChange 
}: GatewayCredentialsProps) => {
  return (
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
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              placeholder="Enter API key"
            />
          </div>
          <div>
            <Label htmlFor="secret_key">Secret Key</Label>
            <Input
              id="secret_key"
              type="password"
              value={secretKey}
              onChange={(e) => onSecretKeyChange(e.target.value)}
              placeholder="Enter secret key"
            />
          </div>
          <div>
            <Label htmlFor="merchant_id">Merchant ID</Label>
            <Input
              id="merchant_id"
              value={merchantId}
              onChange={(e) => onMerchantIdChange(e.target.value)}
              placeholder="Enter merchant ID"
            />
          </div>
          <div>
            <Label htmlFor="webhook_url">Webhook URL</Label>
            <Input
              id="webhook_url"
              value={webhookUrl}
              onChange={(e) => onWebhookUrlChange(e.target.value)}
              placeholder="https://yoursite.com/webhook"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GatewayCredentials;
