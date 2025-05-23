
import { useState } from "react";
import { useQRCodes } from "@/hooks/useQRCodes";
import QRGenerator from "@/components/qr/QRGenerator";
import QRHistory from "@/components/qr/QRHistory";

interface QRCodeManagerProps {
  merchant: any;
}

const QRCodeManager = ({ merchant }: QRCodeManagerProps) => {
  const { qrCodes, generateQRCode } = useQRCodes();
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

  const handleGenerateQR = async (selectedGateway?: string) => {
    try {
      await generateQRCode(qrConfig, selectedGateway);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };

  // Transform database QR codes to match the expected format
  const transformedQRs = qrCodes.map(qr => ({
    id: qr.qr_code_id,
    type: qr.type,
    amount: qr.amount,
    description: qr.description || "Payment Request",
    created: qr.created_at.split('T')[0],
    scans: qr.scans,
    payments: qr.payments,
    revenue: qr.revenue,
    gateway_id: qr.gateway_id
  }));

  return (
    <div className="space-y-6">
      <QRGenerator 
        qrConfig={qrConfig}
        setQrConfig={setQrConfig}
        onGenerate={handleGenerateQR}
      />
      <QRHistory generatedQRs={transformedQRs} />
    </div>
  );
};

export default QRCodeManager;
