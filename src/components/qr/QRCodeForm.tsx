
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";
import QRBasicSettings from "./QRBasicSettings";
import QRDesignSettings from "./QRDesignSettings";
import { useQRCodes } from "@/hooks/useQRCodes";

interface QRCodeFormProps {
  qrConfig: any;
  setQrConfig: (config: any) => void;
}

const QRCodeForm = ({ qrConfig, setQrConfig }: QRCodeFormProps) => {
  const { createQRCode } = useQRCodes();

  const handleGenerate = async () => {
    try {
      await createQRCode(qrConfig);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
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
            <TabsTrigger value="design">QR Code Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <QRBasicSettings qrConfig={qrConfig} setQrConfig={setQrConfig} />
          </TabsContent>

          <TabsContent value="design" className="space-y-4">
            <QRDesignSettings qrConfig={qrConfig} setQrConfig={setQrConfig} />
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

export default QRCodeForm;
