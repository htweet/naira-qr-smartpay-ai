
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { QrCode, Camera, CameraOff, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const QRScanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false); // Changed to false by default
  const [qrCode, setQrCode] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    amount: '',
    description: '',
    merchantName: '',
    gateway: '',
    qrCodeId: ''
  });

  // Removed auto-start scanning
  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
        toast({
          title: "Camera Started",
          description: "Point your camera at a QR code to scan",
        });
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

  const processQRCode = async (code: string) => {
    console.log('Processing QR code:', code);
    setQrCode(code);
    
    try {
      // Try to fetch QR code details from database
      if (code.startsWith('PayQR:') || code.startsWith('QR')) {
        const qrId = code.includes(':') ? code.split(':')[1] : code;
        
        const { data: qrData, error } = await supabase
          .from('qr_codes')
          .select('*')
          .or(`qr_code_id.eq.${qrId},id.eq.${qrId}`)
          .single();

        if (qrData && !error) {
          setPaymentDetails({
            amount: qrData.amount ? `₦${qrData.amount.toLocaleString()}` : 'Variable Amount',
            description: qrData.description || 'Payment Request',
            merchantName: 'Merchant Business',
            gateway: qrData.gateway_id || 'Moniepoint',
            qrCodeId: qrData.qr_code_id
          });
        } else {
          // Fallback to simulated data
          setPaymentDetails({
            amount: '₦5,000',
            description: 'Payment Request',
            merchantName: 'Sample Merchant',
            gateway: 'Moniepoint',
            qrCodeId: code
          });
        }
      } else {
        // Handle other QR code formats
        setPaymentDetails({
          amount: 'Variable Amount',
          description: 'Payment Request',
          merchantName: 'Sample Merchant',
          gateway: 'Moniepoint',
          qrCodeId: code
        });
      }

      toast({
        title: "QR Code Scanned",
        description: "Payment details loaded successfully",
      });
    } catch (error) {
      console.error('Error processing QR code:', error);
      toast({
        title: "Error",
        description: "Failed to process QR code",
        variant: "destructive",
      });
    }
  };

  const handleManualEntry = () => {
    if (manualCode.trim()) {
      processQRCode(manualCode.trim());
      setManualCode('');
    }
  };

  const handlePayment = async () => {
    try {
      // Store payment attempt in database
      const { error } = await supabase
        .from('conversion_events')
        .insert({
          event_type: 'payment_initiated',
          value: parseFloat(paymentDetails.amount.replace(/[₦,]/g, '')) || 0,
          source: 'qr_scanner',
          metadata: {
            qr_code_id: paymentDetails.qrCodeId,
            gateway: paymentDetails.gateway,
            description: paymentDetails.description
          }
        });

      if (error) {
        console.error('Error logging payment:', error);
      }

      toast({
        title: "Payment Initiated",
        description: "Redirecting to payment gateway...",
      });
      
      // Simulate payment processing
      setTimeout(() => {
        toast({
          title: "Payment Successful",
          description: `Payment of ${paymentDetails.amount} processed successfully`,
        });
        
        // Reset the form
        setQrCode('');
        setPaymentDetails({
          amount: '',
          description: '',
          merchantName: '',
          gateway: '',
          qrCodeId: ''
        });
      }, 2000);
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Payment Failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

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
                      <p className="text-gray-500 mb-2">Camera ready to scan</p>
                      <p className="text-xs text-gray-400">Click "Start Scanning" to begin</p>
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
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Tip:</strong> You can also paste QR code data directly here if you have it copied.
                </p>
              </div>
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
