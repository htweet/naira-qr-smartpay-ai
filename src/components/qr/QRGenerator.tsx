
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";
import QRConfigForm from "@/components/qr/QRConfigForm";
import QRPreview from "@/components/qr/QRPreview";

interface QRGeneratorProps {
  qrConfig: any;
  setQrConfig: (config: any) => void;
  onGenerate: () => void;
}

const QRGenerator = ({ qrConfig, setQrConfig, onGenerate }: QRGeneratorProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <QRConfigForm 
        qrConfig={qrConfig}
        setQrConfig={setQrConfig}
        onGenerate={onGenerate}
      />
      <QRPreview qrConfig={qrConfig} />
    </div>
  );
};

export default QRGenerator;
