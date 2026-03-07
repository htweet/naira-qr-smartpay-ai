import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { QrCode, Copy, Download, Settings, Eye, Trash2, ToggleLeft, ToggleRight, Palette } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface QRItem {
  id: string;
  type: string;
  description: string;
  created: string;
  scans: number;
  payments: number;
  revenue: number;
  amount?: number;
  primary_color?: string;
  secondary_color?: string;
  pattern?: string;
  eye_style?: string;
  status?: string;
  qr_code_id?: string;
}

interface QRListProps {
  generatedQRs: QRItem[];
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string, status: string) => void;
}

const QRList = ({ generatedQRs = [], onDelete, onToggleStatus }: QRListProps) => {
  const [selectedQR, setSelectedQR] = useState<QRItem | null>(null);

  const copyQRCode = (qrId: string) => {
    navigator.clipboard.writeText(`https://pay.payqr.ng/${qrId}`);
    toast({ title: "Link Copied", description: "QR code payment link copied to clipboard" });
  };

  const downloadQRCode = (qrId: string) => {
    toast({ title: "Download Started", description: `QR code ${qrId} is being downloaded` });
  };

  return (
    <>
      {/* Detail Dialog */}
      <Dialog open={!!selectedQR} onOpenChange={(o) => !o && setSelectedQR(null)}>
        <DialogContent className="max-w-lg">
          {selectedQR && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5 text-primary" />
                    {selectedQR.qr_code_id || selectedQR.id}
                  </DialogTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={selectedQR.type === "dynamic" ? "default" : "secondary"}>{selectedQR.type}</Badge>
                    <Badge variant={selectedQR.status === "active" ? "default" : "destructive"}>{selectedQR.status || "active"}</Badge>
                  </div>
                </div>
                <DialogDescription>Created {selectedQR.created}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {/* QR Preview */}
                <div className="flex justify-center p-6 rounded-lg" style={{ background: `linear-gradient(135deg, ${selectedQR.primary_color || "#000"}15, ${selectedQR.secondary_color || "#fff"}15)` }}>
                  <div className="w-32 h-32 rounded-xl flex items-center justify-center border-2" style={{ borderColor: selectedQR.primary_color || "#000" }}>
                    <QrCode className="h-16 w-16" style={{ color: selectedQR.primary_color || "#000" }} />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-muted/50 rounded-lg text-center">
                    <p className="text-2xl font-bold">{selectedQR.scans}</p>
                    <p className="text-xs text-muted-foreground">Scans</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg text-center">
                    <p className="text-2xl font-bold">{selectedQR.payments}</p>
                    <p className="text-xs text-muted-foreground">Payments</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg text-center">
                    <p className="text-2xl font-bold">₦{selectedQR.revenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2">
                  {selectedQR.amount && (
                    <div className="flex justify-between p-2 rounded bg-muted/30">
                      <span className="text-sm text-muted-foreground">Amount</span>
                      <span className="text-sm font-medium">₦{selectedQR.amount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between p-2 rounded bg-muted/30">
                    <span className="text-sm text-muted-foreground">Description</span>
                    <span className="text-sm font-medium">{selectedQR.description}</span>
                  </div>
                  {selectedQR.pattern && (
                    <div className="flex justify-between p-2 rounded bg-muted/30">
                      <span className="text-sm text-muted-foreground flex items-center gap-1"><Palette className="h-3 w-3" /> Pattern</span>
                      <span className="text-sm font-medium capitalize">{selectedQR.pattern}</span>
                    </div>
                  )}
                  {selectedQR.primary_color && (
                    <div className="flex justify-between p-2 rounded bg-muted/30 items-center">
                      <span className="text-sm text-muted-foreground">Colors</span>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded border" style={{ background: selectedQR.primary_color }} />
                        <div className="w-5 h-5 rounded border" style={{ background: selectedQR.secondary_color || "#fff" }} />
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Actions */}
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" size="sm" onClick={() => copyQRCode(selectedQR.qr_code_id || selectedQR.id)}>
                    <Copy className="h-4 w-4 mr-1" /> Copy Link
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => downloadQRCode(selectedQR.qr_code_id || selectedQR.id)}>
                    <Download className="h-4 w-4 mr-1" /> Download
                  </Button>
                  {onToggleStatus && (
                    <Button variant="outline" size="sm" onClick={() => {
                      onToggleStatus(selectedQR.id, selectedQR.status === "active" ? "inactive" : "active");
                      setSelectedQR(null);
                    }}>
                      {selectedQR.status === "active" ? <ToggleLeft className="h-4 w-4 mr-1" /> : <ToggleRight className="h-4 w-4 mr-1" />}
                      {selectedQR.status === "active" ? "Deactivate" : "Activate"}
                    </Button>
                  )}
                  {onDelete && (
                    <Button variant="destructive" size="sm" onClick={() => { onDelete(selectedQR.id); setSelectedQR(null); }}>
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Generated QR Codes</CardTitle>
          <CardDescription>Click any QR code for details and management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {generatedQRs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <QrCode className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>No QR codes generated yet</p>
                <p className="text-sm">Create your first QR code above</p>
              </div>
            ) : (
              generatedQRs.map((qr) => (
                <div key={qr.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setSelectedQR(qr)}>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${qr.primary_color || "#3b82f6"}20, ${qr.secondary_color || "#8b5cf6"}20)` }}>
                      <QrCode className="h-7 w-7" style={{ color: qr.primary_color || "#3b82f6" }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{qr.qr_code_id || qr.id}</span>
                        <Badge variant={qr.type === "dynamic" ? "default" : "secondary"} className="text-xs">{qr.type}</Badge>
                        {qr.status && qr.status !== "active" && <Badge variant="destructive" className="text-xs">{qr.status}</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{qr.description}</p>
                      <p className="text-xs text-muted-foreground">Created: {qr.created}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="text-center"><p className="text-sm font-medium">{qr.scans || 0}</p><p className="text-xs text-muted-foreground">Scans</p></div>
                      <div className="text-center"><p className="text-sm font-medium">{qr.payments || 0}</p><p className="text-xs text-muted-foreground">Payments</p></div>
                      <div className="text-center"><p className="text-sm font-medium">₦{(qr.revenue || 0).toLocaleString()}</p><p className="text-xs text-muted-foreground">Revenue</p></div>
                    </div>
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button variant="outline" size="sm" onClick={() => copyQRCode(qr.qr_code_id || qr.id)}><Copy className="h-3 w-3" /></Button>
                      <Button variant="outline" size="sm" onClick={() => downloadQRCode(qr.qr_code_id || qr.id)}><Download className="h-3 w-3" /></Button>
                      <Button variant="outline" size="sm" onClick={() => setSelectedQR(qr)}><Eye className="h-3 w-3" /></Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default QRList;
