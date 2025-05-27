
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

interface GatewayPrioritySettingsProps {
  settings: any;
  setSettings: (settings: any) => void;
}

const GatewayPrioritySettings = ({ settings, setSettings }: GatewayPrioritySettingsProps) => {
  return (
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
  );
};

export default GatewayPrioritySettings;
