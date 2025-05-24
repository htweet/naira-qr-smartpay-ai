
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { QrCode, Camera, CameraOff, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const QRScanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    amount: '',
    description: '',
    merchantName: '',
    gateway: ''
  });

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
      console.error('Error starting camera:', error);
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const processQRCode = (code: string) => {
    console.log('Processing QR code:', code);
    setQrCode(code);
    
    // Simulate payment details extraction
    setPaymentDetails({
      amount: '₦5,000',
      description: 'Payment Request',
      merchantName: 'Sample Merchant',
      gateway: 'Moniepoint'
    });

    toast({
      title: "QR Code Scanned",
      description: "Payment details loaded successfully",
    });
  };

  const handleManualEntry = () => {
    if (manualCode.trim()) {
      processQRCode(manualCode.trim());
      setManualCode('');
    }
  };

  const handlePayment = () => {
    toast({
      title: "Payment Initiated",
      description: "Redirecting to payment gateway...",
    });
    
    // Here you would integrate with the actual payment gateway
    console.log('Initiating payment with details:', paymentDetails);
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code Scanner
          </CardTitle>
          <CardDescription>
            Scan QR codes to initiate payments or enter codes manually
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Camera Scanner */}
            <div className="space-y-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 bg-gray-100 rounded-lg"
                  style={{ display: isScanning ? 'block' : 'none' }}
                />
                {!isScanning && (
                  <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-500">Camera preview</p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 border-2 border-dashed border-white rounded-lg opacity-50"></div>
              </div>
              
              <div className="flex gap-2">
                {!isScanning ? (
                  <Button onClick={startScanning} className="flex-1">
                    <Camera className="h-4 w-4 mr-2" />
                    Start Scanning
                  </Button>
                ) : (
                  <Button onClick={stopScanning} variant="destructive" className="flex-1">
                    <CameraOff className="h-4 w-4 mr-2" />
                    Stop Scanning
                  </Button>
                )}
              </div>
            </div>

            {/* Manual Entry */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="manual-code">Manual QR Code Entry</Label>
                <Input
                  id="manual-code"
                  placeholder="Enter QR code manually"
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

      {/* Payment Details */}
      {qrCode && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>
              Review the payment information before proceeding
            </CardDescription>
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
            </div>
            
            <div>
              <Label>Merchant</Label>
              <p className="font-medium">{paymentDetails.merchantName}</p>
            </div>
            
            <div>
              <Label>Description</Label>
              <p className="text-gray-600">{paymentDetails.description}</p>
            </div>

            <Button onClick={handlePayment} className="w-full" size="lg">
              Proceed to Payment
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QRScanner;
