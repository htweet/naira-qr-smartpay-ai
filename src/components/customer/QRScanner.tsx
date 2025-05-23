
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Scan } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const QRScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsScanning(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Mock QR code detection from uploaded image
      setScannedData(`QR-${Math.random().toString(36).substr(2, 9)}`);
      toast({
        title: "QR Code Detected",
        description: "QR code found in uploaded image",
      });
    }
  };

  const mockScanResult = () => {
    // Simulate scanning a QR code
    const mockData = `https://pay.payqr.ng/QR${Math.floor(Math.random() * 100).toString().padStart(3, '0')}`;
    setScannedData(mockData);
    toast({
      title: "QR Code Scanned",
      description: "Payment QR code detected successfully",
    });
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            QR Code Scanner
          </CardTitle>
          <CardDescription>
            Scan QR codes to make payments quickly and securely
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Camera View */}
          <div className="relative w-full max-w-md mx-auto">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
              {isScanning ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Camera preview will appear here</p>
                  </div>
                </div>
              )}
              
              {/* Scanning overlay */}
              {isScanning && (
                <div className="absolute inset-4 border-2 border-blue-500 rounded-lg">
                  <div className="absolute inset-0 border border-blue-300 rounded-lg animate-pulse" />
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              {!isScanning ? (
                <Button onClick={startCamera} className="flex-1">
                  <Camera className="h-4 w-4 mr-2" />
                  Start Camera
                </Button>
              ) : (
                <>
                  <Button onClick={stopCamera} variant="outline" className="flex-1">
                    Stop Camera
                  </Button>
                  <Button onClick={mockScanResult} className="flex-1">
                    <Scan className="h-4 w-4 mr-2" />
                    Scan QR
                  </Button>
                </>
              )}
            </div>

            <div className="text-center">
              <span className="text-sm text-gray-500">or</span>
            </div>

            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="qr-upload"
              />
              <label htmlFor="qr-upload">
                <Button variant="outline" className="w-full" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </span>
                </Button>
              </label>
            </div>
          </div>

          {/* Scanned Result */}
          {scannedData && (
            <Card className="mt-4">
              <CardContent className="pt-4">
                <h4 className="font-semibold mb-2">Scanned QR Code:</h4>
                <p className="text-sm bg-gray-100 p-2 rounded break-all">{scannedData}</p>
                <Button className="w-full mt-3">
                  Proceed to Payment
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How to Scan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">1</div>
              <p>Start the camera and point it at the QR code</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">2</div>
              <p>Ensure the QR code is within the scanning area</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">3</div>
              <p>Wait for automatic detection or tap "Scan QR"</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">4</div>
              <p>Review payment details and proceed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRScanner;
