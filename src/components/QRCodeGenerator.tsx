
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import QRGenerator from "@/components/qr/QRGenerator";
import QRHistory from "@/components/qr/QRHistory";

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

  return (
    <div className="space-y-6">
      <QRGenerator 
        qrConfig={qrConfig}
        setQrConfig={setQrConfig}
        onGenerate={generateQRCode}
      />
      <QRHistory generatedQRs={generatedQRs} />
    </div>
  );
};

export default QRCodeGenerator;
