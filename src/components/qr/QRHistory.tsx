import QRList from "@/components/qr/QRList";
import { QRCodeData, useQRCodes } from "@/hooks/useQRCodes";

interface QRHistoryProps {
  generatedQRs: QRCodeData[];
  merchantId?: string;
}

const QRHistory = ({ generatedQRs, merchantId }: QRHistoryProps) => {
  const { deleteQRCode, updateQRCode } = useQRCodes(merchantId);

  const transformedQRs = generatedQRs.map(qr => ({
    id: qr.id,
    qr_code_id: qr.qr_code_id,
    type: qr.type,
    description: qr.description || "Payment Request",
    created: new Date(qr.created_at).toLocaleDateString(),
    scans: qr.scans,
    payments: qr.payments,
    revenue: qr.revenue,
    amount: qr.amount,
    primary_color: qr.primary_color,
    secondary_color: qr.secondary_color,
    pattern: qr.pattern,
    eye_style: qr.eye_style,
    status: "active",
  }));

  const handleDelete = async (id: string) => {
    try { await deleteQRCode(id); } catch {}
  };

  const handleToggleStatus = async (id: string, status: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { supabase } = await import("@/integrations/supabase/client");
      const client = supabase as any;
      await client.from("qr_codes").update({ status }).eq("id", id);
    } catch {}
  };

  return <QRList generatedQRs={transformedQRs} onDelete={handleDelete} onToggleStatus={handleToggleStatus} />;
};

export default QRHistory;
