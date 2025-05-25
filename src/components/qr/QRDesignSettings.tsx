
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Eye, Layers, Frame } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

interface QRDesignSettingsProps {
  qrConfig: any;
  setQrConfig: (config: any) => void;
}

const QRDesignSettings = ({ qrConfig, setQrConfig }: QRDesignSettingsProps) => {
  const { profile } = useProfile();

  const colors = [
    { name: "Blue", value: "#3B82F6" },
    { name: "Green", value: "#10B981" },
    { name: "Purple", value: "#8B5CF6" },
    { name: "Red", value: "#EF4444" },
    { name: "Orange", value: "#F97316" },
    { name: "Pink", value: "#EC4899" },
    { name: "Black", value: "#000000" },
  ];

  return (
    <div className="space-y-6">
      {/* Color Customization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Color Customization
          </CardTitle>
          <CardDescription>Choose colors for your QR code</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Primary Color</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={`w-full h-10 rounded-md border-2 ${
                    qrConfig.primary_color === color.value ? 'border-gray-800' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setQrConfig({...qrConfig, primary_color: color.value})}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div>
            <Label>Secondary Color</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={`w-full h-10 rounded-md border-2 ${
                    qrConfig.secondary_color === color.value ? 'border-gray-800' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setQrConfig({...qrConfig, secondary_color: color.value})}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Style Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Style Options
          </CardTitle>
          <CardDescription>Customize the appearance of your QR code</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Eye Style</Label>
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

          <div>
            <Label>Pattern Style</Label>
            <Select 
              value={qrConfig.pattern} 
              onValueChange={(value) => setQrConfig({...qrConfig, pattern: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="dots">Dots</SelectItem>
                <SelectItem value="rounded">Rounded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Frame Style</Label>
            <Select 
              value={qrConfig.frame_style} 
              onValueChange={(value) => setQrConfig({...qrConfig, frame_style: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="square">Square Frame</SelectItem>
                <SelectItem value="circle">Circle Frame</SelectItem>
                <SelectItem value="rounded">Rounded Frame</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Logo Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Logo Settings
          </CardTitle>
          <CardDescription>Add your business logo to the QR code</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Include Business Logo</Label>
              <p className="text-sm text-gray-500">
                {profile?.business_logo ? 'Use your uploaded business logo' : 'Upload a logo in account settings first'}
              </p>
            </div>
            <Switch
              checked={qrConfig.logo_enabled && !!profile?.business_logo}
              onCheckedChange={(checked) => setQrConfig({...qrConfig, logo_enabled: checked})}
              disabled={!profile?.business_logo}
            />
          </div>
          
          {profile?.business_logo && (
            <div className="mt-2">
              <img 
                src={profile.business_logo} 
                alt="Business Logo" 
                className="w-12 h-12 rounded-md object-cover border"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Correction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Frame className="h-4 w-4" />
            Error Correction
          </CardTitle>
          <CardDescription>Higher levels allow more damage but create denser codes</CardDescription>
        </CardHeader>
        <CardContent>
          <Select 
            value={qrConfig.error_correction} 
            onValueChange={(value) => setQrConfig({...qrConfig, error_correction: value})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L">Low (~7%)</SelectItem>
              <SelectItem value="M">Medium (~15%)</SelectItem>
              <SelectItem value="Q">Quartile (~25%)</SelectItem>
              <SelectItem value="H">High (~30%)</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRDesignSettings;
