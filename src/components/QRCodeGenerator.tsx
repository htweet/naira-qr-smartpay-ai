
import QRCodeManager from "@/components/qr/QRCodeManager";

interface QRCodeGeneratorProps {
  merchant: any;
}

const QRCodeGenerator = ({ merchant }: QRCodeGeneratorProps) => {
  return <QRCodeManager merchant={merchant} />;
};

export default QRCodeGenerator;
