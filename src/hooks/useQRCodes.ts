
import { useQRCodeData } from './qr/useQRCodeData';
import { useQRCodeOperations } from './qr/useQRCodeOperations';

export type { QRCodeData, QRCodeConfig } from './qr/useQRCodeData';

export const useQRCodes = () => {
  const { qrCodes, loading, setQrCodes, refetch } = useQRCodeData();
  const { createQRCode, updateQRCode, deleteQRCode } = useQRCodeOperations();

  const handleCreateQRCode = async (config: any) => {
    const newQR = await createQRCode(config);
    setQrCodes(prev => [newQR, ...prev]);
    return newQR;
  };

  const handleUpdateQRCode = async (id: string, updates: any) => {
    const updatedQR = await updateQRCode(id, updates);
    setQrCodes(prev => prev.map(qr => qr.id === id ? updatedQR : qr));
    return updatedQR;
  };

  const handleDeleteQRCode = async (id: string) => {
    await deleteQRCode(id);
    setQrCodes(prev => prev.filter(qr => qr.id !== id));
  };

  return {
    qrCodes,
    loading,
    createQRCode: handleCreateQRCode,
    updateQRCode: handleUpdateQRCode,
    deleteQRCode: handleDeleteQRCode,
    refetch,
  };
};
