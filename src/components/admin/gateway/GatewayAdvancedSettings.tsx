
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GatewayAdvancedSettingsProps {
  timeoutSeconds: number;
  maxRetries: number;
  rateLimit: number;
  onTimeoutChange: (value: number) => void;
  onMaxRetriesChange: (value: number) => void;
  onRateLimitChange: (value: number) => void;
}

const GatewayAdvancedSettings = ({
  timeoutSeconds,
  maxRetries,
  rateLimit,
  onTimeoutChange,
  onMaxRetriesChange,
  onRateLimitChange
}: GatewayAdvancedSettingsProps) => {
  return (
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
              value={timeoutSeconds}
              onChange={(e) => onTimeoutChange(parseInt(e.target.value) || 30)}
              min="5"
              max="300"
            />
          </div>
          <div>
            <Label htmlFor="max_retries">Max Retries</Label>
            <Input
              id="max_retries"
              type="number"
              value={maxRetries}
              onChange={(e) => onMaxRetriesChange(parseInt(e.target.value) || 3)}
              min="0"
              max="10"
            />
          </div>
          <div>
            <Label htmlFor="rate_limit">Rate Limit (req/min)</Label>
            <Input
              id="rate_limit"
              type="number"
              value={rateLimit}
              onChange={(e) => onRateLimitChange(parseInt(e.target.value) || 1000)}
              min="1"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GatewayAdvancedSettings;
