
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Camera, Upload, Zap, Clock, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PaymentProcessor from "./PaymentProcessor";

const QRScanner = () => {
  const [scannedData, setScannedData] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock QR data for demonstration
  const mockQRData = {
    id: 'qr_demo_001',
    qr_code_id: 'DEMO001',
    type: 'static',
    amount: null,
    description: 'Payment for services',
    gateway_id: 'moniepoint',
    business_name: 'Demo Merchant',
    reference: 'REF_DEMO',
    payments: 0,
    revenue: 0,
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    
    try {
      // Simulate QR code scanning
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, we'll use mock data
      setScannedData(mockQRData);
      
      // Update scan count
      await supabase
        .from('qr_codes')
        .update({
          scans: (mockQRData.payments || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('qr_code_id', mockQRData.qr_code_id);

      toast({
        title: "QR Code Scanned!",
        description: "Payment details loaded successfully",
      });
      
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: "Could not read QR code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleProceedToPayment = () => {
    setShowPayment(true);
  };

  const handlePaymentComplete = () => {
    setShowPayment(false);
    setScannedData(null);
    toast({
      title: "Payment Complete!",
      description: "Thank you for your payment",
    });
  };

  const getTypeIcon = (type: string) => {
    return type === 'dynamic' ? <Zap className="h-4 w-4" /> : <Clock className="h-4 w-4" />;
  };

  const getTypeColor = (type: string) => {
    return type === 'dynamic' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  };

  const getGatewayColor = (gatewayId: string) => {
    switch (gatewayId) {
      case 'moniepoint':
        return 'bg-blue-100 text-blue-800';
      case 'opay':
        return 'bg-green-100 text-green-800';
      case 'palmpay':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (showPayment && scannedData) {
    return (
      <div className="space-y-6">
        <Button 
          variant="outline" 
          onClick={() => setShowPayment(false)}
          className="mb-4"
        >
          ← Back to Scanner
        </Button>
        <PaymentProcessor 
          qrData={scannedData} 
          onPaymentComplete={handlePaymentComplete}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Scanner Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload QR Code */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-gray-100">
              <Camera className="h-8 w-8 text-gray-500" />
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileUpload}
              accept="image/*"
            />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Upload QR Code</h3>
            <p className="mt-1 text-sm text-gray-500">Scan a NairaQR code to make a payment</p>
            <div className="mt-4">
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                disabled={isScanning}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                {isScanning ? "Scanning..." : "Upload Image"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scanned Data */}
      {scannedData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Payment Details</span>
              </div>
              
              <div className="flex gap-2">
                <Badge className={getTypeColor(scannedData.type) + " gap-1 flex items-center"}>
                  {getTypeIcon(scannedData.type)}
                  {scannedData.type === 'dynamic' ? 'Fixed Amount' : 'Variable Amount'}
                </Badge>
                
                <Badge className={getGatewayColor(scannedData.gateway_id)}>
                  {scannedData.gateway_id.toUpperCase()}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium text-lg">{scannedData.business_name}</p>
              <p className="text-gray-600 text-sm mt-1">{scannedData.description}</p>
              
              {scannedData.amount && (
                <div className="mt-2 font-bold text-xl">
                  ₦{parseFloat(scannedData.amount).toLocaleString()}
                </div>
              )}
              
              <div className="mt-3 text-sm text-gray-500">
                QR Code ID: {scannedData.qr_code_id}
              </div>
            </div>
            
            <Button onClick={handleProceedToPayment} className="w-full">
              Proceed to Payment
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QRScanner;
