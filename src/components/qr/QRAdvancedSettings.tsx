
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Zap, Shield, QrCode } from "lucide-react";

interface QRAdvancedSettingsProps {
  qrConfig: any;
  setQrConfig: (config: any) => void;
}

const QRAdvancedSettings = ({ qrConfig, setQrConfig }: QRAdvancedSettingsProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code Technical Settings
          </CardTitle>
          <CardDescription>Fine-tune QR code generation parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="error-correction">Error Correction Level</Label>
            <Select 
              value={qrConfig.error_correction} 
              onValueChange={(value) => setQrConfig({...qrConfig, error_correction: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="L">Low (7% recovery)</SelectItem>
                <SelectItem value="M">Medium (15% recovery)</SelectItem>
                <SelectItem value="Q">Quartile (25% recovery)</SelectItem>
                <SelectItem value="H">High (30% recovery)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="qr-size">QR Code Size (pixels)</Label>
            <div className="space-y-2">
              <Slider
                value={[qrConfig.size || 300]}
                onValueChange={(value) => setQrConfig({...qrConfig, size: value[0]})}
                max={1000}
                min={150}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>150px</span>
                <span>Current: {qrConfig.size || 300}px</span>
                <span>1000px</span>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="margin">Quiet Zone Margin</Label>
            <div className="space-y-2">
              <Slider
                value={[qrConfig.margin || 4]}
                onValueChange={(value) => setQrConfig({...qrConfig, margin: value[0]})}
                max={10}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>0</span>
                <span>Current: {qrConfig.margin || 4}</span>
                <span>10</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Validation
          </CardTitle>
          <CardDescription>Advanced security features for QR codes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="expiry-enabled">Enable QR Code Expiry</Label>
              <p className="text-sm text-gray-600">Automatically expire QR codes after set time</p>
            </div>
            <Switch
              id="expiry-enabled"
              checked={qrConfig.expiry_enabled || false}
              onCheckedChange={(checked) => setQrConfig({...qrConfig, expiry_enabled: checked})}
            />
          </div>

          {qrConfig.expiry_enabled && (
            <div>
              <Label htmlFor="expiry-hours">Expiry Time (hours)</Label>
              <Input
                id="expiry-hours"
                type="number"
                value={qrConfig.expiry_hours || 24}
                onChange={(e) => setQrConfig({...qrConfig, expiry_hours: parseInt(e.target.value)})}
                min="1"
                max="8760"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="usage-limit">Enable Usage Limit</Label>
              <p className="text-sm text-gray-600">Limit how many times QR code can be scanned</p>
            </div>
            <Switch
              id="usage-limit"
              checked={qrConfig.usage_limit_enabled || false}
              onCheckedChange={(checked) => setQrConfig({...qrConfig, usage_limit_enabled: checked})}
            />
          </div>

          {qrConfig.usage_limit_enabled && (
            <div>
              <Label htmlFor="max-scans">Maximum Scans</Label>
              <Input
                id="max-scans"
                type="number"
                value={qrConfig.max_scans || 100}
                onChange={(e) => setQrConfig({...qrConfig, max_scans: parseInt(e.target.value)})}
                min="1"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="fraud-detection">Enable Fraud Detection</Label>
              <p className="text-sm text-gray-600">AI-powered fraud prevention for payments</p>
            </div>
            <Switch
              id="fraud-detection"
              checked={qrConfig.fraud_detection || true}
              onCheckedChange={(checked) => setQrConfig({...qrConfig, fraud_detection: checked})}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Advanced Features
          </CardTitle>
          <CardDescription>Enhanced QR code functionality</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="analytics-tracking">Enable Analytics Tracking</Label>
              <p className="text-sm text-gray-600">Track scan locations, devices, and timing</p>
            </div>
            <Switch
              id="analytics-tracking"
              checked={qrConfig.analytics_enabled || true}
              onCheckedChange={(checked) => setQrConfig({...qrConfig, analytics_enabled: checked})}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="webhook-notifications">Webhook Notifications</Label>
              <p className="text-sm text-gray-600">Send real-time notifications on QR code events</p>
            </div>
            <Switch
              id="webhook-notifications"
              checked={qrConfig.webhook_enabled || false}
              onCheckedChange={(checked) => setQrConfig({...qrConfig, webhook_enabled: checked})}
            />
          </div>

          {qrConfig.webhook_enabled && (
            <div>
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input
                id="webhook-url"
                type="url"
                value={qrConfig.webhook_url || ''}
                onChange={(e) => setQrConfig({...qrConfig, webhook_url: e.target.value})}
                placeholder="https://your-api.com/webhook"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dynamic-content">Dynamic Content Updates</Label>
              <p className="text-sm text-gray-600">Allow content updates without regenerating QR code</p>
            </div>
            <Switch
              id="dynamic-content"
              checked={qrConfig.dynamic_updates || false}
              onCheckedChange={(checked) => setQrConfig({...qrConfig, dynamic_updates: checked})}
            />
          </div>

          <div>
            <Label htmlFor="redirect-url">Custom Redirect URL</Label>
            <Input
              id="redirect-url"
              type="url"
              value={qrConfig.redirect_url || ''}
              onChange={(e) => setQrConfig({...qrConfig, redirect_url: e.target.value})}
              placeholder="https://your-site.com/payment-success"
            />
            <p className="text-xs text-gray-600 mt-1">Optional: Redirect users after successful payment</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRAdvancedSettings;
