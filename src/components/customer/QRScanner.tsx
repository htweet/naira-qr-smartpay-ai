import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { QrCode, Camera, CameraOff, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useFlutterwaveNQR } from "@/hooks/useFlutterwaveNQR";

const QRScanner = () => {
  const videoRef = { current: null as HTMLVideoElement | null };
  const [isScanning, setIsScanning] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [manualCode, setManualCode] = useState("");
  const [paymentDetails, setPaymentDetails] = useState({
    amount: "",
    description: "",
    merchantName: "",
    gateway: "",
    qrCodeId: "",
  });
  const { createNQRPayment, loading: nqrLoading, qrImage } = useFlutterwaveNQR();

  const processQRCode = async (code: string) => {
    setQrCode(code);
    try {
      if (code.startsWith("PayQR:") || code.startsWith("QR")) {
        const qrId = code.includes(":") ? code.split(":")[1] : code;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const client = supabase as any;
        const { data: qrData } = await client
          .from("qr_codes")
          .select("amount, description, gateway_id, qr_code_id")
          .or(`qr_code_id.eq.${qrId},id.eq.${qrId}`)
          .maybeSingle();

        if (qrData) {
          setPaymentDetails({
            amount: qrData.amount ? `₦${qrData.amount.toLocaleString()}` : "Variable Amount",
            description: qrData.description || "Payment Request",
            merchantName: "Merchant Business",
            gateway: "Flutterwave NQR",
            qrCodeId: qrData.qr_code_id,
          });
        } else {
          setPaymentDetails({
            amount: "₦5,000",
            description: "Payment Request",
            merchantName: "Sample Merchant",
            gateway: "Flutterwave NQR",
            qrCodeId: code,
          });
        }
      } else {
        setPaymentDetails({
          amount: "Variable Amount",
          description: "Payment Request",
          merchantName: "Sample Merchant",
          gateway: "Flutterwave NQR",
          qrCodeId: code,
        });
      }
      toast({ title: "QR Code Scanned", description: "Payment details loaded successfully" });
    } catch (error) {
      console.error("Error processing QR code:", error);
      toast({ title: "Error", description: "Failed to process QR code", variant: "destructive" });
    }
  };

  const handleManualEntry = () => {
    if (manualCode.trim()) {
      processQRCode(manualCode.trim());
      setManualCode("");
    }
  };

  const handlePayment = async () => {
    const numericAmount = parseInt(paymentDetails.amount.replace(/[^0-9]/g, "")) || 5000;
    const result = await createNQRPayment({
      amount: numericAmount,
      description: paymentDetails.description,
      email: "customer@payqr.com",
      fullname: "PayQR Customer",
    });

    if (result) {
      toast({
        title: "Payment Initiated via Flutterwave NQR",
        description: `NQR payment of ₦${numericAmount.toLocaleString()} created`,
      });
    }
  };

  const resetPayment = () => {
    setQrCode("");
    setPaymentDetails({ amount: "", description: "", merchantName: "", gateway: "", qrCodeId: "" });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code Scanner
          </CardTitle>
          <CardDescription>Scan QR codes to initiate Flutterwave NQR payments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Camera className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-500 mb-2">Camera ready to scan</p>
                  <p className="text-xs text-gray-400">Use manual entry below</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="manual-code">Manual QR Code Entry</Label>
                <Input
                  id="manual-code"
                  placeholder="Enter QR code (e.g. QR1707000001)"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                />
              </div>
              <Button onClick={handleManualEntry} className="w-full">
                Process Code
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {qrCode && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Amount</Label>
                <div className="text-2xl font-bold text-green-600">{paymentDetails.amount}</div>
              </div>
              <div>
                <Label>Gateway</Label>
                <Badge variant="outline">{paymentDetails.gateway}</Badge>
              </div>
              <div>
                <Label>Description</Label>
                <p className="text-sm text-muted-foreground">{paymentDetails.description}</p>
              </div>
              <div>
                <Label>QR Code ID</Label>
                <p className="text-sm font-mono">{paymentDetails.qrCodeId}</p>
              </div>
            </div>

            {qrImage && (
              <div className="flex justify-center">
                <img src={`data:image/png;base64,${qrImage}`} alt="NQR Payment QR" className="w-48 h-48" />
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handlePayment} className="flex-1" size="lg" disabled={nqrLoading}>
                {nqrLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Pay with Flutterwave NQR
              </Button>
              <Button onClick={resetPayment} variant="outline" size="lg">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QRScanner;
