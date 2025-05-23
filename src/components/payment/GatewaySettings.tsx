
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
    maxRetries: gateway.maxRetries || 3,
    timeout: gateway.timeout || 30,
    priority: gateway.priority || 1,
    fallbackEnabled: gateway.fallbackEnabled || true,
    webhookValidation: gateway.webhookValidation || true,
    autoReconciliation: gateway.autoReconciliation || false,
    fraudDetection: gateway.fraudDetection || true,
    customHeaders: gateway.customHeaders || "",
    rateLimit: gateway.rateLimit || 1000,
    environment: gateway.environment || "live"
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleSaveSettings = () => {
    onUpdate(gateway.id, settings);
    setIsOpen(false);
    toast({
      title: "Settings Updated",
      description: `${gateway.name} configuration has been updated successfully.`,
    });
  };

  const resetToDefaults = () => {
    setSettings({
      maxRetries: 3,
      timeout: 30,
      priority: 1,
      fallbackEnabled: true,
      webhookValidation: true,
      autoReconciliation: false,
      fraudDetection: true,
      customHeaders: "",
      rateLimit: 1000,
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
                    value={settings.maxRetries}
                    onChange={(e) => setSettings({...settings, maxRetries: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="timeout">Timeout (seconds)</Label>
                  <Input
                    id="timeout"
                    type="number"
                    min="5"
                    max="120"
                    value={settings.timeout}
                    onChange={(e) => setSettings({...settings, timeout: parseInt(e.target.value)})}
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
                  <Badge variant="outline">{settings.rateLimit}</Badge>
                </div>
                <Slider
                  value={[settings.rateLimit]}
                  onValueChange={(value) => setSettings({...settings, rateLimit: value[0]})}
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
                  checked={settings.fallbackEnabled}
                  onCheckedChange={(checked) => setSettings({...settings, fallbackEnabled: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="webhookValidation">Webhook Validation</Label>
                  <p className="text-sm text-gray-500">Validate webhook signatures for security</p>
                </div>
                <Switch
                  id="webhookValidation"
                  checked={settings.webhookValidation}
                  onCheckedChange={(checked) => setSettings({...settings, webhookValidation: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoReconciliation">Auto Reconciliation</Label>
                  <p className="text-sm text-gray-500">Automatically reconcile transactions daily</p>
                </div>
                <Switch
                  id="autoReconciliation"
                  checked={settings.autoReconciliation}
                  onCheckedChange={(checked) => setSettings({...settings, autoReconciliation: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="fraudDetection">Fraud Detection</Label>
                  <p className="text-sm text-gray-500">Enable AI-powered fraud detection</p>
                </div>
                <Switch
                  id="fraudDetection"
                  checked={settings.fraudDetection}
                  onCheckedChange={(checked) => setSettings({...settings, fraudDetection: checked})}
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
                  value={settings.customHeaders}
                  onChange={(e) => setSettings({...settings, customHeaders: e.target.value})}
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
