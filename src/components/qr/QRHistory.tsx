
import QRList from "@/components/qr/QRList";
import { QRCodeData } from "@/hooks/useQRCodes";

interface QRHistoryProps {
  generatedQRs: QRCodeData[];
}

const QRHistory = ({ generatedQRs }: QRHistoryProps) => {
  // Transform QRCodeData to the format expected by QRList
  const transformedQRs = generatedQRs.map(qr => ({
    id: qr.qr_code_id,
    type: qr.type,
    description: qr.description || "Payment Request",
    created: new Date(qr.created_at).toLocaleDateString(),
    scans: qr.scans,
    payments: qr.payments,
    revenue: qr.revenue
  }));

  return <QRList generatedQRs={transformedQRs} />;
};

export default QRHistory;
