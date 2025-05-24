
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface QRDesignSettingsProps {
  qrConfig: any;
  setQrConfig: (config: any) => void;
}

const QRDesignSettings = ({ qrConfig, setQrConfig }: QRDesignSettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="primary-color">Primary Color</Label>
          <div className="flex items-center gap-2">
            <Input
              id="primary-color"
              type="color"
              value={qrConfig.primary_color}
              onChange={(e) => setQrConfig({...qrConfig, primary_color: e.target.value})}
              className="w-16 h-10"
            />
            <Input
              value={qrConfig.primary_color}
              onChange={(e) => setQrConfig({...qrConfig, primary_color: e.target.value})}
              className="flex-1"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="secondary-color">Secondary Color</Label>
          <div className="flex items-center gap-2">
            <Input
              id="secondary-color"
              type="color"
              value={qrConfig.secondary_color}
              onChange={(e) => setQrConfig({...qrConfig, secondary_color: e.target.value})}
              className="w-16 h-10"
            />
            <Input
              value={qrConfig.secondary_color}
              onChange={(e) => setQrConfig({...qrConfig, secondary_color: e.target.value})}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="logo-enabled">Include Business Logo</Label>
        <Switch
          id="logo-enabled"
          checked={qrConfig.logo_enabled}
          onCheckedChange={(checked) => setQrConfig({...qrConfig, logo_enabled: checked})}
        />
      </div>

      <div>
        <Label htmlFor="eye-style">Eye Style</Label>
        <Select 
          value={qrConfig.eye_style} 
          onValueChange={(value) => setQrConfig({...qrConfig, eye_style: value})}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="square">Square</SelectItem>
            <SelectItem value="circle">Circle</SelectItem>
            <SelectItem value="rounded">Rounded</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default QRDesignSettings;
