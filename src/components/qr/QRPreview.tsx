
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Download, Share2, Eye } from "lucide-react";

interface QRPreviewProps {
  qrConfig: any;
}

const QRPreview = ({ qrConfig }: QRPreviewProps) => {
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
        {/* QR Code Preview Placeholder */}
        <div 
          className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gradient-to-br"
          style={{
            backgroundImage: `linear-gradient(45deg, ${qrConfig.primaryColor}20, ${qrConfig.secondaryColor}20)`
          }}
        >
          <div className="text-center">
            <QrCode className="h-16 w-16 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-500">QR Code Preview</p>
          </div>
        </div>

        <div className="text-center space-y-2">
          <Badge variant="outline" className="bg-white">
            {qrConfig.type === "dynamic" ? "Fixed Amount" : "Variable Amount"}
          </Badge>
          {qrConfig.amount && (
            <p className="font-medium">₦{parseInt(qrConfig.amount).toLocaleString()}</p>
          )}
          {qrConfig.description && (
            <p className="text-sm text-gray-600">{qrConfig.description}</p>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRPreview;
