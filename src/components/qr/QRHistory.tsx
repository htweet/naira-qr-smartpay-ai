
import QRList from "@/components/qr/QRList";

interface QRHistoryProps {
  generatedQRs: any[];
}

const QRHistory = ({ generatedQRs }: QRHistoryProps) => {
  return <QRList generatedQRs={generatedQRs} />;
};

export default QRHistory;
