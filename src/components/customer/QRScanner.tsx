
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, Scan } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const QRScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      
      setIsScanning(true);
      setHasPermission(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsScanning(false);
  };

  useEffect(() => {
    // Camera is off by default as requested
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
          <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
            {isScanning ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Camera className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Camera is turned off</p>
                  <p className="text-sm text-gray-500">Click "Start Scanner" to begin</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4">
            {!isScanning ? (
              <Button onClick={startCamera} className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Start Scanner
              </Button>
            ) : (
              <Button variant="outline" onClick={stopCamera} className="flex items-center gap-2">
                <CameraOff className="h-4 w-4" />
                Stop Scanner
              </Button>
            )}
          </div>

          {isScanning && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Point your camera at a QR code to scan it
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QRScanner;
