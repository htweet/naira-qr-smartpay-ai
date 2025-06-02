
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GatewayBasicSettingsProps {
  enabled: boolean;
  environment: string;
  onEnabledChange: (checked: boolean) => void;
  onEnvironmentChange: (value: string) => void;
}

const GatewayBasicSettings = ({ enabled, environment, onEnabledChange, onEnvironmentChange }: GatewayBasicSettingsProps) => {
  return (
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
            checked={enabled}
            onCheckedChange={onEnabledChange}
          />
        </div>
        
        <div>
          <Label htmlFor="environment">Environment</Label>
          <Select value={environment} onValueChange={onEnvironmentChange}>
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
  );
};

export default GatewayBasicSettings;
