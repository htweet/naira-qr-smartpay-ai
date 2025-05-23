
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Copy, Download, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface QRListProps {
  generatedQRs: any[];
}

const QRList = ({ generatedQRs }: QRListProps) => {
  const copyQRCode = (qrId: string) => {
    navigator.clipboard.writeText(`https://pay.payqr.ng/${qrId}`);
    toast({
      title: "Link Copied",
      description: "QR code payment link copied to clipboard",
    });
  };

  const downloadQRCode = (qrId: string) => {
    toast({
      title: "Download Started",
      description: `QR code ${qrId} is being downloaded`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated QR Codes</CardTitle>
        <CardDescription>
          Manage and track performance of your QR codes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {generatedQRs.map((qr) => (
            <div key={qr.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                  <QrCode className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{qr.id}</span>
                    <Badge variant={qr.type === "dynamic" ? "default" : "secondary"}>
                      {qr.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{qr.description}</p>
                  <p className="text-xs text-gray-500">Created: {qr.created}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-4 mb-2">
                  <div className="text-center">
                    <p className="text-sm font-medium">{qr.scans}</p>
                    <p className="text-xs text-gray-500">Scans</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{qr.payments}</p>
                    <p className="text-xs text-gray-500">Payments</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">₦{qr.revenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Revenue</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => copyQRCode(qr.id)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => downloadQRCode(qr.id)}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QRList;
