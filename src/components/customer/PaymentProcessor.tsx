
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Smartphone, Building2, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PaymentProcessorProps {
  qrData: any;
  onPaymentComplete: () => void;
}

const PaymentProcessor = ({ qrData, onPaymentComplete }: PaymentProcessorProps) => {
  const [amount, setAmount] = useState(qrData?.amount || "");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!amount || !customerEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create payment record
      const paymentData = {
        qr_code_id: qrData.id,
        amount: parseFloat(amount),
        customer_email: customerEmail,
        customer_phone: customerPhone,
        gateway_id: qrData.gateway_id,
        status: 'completed',
        reference: `PAY_${Date.now()}`,
        created_at: new Date().toISOString(),
      };

      console.log('Payment processed:', paymentData);

      // Update QR code statistics
      if (qrData.id) {
        await supabase
          .from('qr_codes')
          .update({
            payments: (qrData.payments || 0) + 1,
            revenue: (qrData.revenue || 0) + parseFloat(amount),
            updated_at: new Date().toISOString(),
          })
          .eq('id', qrData.id);
      }

      toast({
        title: "Payment Successful!",
        description: `₦${amount} has been processed successfully`,
      });

      onPaymentComplete();
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getGatewayIcon = (gatewayId: string) => {
    switch (gatewayId) {
      case 'moniepoint':
        return <Building2 className="h-4 w-4" />;
      case 'opay':
        return <Smartphone className="h-4 w-4" />;
      case 'palmpay':
        return <CreditCard className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
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

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          Complete Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Merchant Info */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="font-medium">{qrData?.business_name || 'Merchant'}</p>
          {qrData?.description && (
            <p className="text-sm text-gray-600">{qrData.description}</p>
          )}
        </div>

        {/* Gateway Badge */}
        <div className="flex justify-center">
          <Badge className={`${getGatewayColor(qrData?.gateway_id)} gap-1`}>
            {getGatewayIcon(qrData?.gateway_id)}
            {qrData?.gateway_id?.toUpperCase() || 'PAYMENT GATEWAY'}
          </Badge>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (₦)</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            disabled={qrData?.type === 'dynamic'}
            className="text-lg font-semibold"
          />
          {qrData?.type === 'dynamic' && (
            <p className="text-xs text-gray-500">Amount is fixed for this QR code</p>
          )}
        </div>

        {/* Customer Details */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="08012345678"
            />
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Amount:</span>
            <span className="text-xl font-bold text-blue-600">₦{amount || '0'}</span>
          </div>
        </div>

        <Button 
          onClick={handlePayment} 
          className="w-full" 
          disabled={isProcessing || !amount || !customerEmail}
        >
          {isProcessing ? "Processing..." : `Pay ₦${amount || '0'}`}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentProcessor;
