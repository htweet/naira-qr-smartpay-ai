
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, Settings, Info } from 'lucide-react';

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

interface GatewayCardProps {
  gateway: Gateway;
  saving: boolean;
  onToggle: (gatewayId: string, enabled: boolean) => void;
  onFieldUpdate: (gatewayId: string, field: keyof Gateway, value: any) => void;
  onSave: (gatewayId: string) => void;
  getStatusBadge: (status: string) => JSX.Element;
  getInstructions: (gatewayId: string) => any;
}

const GatewayCard = ({ 
  gateway, 
  saving, 
  onToggle, 
  onFieldUpdate, 
  onSave, 
  getStatusBadge, 
  getInstructions 
}: GatewayCardProps) => {
  const instructions = getInstructions(gateway.id);

  return (
    <div className="space-y-6">
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
              onCheckedChange={(enabled) => onToggle(gateway.id, enabled)}
            />
            <Label htmlFor={`${gateway.id}-enabled`}>
              {gateway.enabled ? 'Enabled' : 'Disabled'}
            </Label>
          </div>
          {getStatusBadge(gateway.status)}
        </div>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">{instructions?.title}</p>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              {instructions?.steps.map((step: string, index: number) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
            <p className="text-sm">
              <a 
                href={instructions?.docs} 
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
            onChange={(e) => onFieldUpdate(gateway.id, 'api_key', e.target.value)}
            placeholder="Enter API key"
          />
        </div>
        <div>
          <Label htmlFor={`${gateway.id}-secret-key`}>Secret Key</Label>
          <Input
            id={`${gateway.id}-secret-key`}
            type="password"
            value={gateway.secret_key}
            onChange={(e) => onFieldUpdate(gateway.id, 'secret_key', e.target.value)}
            placeholder="Enter secret key"
          />
        </div>
        <div>
          <Label htmlFor={`${gateway.id}-merchant-id`}>Merchant ID (Optional)</Label>
          <Input
            id={`${gateway.id}-merchant-id`}
            value={gateway.merchant_id}
            onChange={(e) => onFieldUpdate(gateway.id, 'merchant_id', e.target.value)}
            placeholder="Enter merchant ID"
          />
        </div>
        <div>
          <Label htmlFor={`${gateway.id}-environment`}>Environment</Label>
          <select
            id={`${gateway.id}-environment`}
            value={gateway.environment}
            onChange={(e) => onFieldUpdate(gateway.id, 'environment', e.target.value as 'live' | 'sandbox')}
            className="w-full p-2 border rounded-md"
          >
            <option value="sandbox">Sandbox (Test)</option>
            <option value="live">Live (Production)</option>
          </select>
        </div>
      </div>

      <Button 
        onClick={() => onSave(gateway.id)}
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
    </div>
  );
};

export default GatewayCard;
