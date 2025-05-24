
import { useState } from "react";
import QRCodeForm from "@/components/qr/QRCodeForm";
import QRPreview from "@/components/qr/QRPreview";
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
    gateway_id: "",
    primary_color: "#3B82F6",
    secondary_color: "#1E40AF",
    logo_enabled: true,
    eye_style: "square",
    pattern: "standard",
    frame_style: "none",
    error_correction: "M"
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QRCodeForm qrConfig={qrConfig} setQrConfig={setQrConfig} />
        <QRPreview qrConfig={qrConfig} />
      </div>
      <QRHistory />
    </div>
  );
};

export default QRCodeGenerator;
