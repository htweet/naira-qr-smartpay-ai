
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Download, Share2, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface QRPreviewProps {
  qrConfig: any;
}

const QRPreview = ({ qrConfig }: QRPreviewProps) => {
  const generateQRCodeURL = () => {
    const baseURL = "https://api.qrserver.com/v1/create-qr-code/";
    const size = "300x300";
    const data = qrConfig.type === "dynamic" 
      ? `PayQR:${qrConfig.amount}:${qrConfig.description || 'Payment'}:${qrConfig.gateway_id || 'moniepoint'}`
      : `PayQR:variable:${qrConfig.description || 'Payment'}:${qrConfig.gateway_id || 'moniepoint'}`;
    
    return `${baseURL}?size=${size}&data=${encodeURIComponent(data)}&color=${qrConfig.primary_color?.replace('#', '') || '000000'}&bgcolor=${qrConfig.secondary_color?.replace('#', '') || 'ffffff'}`;
  };

  const handleDownload = () => {
    const qrUrl = generateQRCodeURL();
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `qr-code-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download Started",
      description: "QR code image is being downloaded",
    });
  };

  const handleShare = async () => {
    const qrUrl = generateQRCodeURL();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PayQR Code',
          text: `Payment QR Code - ${qrConfig.description || 'Payment Request'}`,
          url: qrUrl
        });
      } catch (error) {
        console.log('Share was aborted');
      }
    } else {
      // Fallback to copying URL to clipboard
      navigator.clipboard.writeText(qrUrl);
      toast({
        title: "Link Copied",
        description: "QR code link copied to clipboard",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Live Preview
        </CardTitle>
        <CardDescription>
          See how your QR code will look
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        {/* QR Code Preview */}
        <div className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white">
          {qrConfig.amount || qrConfig.description ? (
            <img 
              src={generateQRCodeURL()} 
              alt="QR Code Preview" 
              className="w-full h-full object-contain rounded-lg"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.setAttribute('style', 'display: flex');
              }}
            />
          ) : null}
          <div className="text-center" style={{ display: qrConfig.amount || qrConfig.description ? 'none' : 'flex' }}>
            <div className="flex flex-col items-center">
              <QrCode className="h-16 w-16 mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">Configure settings to preview</p>
            </div>
          </div>
        </div>

        <div className="text-center space-y-2">
          <Badge variant="outline" className="bg-white">
            {qrConfig.type === "dynamic" ? "Fixed Amount" : "Variable Amount"}
          </Badge>
          {qrConfig.amount && (
            <p className="font-medium">₦{parseInt(qrConfig.amount || 0).toLocaleString()}</p>
          )}
          {qrConfig.description && (
            <p className="text-sm text-gray-600">{qrConfig.description}</p>
          )}
          {qrConfig.gateway_id && (
            <Badge variant="secondary">{qrConfig.gateway_id}</Badge>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRPreview;
