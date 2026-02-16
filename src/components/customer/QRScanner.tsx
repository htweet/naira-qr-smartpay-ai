import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, Camera, CameraOff, Loader2, Search, Zap, History, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useFlutterwaveNQR } from "@/hooks/useFlutterwaveNQR";

interface PaymentDetails {
  amount: string;
  description: string;
  merchantName: string;
  gateway: string;
  qrCodeId: string;
  merchantId?: string;
}

const QRScanner = () => {
  const [qrCode, setQrCode] = useState("");
  const [manualCode, setManualCode] = useState("");
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recentScans, setRecentScans] = useState<Array<{ code: string; time: Date; merchant: string }>>([]);
  const [paymentAmount, setPaymentAmount] = useState("");
  const { createNQRPayment, loading: nqrLoading, qrImage } = useFlutterwaveNQR();

  const processQRCode = async (code: string) => {
    setIsProcessing(true);
    setQrCode(code);
    try {
      let details: PaymentDetails | null = null;

      // Smart QR code detection
      if (code.startsWith("PayQR:") || code.startsWith("QR") || code.match(/^[0-9a-f]{8}-/i)) {
        const qrId = code.includes(":") ? code.split(":")[1] : code;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const client = supabase as any;
        const { data: qrData } = await client
          .from("qr_codes")
          .select("amount, description, gateway_id, qr_code_id, merchant_id")
          .or(`qr_code_id.eq.${qrId},id.eq.${qrId}`)
          .maybeSingle();

        if (qrData) {
          // Fetch merchant info
          let merchantName = "Merchant";
          if (qrData.merchant_id) {
            const { data: merchant } = await client
              .from("merchants")
              .select("business_name")
              .eq("id", qrData.merchant_id)
              .maybeSingle();
            if (merchant) merchantName = merchant.business_name;
          }

          details = {
            amount: qrData.amount ? `₦${qrData.amount.toLocaleString()}` : "Variable Amount",
            description: qrData.description || "Payment Request",
            merchantName,
            gateway: "Flutterwave NQR",
            qrCodeId: qrData.qr_code_id,
            merchantId: qrData.merchant_id,
          };
        }
      }

      if (!details) {
        // Fallback for unrecognized codes
        details = {
          amount: "Variable Amount",
          description: "Payment Request",
          merchantName: "Unknown Merchant",
          gateway: "Flutterwave NQR",
          qrCodeId: code,
        };
      }

      setPaymentDetails(details);
      setRecentScans((prev) => [{ code, time: new Date(), merchant: details!.merchantName }, ...prev.slice(0, 4)]);
      toast({ title: "QR Code Processed", description: `Payment to ${details.merchantName} loaded` });
    } catch (error) {
      console.error("Error processing QR code:", error);
      toast({ title: "Error", description: "Failed to process QR code", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualEntry = () => {
    if (manualCode.trim()) {
      processQRCode(manualCode.trim());
      setManualCode("");
    }
  };

  const handlePayment = async () => {
    if (!paymentDetails) return;
    
    const numericAmount = paymentDetails.amount.includes("Variable")
      ? parseInt(paymentAmount) || 0
      : parseInt(paymentDetails.amount.replace(/[^0-9]/g, "")) || 0;

    if (numericAmount <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid payment amount", variant: "destructive" });
      return;
    }

    const result = await createNQRPayment({
      amount: numericAmount,
      description: paymentDetails.description,
      email: "customer@payqr.com",
      fullname: "PayQR Customer",
    });

    if (result) {
      toast({ title: "Payment Initiated", description: `NQR payment of ₦${numericAmount.toLocaleString()} created` });
    }
  };

  const resetPayment = () => {
    setQrCode("");
    setPaymentDetails(null);
    setPaymentAmount("");
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="scan" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scan" className="flex items-center gap-2">
            <QrCode className="h-4 w-4" /> Scan & Pay
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" /> Recent
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scan" className="space-y-4">
          {!paymentDetails ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" /> Quick Pay
                </CardTitle>
                <CardDescription>Scan or enter a QR code to make instant payments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Camera placeholder */}
                <div className="w-full h-48 bg-muted rounded-xl flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
                  <div className="text-center">
                    <Camera className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground text-sm">Camera scanning available on mobile</p>
                  </div>
                </div>

                {/* Manual entry */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Search className="h-4 w-4" /> Enter QR Code
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="QR1707000001 or PayQR:abc123..."
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleManualEntry()}
                      className="flex-1"
                    />
                    <Button onClick={handleManualEntry} disabled={!manualCode.trim() || isProcessing}>
                      {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Supports PayQR codes, NQR codes, and direct QR IDs
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-primary/20">
              <CardHeader className="bg-primary/5 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5 text-primary" /> Payment Details
                  </CardTitle>
                  <Badge variant="outline" className="bg-primary/10 text-primary">{paymentDetails.gateway}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <Label className="text-xs text-muted-foreground">Merchant</Label>
                    <p className="font-semibold text-lg">{paymentDetails.merchantName}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <Label className="text-xs text-muted-foreground">Amount</Label>
                    <p className="font-bold text-2xl text-primary">{paymentDetails.amount}</p>
                  </div>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <p className="text-sm">{paymentDetails.description}</p>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <Label className="text-xs text-muted-foreground">QR Code ID</Label>
                  <p className="text-sm font-mono">{paymentDetails.qrCodeId}</p>
                </div>

                {paymentDetails.amount.includes("Variable") && (
                  <div className="space-y-2">
                    <Label>Enter Payment Amount (₦)</Label>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                    />
                  </div>
                )}

                {qrImage && (
                  <div className="flex justify-center p-4 bg-white rounded-lg">
                    <img src={`data:image/png;base64,${qrImage}`} alt="NQR Payment QR" className="w-48 h-48" />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button onClick={handlePayment} className="flex-1" size="lg" disabled={nqrLoading}>
                    {nqrLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
                    Pay with NQR
                  </Button>
                  <Button onClick={resetPayment} variant="outline" size="lg">Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><History className="h-5 w-5" /> Recent Scans</CardTitle>
              <CardDescription>Your recently scanned QR codes</CardDescription>
            </CardHeader>
            <CardContent>
              {recentScans.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <QrCode className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>No recent scans</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentScans.map((scan, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => processQRCode(scan.code)}
                    >
                      <div className="flex items-center gap-3">
                        <QrCode className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{scan.merchant}</p>
                          <p className="text-xs text-muted-foreground font-mono">{scan.code.slice(0, 20)}...</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {scan.time.toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QRScanner;
