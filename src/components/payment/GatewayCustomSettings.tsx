
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface GatewayCustomSettingsProps {
  settings: any;
  setSettings: (settings: any) => void;
}

const GatewayCustomSettings = ({ settings, setSettings }: GatewayCustomSettingsProps) => {
  return (
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
  );
};

export default GatewayCustomSettings;
