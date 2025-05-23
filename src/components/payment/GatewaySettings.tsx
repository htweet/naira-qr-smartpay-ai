import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings, Save, RotateCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface GatewaySettingsProps {
  gateway: any;
  onUpdate: (gatewayId: string, settings: any) => void;
}

const GatewaySettings = ({ gateway, onUpdate }: GatewaySettingsProps) => {
  const [settings, setSettings] = useState({
    max_retries: gateway.maxRetries || 3,
    timeout_seconds: gateway.timeout || 30,
    priority: gateway.priority || 1,
    fallback_enabled: gateway.fallbackEnabled || true,
    webhook_validation: gateway.webhookValidation || true,
    auto_reconciliation: gateway.autoReconciliation || false,
    fraud_detection: gateway.fraudDetection || true,
    custom_headers: gateway.customHeaders ? JSON.parse(gateway.customHeaders) : {},
    rate_limit: gateway.rateLimit || 1000,
    environment: gateway.environment || "live"
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleSaveSettings = async () => {
    try {
      await onUpdate(gateway.id, settings);
      setIsOpen(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  const resetToDefaults = () => {
    setSettings({
      max_retries: 3,
      timeout_seconds: 30,
      priority: 1,
      fallback_enabled: true,
      webhook_validation: true,
      auto_reconciliation: false,
      fraud_detection: true,
      custom_headers: {},
      rate_limit: 1000,
      environment: "live"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {gateway.name} Advanced Settings
          </DialogTitle>
          <DialogDescription>
            Configure advanced settings for {gateway.name} payment gateway
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Connection Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Connection Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxRetries">Max Retries</Label>
                  <Input
                    id="maxRetries"
                    type="number"
                    min="1"
                    max="10"
                    value={settings.max_retries}
                    onChange={(e) => setSettings({...settings, max_retries: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="timeout">Timeout (seconds)</Label>
                  <Input
                    id="timeout"
                    type="number"
                    min="5"
                    max="120"
                    value={settings.timeout_seconds}
                    onChange={(e) => setSettings({...settings, timeout_seconds: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="environment">Environment</Label>
                <Select value={settings.environment} onValueChange={(value) => setSettings({...settings, environment: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sandbox">Sandbox (Test)</SelectItem>
                    <SelectItem value="live">Live (Production)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Priority & Routing */}
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Gateway Priority</Label>
                  <Badge variant="outline">{settings.priority}</Badge>
                </div>
                <Slider
                  value={[settings.priority]}
                  onValueChange={(value) => setSettings({...settings, priority: value[0]})}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <p className="text-sm text-gray-500 mt-1">Higher priority gateways are preferred for routing</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Rate Limit (transactions/hour)</Label>
                  <Badge variant="outline">{settings.rate_limit}</Badge>
                </div>
                <Slider
                  value={[settings.rate_limit]}
                  onValueChange={(value) => setSettings({...settings, rate_limit: value[0]})}
                  max={5000}
                  min={100}
                  step={100}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Feature Toggles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Feature Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="fallbackEnabled">Enable Fallback Routing</Label>
                  <p className="text-sm text-gray-500">Automatically route to alternative gateways on failure</p>
                </div>
                <Switch
                  id="fallbackEnabled"
                  checked={settings.fallback_enabled}
                  onCheckedChange={(checked) => setSettings({...settings, fallback_enabled: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="webhookValidation">Webhook Validation</Label>
                  <p className="text-sm text-gray-500">Validate webhook signatures for security</p>
                </div>
                <Switch
                  id="webhookValidation"
                  checked={settings.webhook_validation}
                  onCheckedChange={(checked) => setSettings({...settings, webhook_validation: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoReconciliation">Auto Reconciliation</Label>
                  <p className="text-sm text-gray-500">Automatically reconcile transactions daily</p>
                </div>
                <Switch
                  id="autoReconciliation"
                  checked={settings.auto_reconciliation}
                  onCheckedChange={(checked) => setSettings({...settings, auto_reconciliation: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="fraudDetection">Fraud Detection</Label>
                  <p className="text-sm text-gray-500">Enable AI-powered fraud detection</p>
                </div>
                <Switch
                  id="fraudDetection"
                  checked={settings.fraud_detection}
                  onCheckedChange={(checked) => setSettings({...settings, fraud_detection: checked})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Custom Headers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Custom Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="customHeaders">Custom Headers (JSON)</Label>
                <textarea
                  id="customHeaders"
                  className="w-full mt-1 p-2 border rounded-md"
                  rows={4}
                  placeholder='{"X-Custom-Header": "value", "Authorization": "Bearer token"}'
                  value={JSON.stringify(settings.custom_headers, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      setSettings({...settings, custom_headers: parsed});
                    } catch {
                      // Invalid JSON, keep the text value for now
                    }
                  }}
                />
                <p className="text-sm text-gray-500 mt-1">Additional headers to send with API requests</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={resetToDefaults}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSaveSettings}>
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GatewaySettings;
