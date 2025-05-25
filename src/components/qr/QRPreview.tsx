
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Share2, Download } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

interface QRPreviewProps {
  qrConfig: any;
}

const QRPreview = ({ qrConfig }: QRPreviewProps) => {
  const { toast } = useToast();
  const { profile } = useProfile();
  const [qrImage, setQrImage] = useState<string | null>(null);

  // Create QR code preview
  useEffect(() => {
    // This function simulates generating a QR code based on the config
    const generateQRCode = async () => {
      try {
        // In a real implementation, this would use a QR code library
        // For now, let's use a placeholder that shows different colors based on config
        
        const logoData = qrConfig.logo_enabled && profile?.business_logo
          ? `&logo=${encodeURIComponent(profile.business_logo)}`
          : '';
        
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
          JSON.stringify({
            type: qrConfig.type,
            amount: qrConfig.amount,
            reference: qrConfig.reference,
            description: qrConfig.description,
            gateway_id: qrConfig.gateway_id
          })
        )}&bgcolor=255-255-255&color=${qrConfig.primary_color.replace('#', '')}${logoData}`;
        
        setQrImage(qrUrl);
      } catch (error) {
        console.error("Failed to generate QR code", error);
      }
    };

    if (qrConfig) {
      generateQRCode();
    }
  }, [qrConfig, profile]);

  const handleDownload = async () => {
    try {
      if (!qrImage) return;

      const response = await fetch(qrImage);
      const blob = await response.blob();
      
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `qrcode-${Date.now()}.png`;
      link.click();
      
      toast({
        title: "QR Code Downloaded",
        description: "Your QR code has been downloaded successfully",
      });
    } catch (error) {
      console.error("Download failed", error);
      toast({
        title: "Download Failed",
        description: "Could not download the QR code",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    try {
      if (!qrImage) return;

      // For web share API, we need a file
      const response = await fetch(qrImage);
      const blob = await response.blob();
      const file = new File([blob], 'qrcode.png', { type: 'image/png' });

      if (navigator.share) {
        await navigator.share({
          title: 'NairaQR Payment',
          text: 'Scan to make payment',
          files: [file],
        });
        
        toast({
          title: "Sharing QR Code",
          description: "QR code is being shared",
        });
      } else {
        // Fallback if Web Share API is not available
        const url = URL.createObjectURL(blob);
        window.open(url);
        
        toast({
          title: "QR Code Ready",
          description: "QR code opened in new tab. You can save it from there.",
        });
      }
    } catch (error) {
      console.error("Share failed", error);
      toast({
        title: "Share Failed",
        description: "Could not share the QR code",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardContent className="flex flex-col items-center justify-center pt-6 h-full">
        {qrImage ? (
          <>
            <div className="relative mb-4">
              <img 
                src={qrImage} 
                alt="QR Code" 
                className="w-48 h-48 object-contain"
              />
              
              {qrConfig.type === 'dynamic' && qrConfig.amount && (
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                  ₦{parseFloat(qrConfig.amount).toLocaleString()}
                </div>
              )}
            </div>

            <div className="text-center mb-4">
              <h3 className="font-medium">{profile?.business_name || 'Your Business'}</h3>
              <p className="text-sm text-gray-500">{qrConfig.description || 'Payment QR Code'}</p>
            </div>

            <div className="flex gap-2 w-full mt-auto">
              <Button 
                variant="outline" 
                className="flex-1 gap-2"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button 
                variant="outline"
                className="flex-1 gap-2"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-48">
            <div className="animate-pulse bg-gray-200 w-48 h-48 rounded-lg"></div>
            <p className="mt-4 text-gray-500 text-sm">Generating preview...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QRPreview;
