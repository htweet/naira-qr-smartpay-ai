import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, Camera, CameraOff, Loader2, Search, Zap, History, ArrowRight, CheckCircle, Receipt } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useFlutterwaveNQR } from "@/hooks/useFlutterwaveNQR";
import { useAuth } from "@/contexts/AuthContext";

interface PaymentDetails {
  amount: string;
  description: string;
  merchantName: string;
  gateway: string;
  qrCodeId: string;
  merchantId?: string;
}

const QRScanner = () => {
  const { user } = useAuth();
  const [manualCode, setManualCode] = useState("");
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [recentScans, setRecentScans] = useState<Array<{ code: string; time: Date; merchant: string }>>([]);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<number | null>(null);
  const { createNQRPayment, loading: nqrLoading, qrImage } = useFlutterwaveNQR();

  // Camera scanning
  const startCamera = async () => {
    try {
      setCameraError("");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);

      // Start scanning with BarcodeDetector if available
      if ("BarcodeDetector" in window) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const detector = new (window as any).BarcodeDetector({ formats: ["qr_code"] });
        scanIntervalRef.current = window.setInterval(async () => {
          if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
            try {
              const barcodes = await detector.detect(videoRef.current);
              if (barcodes.length > 0) {
                stopCamera();
                processQRCode(barcodes[0].rawValue);
              }
            } catch {}
          }
        }, 500);
      }
    } catch (err) {
      setCameraError("Camera access denied or not available");
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    if (scanIntervalRef.current) { clearInterval(scanIntervalRef.current); scanIntervalRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    setCameraActive(false);
  };

  useEffect(() => () => stopCamera(), []);

  const processQRCode = async (code: string) => {
    setIsProcessing(true);
    try {
      let details: PaymentDetails | null = null;

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
          let merchantName = "Merchant";
          if (qrData.merchant_id) {
            const { data: merchant } = await supabase
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
        details = {
          amount: "Variable Amount",
          description: "Payment Request",
          merchantName: "Unknown Merchant",
          gateway: "Flutterwave NQR",
          qrCodeId: code,
        };
      }

      setPaymentDetails(details);
      setRecentScans(prev => [{ code, time: new Date(), merchant: details!.merchantName }, ...prev.slice(0, 4)]);
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
      email: user?.email || "customer@payqr.com",
      fullname: user?.user_metadata?.full_name || "PayQR Customer",
      merchant_id: paymentDetails.merchantId,
    });

    if (result) {
      // Create transaction record linking customer to merchant
      if (paymentDetails.merchantId && user) {
        const { data: customer } = await supabase
          .from("customers")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (customer) {
          await supabase.from("transactions").insert({
            merchant_id: paymentDetails.merchantId,
            customer_id: customer.id,
            amount: numericAmount,
            description: paymentDetails.description,
            payment_method: "flutterwave_nqr",
            reference: result.tx_ref || `PAY-${Date.now()}`,
            status: "pending",
          });
        }

        // Update QR code stats
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const client = supabase as any;
        await client.rpc("increment_qr_scan", { qr_id: paymentDetails.qrCodeId }).catch(() => {});
      }

      setPaymentComplete(true);
      toast({ title: "Payment Initiated", description: `NQR payment of ₦${numericAmount.toLocaleString()} created` });
    }
  };

  const resetPayment = () => {
    setPaymentDetails(null);
    setPaymentAmount("");
    setPaymentComplete(false);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="scan" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scan" className="flex items-center gap-2"><QrCode className="h-4 w-4" /> Scan & Pay</TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2"><History className="h-4 w-4" /> Recent</TabsTrigger>
        </TabsList>

        <TabsContent value="scan" className="space-y-4">
          {paymentComplete ? (
            <Card className="border-emerald-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-10 w-10 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold mb-1">Payment Initiated!</h3>
                <p className="text-muted-foreground mb-1">To: {paymentDetails?.merchantName}</p>
                <p className="text-2xl font-bold text-emerald-600 mb-4">
                  {paymentDetails?.amount.includes("Variable") ? `₦${parseInt(paymentAmount).toLocaleString()}` : paymentDetails?.amount}
                </p>
                {qrImage && (
                  <div className="p-4 bg-white rounded-lg shadow mb-4">
                    <img src={`data:image/png;base64,${qrImage}`} alt="NQR" className="w-40 h-40" />
                    <p className="text-xs text-center text-muted-foreground mt-2">Scan with bank app to complete</p>
                  </div>
                )}
                <Button onClick={resetPayment} className="mt-2"><Receipt className="h-4 w-4 mr-2" /> New Payment</Button>
              </CardContent>
            </Card>
          ) : !paymentDetails ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-primary" /> Quick Pay</CardTitle>
                <CardDescription>Scan or enter a QR code to make instant payments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Camera */}
                <div className="relative w-full aspect-video bg-muted rounded-xl overflow-hidden border-2 border-dashed border-muted-foreground/20">
                  {cameraActive ? (
                    <>
                      <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-48 h-48 border-2 border-primary rounded-lg animate-pulse" />
                      </div>
                      <Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={stopCamera}>
                        <CameraOff className="h-4 w-4 mr-1" /> Stop
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-3">
                      <Camera className="h-10 w-10 text-muted-foreground" />
                      <Button onClick={startCamera} variant="outline">
                        <Camera className="h-4 w-4 mr-2" /> Start Camera
                      </Button>
                      {cameraError && <p className="text-xs text-destructive">{cameraError}</p>}
                    </div>
                  )}
                </div>
                <canvas ref={canvasRef} className="hidden" />

                {/* Manual entry */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2"><Search className="h-4 w-4" /> Enter QR Code</Label>
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
                  <p className="text-xs text-muted-foreground">Supports PayQR codes, NQR codes, and direct QR IDs</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-primary/20">
              <CardHeader className="bg-primary/5 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2"><QrCode className="h-5 w-5 text-primary" /> Payment Details</CardTitle>
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
                {paymentDetails.amount.includes("Variable") && (
                  <div className="space-y-2">
                    <Label>Enter Payment Amount (₦)</Label>
                    <Input type="number" placeholder="Enter amount" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} />
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
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors" onClick={() => processQRCode(scan.code)}>
                      <div className="flex items-center gap-3">
                        <QrCode className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{scan.merchant}</p>
                          <p className="text-xs text-muted-foreground font-mono">{scan.code.slice(0, 20)}...</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{scan.time.toLocaleTimeString()}</span>
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
