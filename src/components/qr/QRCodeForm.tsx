
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import QRBasicSettings from "./QRBasicSettings";
import QRDesignSettings from "./QRDesignSettings";
import { useQRCodes } from "@/hooks/useQRCodes";
import { toast } from "@/hooks/use-toast";

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
      <CardContent className="space-y-6">
        <QRBasicSettings qrConfig={qrConfig} setQrConfig={setQrConfig} />
        <QRDesignSettings qrConfig={qrConfig} setQrConfig={setQrConfig} />
        
        <Button onClick={handleGenerate} className="w-full">
          <Sparkles className="h-4 w-4 mr-2" />
          Generate QR Code
        </Button>
      </CardContent>
    </Card>
  );
};

export default QRCodeForm;
