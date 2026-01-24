import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Download, Share2, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface QRPreviewProps {
  qrConfig: {
    type?: string;
    amount?: string | number;
    description?: string;
    gateway_id?: string;
    size?: number;
    primary_color?: string;
    secondary_color?: string;
    logo_enabled?: boolean;
    expiry_enabled?: boolean;
    expiry_hours?: number;
  };
}

const QRPreview = ({ qrConfig }: QRPreviewProps) => {
  const { user } = useAuth();
  const [businessLogo, setBusinessLogo] = useState<string>('');
  const [businessName, setBusinessName] = useState<string>('');

  useEffect(() => {
    if (user) {
      fetchBusinessInfo();
    }
  }, [user]);

  const fetchBusinessInfo = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const client = supabase as any;
      const { data, error } = await client
        .from('merchants')
        .select('business_logo, business_name')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setBusinessLogo(data.business_logo || '');
        setBusinessName(data.business_name || 'Business');
      }
    } catch (error) {
      console.error('Error fetching business info:', error);
    }
  };

  const generateQRCodeURL = () => {
    const baseURL = "https://api.qrserver.com/v1/create-qr-code/";
    const size = `${qrConfig.size || 300}x${qrConfig.size || 300}`;
    const data = qrConfig.type === "dynamic" 
      ? `PayQR:${qrConfig.amount}:${qrConfig.description || 'Payment'}:${qrConfig.gateway_id || 'moniepoint'}:${businessName}`
      : `PayQR:variable:${qrConfig.description || 'Payment'}:${qrConfig.gateway_id || 'moniepoint'}:${businessName}`;
    
    return `${baseURL}?size=${size}&data=${encodeURIComponent(data)}&color=${qrConfig.primary_color?.replace('#', '') || '000000'}&bgcolor=${qrConfig.secondary_color?.replace('#', '') || 'ffffff'}&format=png`;
  };

  const handleDownload = async () => {
    const qrUrl = generateQRCodeURL();
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `qr-code-${businessName}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({ title: "Download Started", description: "QR code image is being downloaded" });
  };

  const handleShare = async () => {
    const qrUrl = generateQRCodeURL();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${businessName} - PayQR Code`,
          text: `Payment QR Code from ${businessName}`,
          url: qrUrl
        });
      } catch {
        console.log('Share aborted');
      }
    } else {
      navigator.clipboard.writeText(qrUrl);
      toast({ title: "Link Copied", description: "QR code link copied to clipboard" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Live Preview
        </CardTitle>
        <CardDescription>See how your QR code will look</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        <div className="relative w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white">
          {qrConfig.amount || qrConfig.description ? (
            <img src={generateQRCodeURL()} alt="QR Code" className="w-full h-full object-contain rounded-lg" />
          ) : (
            <div className="text-center flex flex-col items-center">
              <QrCode className="h-16 w-16 mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">Configure settings to preview</p>
            </div>
          )}
        </div>

        <div className="text-center space-y-2">
          <Badge variant="outline">{qrConfig.type === "dynamic" ? "Fixed Amount" : "Variable Amount"}</Badge>
          {businessName && <p className="font-medium text-lg">{businessName}</p>}
          {qrConfig.amount && <p className="font-medium">₦{parseInt(String(qrConfig.amount) || '0').toLocaleString()}</p>}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" /> Download
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-1" /> Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRPreview;