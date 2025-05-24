import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, CameraOff, Scan, CreditCard, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface QRScannerProps {
  onPaymentInitiated?: (paymentData: any) => void;
}

const QRScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [processing, setProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (error) {
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access to scan QR codes.",
        variant: "destructive",
      });
    }
  };

  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsScanning(false);
  };

  const simulateQRDetection = () => {
    // Simulate QR code detection for demo purposes
    const mockQRData = {
      merchantId: "MERCHANT_12345",
      merchantName: "Demo Store",
      paymentType: "dynamic",
      amount: 15000,
      currency: "NGN",
      description: "Product Purchase",
      reference: "PAY_" + Date.now(),
      gateway: "moniepoint"
    };
    
    setScannedData(mockQRData);
    setPaymentDialog(true);
    stopScanning();
    
    if (mockQRData.paymentType === "static") {
      // For static QR codes, customer enters amount
      setPaymentAmount("");
    } else {
      // For dynamic QR codes, amount is pre-filled
      setPaymentAmount(mockQRData.amount.toString());
    }
  };

  const processPayment = async () => {
    setProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const paymentResult = {
        ...scannedData,
        amount: parseInt(paymentAmount),
        status: "success",
        transactionId: "TXN_" + Date.now(),
        timestamp: new Date().toISOString()
      };

      onPaymentInitiated?.(paymentResult);
      
      toast({
        title: "Payment Successful",
        description: `₦${parseInt(paymentAmount).toLocaleString()} paid to ${scannedData.merchantName}`,
      });
      
      setPaymentDialog(false);
      setScannedData(null);
      setPaymentAmount("");
      
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Unable to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">QR Code Scanner</h1>
          <p className="text-gray-600">Scan QR codes to make payments instantly</p>
        </div>

        {/* Scanner is immediately visible */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <Camera className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 font-medium">Point camera at QR code</p>
                  <p className="text-sm text-gray-500 mt-2">Camera will automatically detect QR codes</p>
                </div>
              </div>
              
              {/* Scanner overlay */}
              <div className="absolute inset-4 border-2 border-blue-500 rounded-lg">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="h-5 w-5" />
                QR Code Scanner
              </CardTitle>
              <CardDescription>
                Scan merchant QR codes to make instant payments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                {isScanning ? (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-64 bg-black rounded-lg"
                    />
                    <canvas
                      ref={canvasRef}
                      className="absolute top-0 left-0 w-full h-full"
                      style={{ display: 'none' }}
                    />
                    <div className="absolute inset-0 border-2 border-dashed border-white/50 rounded-lg pointer-events-none">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-48 h-48 border-2 border-blue-500 rounded-lg relative">
                          <div className="absolute top-0 left-0 w-6 h-6 border-l-4 border-t-4 border-blue-500"></div>
                          <div className="absolute top-0 right-0 w-6 h-6 border-r-4 border-t-4 border-blue-500"></div>
                          <div className="absolute bottom-0 left-0 w-6 h-6 border-l-4 border-b-4 border-blue-500"></div>
                          <div className="absolute bottom-0 right-0 w-6 h-6 border-r-4 border-b-4 border-blue-500"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Demo button for testing */}
                    <Button
                      onClick={simulateQRDetection}
                      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 hover:bg-green-700"
                    >
                      Simulate QR Detection
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                    <Camera className="h-16 w-16 text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-4">Position QR code within the frame</p>
                    <Button onClick={startScanning} className="flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      Start Camera
                    </Button>
                  </div>
                )}
              </div>

              {isScanning && (
                <div className="flex justify-center">
                  <Button onClick={stopScanning} variant="outline">
                    <CameraOff className="h-4 w-4 mr-2" />
                    Stop Scanning
                  </Button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Secure</span>
                  </div>
                  <p className="text-sm text-gray-600">End-to-end encrypted payments</p>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Scan className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Instant</span>
                  </div>
                  <p className="text-sm text-gray-600">Real-time payment processing</p>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-4 w-4 text-purple-500" />
                    <span className="font-medium">Universal</span>
                  </div>
                  <p className="text-sm text-gray-600">Works with all major banks</p>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Payment Confirmation Dialog */}
          <Dialog open={paymentDialog} onOpenChange={setPaymentDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Payment</DialogTitle>
                <DialogDescription>
                  Review payment details before proceeding
                </DialogDescription>
              </DialogHeader>

              {scannedData && (
                <div className="space-y-4">
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Merchant</span>
                      <span>{scannedData.merchantName}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Description</span>
                      <span>{scannedData.description}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Payment Type</span>
                      <Badge variant={scannedData.paymentType === "dynamic" ? "default" : "secondary"}>
                        {scannedData.paymentType}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Gateway</span>
                      <span className="capitalize">{scannedData.gateway}</span>
                    </div>
                  </Card>

                  <div>
                    <Label htmlFor="paymentAmount">Amount (₦)</Label>
                    <Input
                      id="paymentAmount"
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      disabled={scannedData.paymentType === "dynamic"}
                      placeholder="Enter amount"
                    />
                    {scannedData.paymentType === "dynamic" && (
                      <p className="text-sm text-gray-500 mt-1">Amount is fixed for this QR code</p>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setPaymentDialog(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={processPayment}
                      disabled={!paymentAmount || processing}
                      className="flex-1"
                    >
                      {processing ? (
                        <>
                          <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pay ₦{paymentAmount ? parseInt(paymentAmount).toLocaleString() : '0'}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
