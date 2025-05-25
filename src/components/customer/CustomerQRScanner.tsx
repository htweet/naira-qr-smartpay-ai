
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Check, Clock, CreditCard, QrCode, Scan } from "lucide-react";

const CustomerQRScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  const recentTransactions = [
    {
      id: "TXN001",
      merchant: "Lagos Food Market",
      amount: 2500,
      status: "completed",
      date: "2024-01-15",
      qrType: "Dynamic"
    },
    {
      id: "TXN002", 
      merchant: "Tech Solutions Ltd",
      amount: 15000,
      status: "pending",
      date: "2024-01-14",
      qrType: "Static"
    },
    {
      id: "TXN003",
      merchant: "Beauty Salon",
      amount: 5000,
      status: "completed", 
      date: "2024-01-13",
      qrType: "Dynamic"
    }
  ];

  const handleStartScan = () => {
    setIsScanning(true);
    // Simulate scanning delay
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        merchant: "Sample Merchant",
        amount: 1500,
        reference: "PAY123456"
      });
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      completed: "default",
      pending: "secondary",
      failed: "destructive"
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* QR Scanner Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isScanning && !scanResult && (
            <div className="text-center py-8">
              <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <Camera className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Ready to Scan</h3>
              <p className="text-gray-600 mb-4">Point your camera at a QR code to pay</p>
              <Button onClick={handleStartScan} size="lg">
                <Scan className="h-4 w-4 mr-2" />
                Start Scanning
              </Button>
            </div>
          )}

          {isScanning && (
            <div className="text-center py-8">
              <div className="w-32 h-32 mx-auto bg-blue-100 rounded-lg flex items-center justify-center mb-4 animate-pulse">
                <QrCode className="h-16 w-16 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Scanning...</h3>
              <p className="text-gray-600">Position the QR code within the frame</p>
            </div>
          )}

          {scanResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Check className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800">QR Code Detected</h3>
              </div>
              <div className="space-y-2 mb-4">
                <p><strong>Merchant:</strong> {scanResult.merchant}</p>
                <p><strong>Amount:</strong> ₦{scanResult.amount.toLocaleString()}</p>
                <p><strong>Reference:</strong> {scanResult.reference}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay Now
                </Button>
                <Button variant="outline" size="sm" onClick={() => setScanResult(null)}>
                  Scan Another
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <QrCode className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{transaction.merchant}</p>
                    <p className="text-sm text-gray-500">{transaction.date} • {transaction.qrType} QR</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₦{transaction.amount.toLocaleString()}</p>
                  {getStatusBadge(transaction.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerQRScanner;
