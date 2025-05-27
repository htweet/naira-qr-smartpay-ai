
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GatewayConnectionSettingsProps {
  settings: any;
  setSettings: (settings: any) => void;
}

const GatewayConnectionSettings = ({ settings, setSettings }: GatewayConnectionSettingsProps) => {
  return (
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
              onChange={(e) => setSettings({...settings, maxRetries: parseInt(e.target.value) || 3})}
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
              onChange={(e) => setSettings({...settings, timeout: parseInt(e.target.value) || 30})}
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
  );
};

export default GatewayConnectionSettings;
