
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  QrCode, 
  Download, 
  Share2, 
  Copy, 
  Palette, 
  Eye,
  Sparkles,
  Settings
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface QRCodeGeneratorProps {
  merchant: any;
}

const QRCodeGenerator = ({ merchant }: QRCodeGeneratorProps) => {
  const [qrConfig, setQrConfig] = useState({
    type: "dynamic",
    amount: "",
    description: "",
    reference: "",
    primaryColor: "#3B82F6",
    secondaryColor: "#1E40AF",
    logoEnabled: true,
    eyeStyle: "square",
    pattern: "standard",
    frameStyle: "none",
    errorCorrection: "M"
  });

  const [generatedQRs, setGeneratedQRs] = useState([
    {
      id: "QR001",
      type: "dynamic",
      amount: 15000,
      description: "Product Purchase",
      created: "2024-01-20",
      scans: 45,
      payments: 42,
      revenue: 630000
    },
    {
      id: "QR002",
      type: "static",
      amount: null,
      description: "General Payment",
      created: "2024-01-18",
      scans: 128,
      payments: 89,
      revenue: 1250000
    }
  ]);

  const generateQRCode = () => {
    const newQR = {
      id: `QR${String(generatedQRs.length + 1).padStart(3, '0')}`,
      type: qrConfig.type,
      amount: qrConfig.amount ? parseInt(qrConfig.amount) : null,
      description: qrConfig.description || "Payment Request",
      created: new Date().toISOString().split('T')[0],
      scans: 0,
      payments: 0,
      revenue: 0
    };

    setGeneratedQRs([newQR, ...generatedQRs]);
    toast({
      title: "QR Code Generated",
      description: `${qrConfig.type} QR code created successfully`,
    });
  };

  const copyQRCode = (qrId: string) => {
    navigator.clipboard.writeText(`https://pay.payqr.ng/${qrId}`);
    toast({
      title: "Link Copied",
      description: "QR code payment link copied to clipboard",
    });
  };

  const downloadQRCode = (qrId: string) => {
    toast({
      title: "Download Started",
      description: `QR code ${qrId} is being downloaded`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Code Generator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
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

                  <div>
                    <Label htmlFor="pattern">Pattern Style</Label>
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
                </div>
              </TabsContent>
            </Tabs>

            <Button onClick={generateQRCode} className="w-full mt-6">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate QR Code
            </Button>
          </CardContent>
        </Card>

        {/* QR Code Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Live Preview
            </CardTitle>
            <CardDescription>
              See how your QR code will look
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            {/* QR Code Preview Placeholder */}
            <div 
              className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gradient-to-br"
              style={{
                backgroundImage: `linear-gradient(45deg, ${qrConfig.primaryColor}20, ${qrConfig.secondaryColor}20)`
              }}
            >
              <div className="text-center">
                <QrCode className="h-16 w-16 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">QR Code Preview</p>
              </div>
            </div>

            <div className="text-center space-y-2">
              <Badge variant="outline" className="bg-white">
                {qrConfig.type === "dynamic" ? "Fixed Amount" : "Variable Amount"}
              </Badge>
              {qrConfig.amount && (
                <p className="font-medium">₦{parseInt(qrConfig.amount).toLocaleString()}</p>
              )}
              {qrConfig.description && (
                <p className="text-sm text-gray-600">{qrConfig.description}</p>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generated QR Codes List */}
      <Card>
        <CardHeader>
          <CardTitle>Generated QR Codes</CardTitle>
          <CardDescription>
            Manage and track performance of your QR codes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {generatedQRs.map((qr) => (
              <div key={qr.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <QrCode className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{qr.id}</span>
                      <Badge variant={qr.type === "dynamic" ? "default" : "secondary"}>
                        {qr.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{qr.description}</p>
                    <p className="text-xs text-gray-500">Created: {qr.created}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="text-center">
                      <p className="text-sm font-medium">{qr.scans}</p>
                      <p className="text-xs text-gray-500">Scans</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">{qr.payments}</p>
                      <p className="text-xs text-gray-500">Payments</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">₦{qr.revenue.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Revenue</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => copyQRCode(qr.id)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => downloadQRCode(qr.id)}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodeGenerator;
