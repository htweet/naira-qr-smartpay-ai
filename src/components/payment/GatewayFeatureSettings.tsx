
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface GatewayFeatureSettingsProps {
  settings: any;
  setSettings: (settings: any) => void;
}

const GatewayFeatureSettings = ({ settings, setSettings }: GatewayFeatureSettingsProps) => {
  return (
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
  );
};

export default GatewayFeatureSettings;
