
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";
import { useGatewayConfigs } from "@/hooks/useGatewayConfigs";

interface QRConfigFormProps {
  qrConfig: any;
  setQrConfig: (config: any) => void;
  onGenerate: (selectedGateway?: string) => void;
}

const QRConfigForm = ({ qrConfig, setQrConfig, onGenerate }: QRConfigFormProps) => {
  const { configs } = useGatewayConfigs();
  const [selectedGateway, setSelectedGateway] = useState<string>("");

  const enabledGateways = configs.filter(config => config.enabled);

  const handleGenerate = () => {
    onGenerate(selectedGateway || undefined);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Generate New QR Code
        </CardTitle>
        <CardDescription>
          Create customized QR codes for your payment needs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Settings</TabsTrigger>
            <TabsTrigger value="design">Design & Branding</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="qr-type">QR Code Type</Label>
                <Select 
                  value={qrConfig.type} 
                  onValueChange={(value) => setQrConfig({...qrConfig, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select QR type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dynamic">
                      Dynamic - Specific Amount
                    </SelectItem>
                    <SelectItem value="static">
                      Static - Customer Enters Amount
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="gateway">Payment Gateway (Optional)</Label>
                <Select 
                  value={selectedGateway} 
                  onValueChange={setSelectedGateway}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Auto-select from enabled gateways" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Auto-select</SelectItem>
                    {enabledGateways.map((gateway) => (
                      <SelectItem key={gateway.gateway_id} value={gateway.gateway_id}>
                        {gateway.gateway_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {enabledGateways.length === 0 && (
                  <p className="text-sm text-yellow-600 mt-1">
                    No payment gateways enabled. Enable at least one gateway for payments.
                  </p>
                )}
              </div>

              {qrConfig.type === "dynamic" && (
                <div>
                  <Label htmlFor="amount">Amount (₦)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={qrConfig.amount}
                    onChange={(e) => setQrConfig({...qrConfig, amount: e.target.value})}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Payment description (optional)"
                  value={qrConfig.description}
                  onChange={(e) => setQrConfig({...qrConfig, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="reference">Reference ID</Label>
                <Input
                  id="reference"
                  placeholder="Auto-generated if empty"
                  value={qrConfig.reference}
                  onChange={(e) => setQrConfig({...qrConfig, reference: e.target.value})}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="design" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={qrConfig.primaryColor}
                      onChange={(e) => setQrConfig({...qrConfig, primaryColor: e.target.value})}
                      className="w-16 h-10"
                    />
                    <Input
                      value={qrConfig.primaryColor}
                      onChange={(e) => setQrConfig({...qrConfig, primaryColor: e.target.value})}
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
                      value={qrConfig.secondaryColor}
                      onChange={(e) => setQrConfig({...qrConfig, secondaryColor: e.target.value})}
                      className="w-16 h-10"
                    />
                    <Input
                      value={qrConfig.secondaryColor}
                      onChange={(e) => setQrConfig({...qrConfig, secondaryColor: e.target.value})}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="logo-enabled">Include Business Logo</Label>
                <Switch
                  id="logo-enabled"
                  checked={qrConfig.logoEnabled}
                  onCheckedChange={(checked) => setQrConfig({...qrConfig, logoEnabled: checked})}
                />
              </div>

              <div>
                <Label htmlFor="eye-style">Eye Style</Label>
                <Select 
                  value={qrConfig.eyeStyle} 
                  onValueChange={(value) => setQrConfig({...qrConfig, eyeStyle: value})}
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
          </TabsContent>
        </Tabs>

        <Button onClick={handleGenerate} className="w-full mt-6">
          <Sparkles className="h-4 w-4 mr-2" />
          Generate QR Code
        </Button>
      </CardContent>
    </Card>
  );
};

export default QRConfigForm;
