import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, TrendingUp, Clock, DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import GatewayOverview from "@/components/gateway/GatewayOverview";
import GatewayDetails from "@/components/gateway/GatewayDetails";

interface PaymentGatewayManagerProps {
  merchant: any;
}

const PaymentGatewayManager = ({ merchant }: PaymentGatewayManagerProps) => {
  const [gateways, setGateways] = useState([
    {
      id: "moniepoint",
      name: "Moniepoint (Monnify)",
      status: "active",
      enabled: true,
      successRate: 98.5,
      avgProcessingTime: 2.3,
      transactionFee: 0.75,
      monthlyVolume: 1250000,
      monthlyCount: 847,
      lastTransaction: "2 minutes ago",
      features: ["Virtual Accounts", "Bank Transfer", "Card Payments", "Customer Verification"],
      maxRetries: 3,
      timeout: 30,
      priority: 1,
      fallbackEnabled: true,
      webhookValidation: true,
      autoReconciliation: false,
      fraudDetection: true,
      customHeaders: "",
      rateLimit: 1000,
      environment: "live",
      performance: [
        { date: "Mon", success: 98, volume: 180000 },
        { date: "Tue", success: 99, volume: 195000 },
        { date: "Wed", success: 97, volume: 175000 },
        { date: "Thu", success: 98, volume: 210000 },
        { date: "Fri", success: 99, volume: 225000 },
        { date: "Sat", success: 98, volume: 205000 },
        { date: "Sun", success: 97, volume: 190000 }
      ]
    },
    {
      id: "opay",
      name: "Opay",
      status: "active", 
      enabled: true,
      successRate: 97.8,
      avgProcessingTime: 3.1,
      transactionFee: 0.85,
      monthlyVolume: 980000,
      monthlyCount: 623,
      lastTransaction: "5 minutes ago",
      features: ["3DS Card Payment", "E-Wallet", "Bank Debit", "Mobile SDKs"],
      maxRetries: 2,
      timeout: 25,
      priority: 2,
      fallbackEnabled: true,
      webhookValidation: true,
      autoReconciliation: true,
      fraudDetection: true,
      customHeaders: "",
      rateLimit: 800,
      environment: "live",
      performance: [
        { date: "Mon", success: 96, volume: 140000 },
        { date: "Tue", success: 98, volume: 155000 },
        { date: "Wed", success: 97, volume: 142000 },
        { date: "Thu", success: 99, volume: 165000 },
        { date: "Fri", success: 98, volume: 172000 },
        { date: "Sat", success: 97, volume: 158000 },
        { date: "Sun", success: 98, volume: 148000 }
      ]
    },
    {
      id: "palmpay",
      name: "Palmpay",
      status: "active",
      enabled: false,
      successRate: 96.2,
      avgProcessingTime: 4.2,
      transactionFee: 0.95,
      monthlyVolume: 450000,
      monthlyCount: 298,
      lastTransaction: "1 hour ago",
      features: ["Zero-fee Transfers", "Business Tools", "POS Integration", "Bulk Payments"],
      maxRetries: 4,
      timeout: 35,
      priority: 3,
      fallbackEnabled: false,
      webhookValidation: false,
      autoReconciliation: false,
      fraudDetection: false,
      customHeaders: "",
      rateLimit: 500,
      environment: "sandbox",
      performance: [
        { date: "Mon", success: 95, volume: 65000 },
        { date: "Tue", success: 97, volume: 72000 },
        { date: "Wed", success: 96, volume: 68000 },
        { date: "Thu", success: 97, volume: 75000 },
        { date: "Fri", success: 96, volume: 78000 },
        { date: "Sat", success: 95, volume: 70000 },
        { date: "Sun", success: 96, volume: 67000 }
      ]
    }
  ]);

  const [selectedGateway, setSelectedGateway] = useState("moniepoint");

  const toggleGateway = (gatewayId: string) => {
    setGateways(gateways.map(gateway => {
      if (gateway.id === gatewayId) {
        const newEnabled = !gateway.enabled;
        toast({
          title: `${gateway.name} ${newEnabled ? 'Enabled' : 'Disabled'}`,
          description: `Payment gateway has been ${newEnabled ? 'activated' : 'deactivated'} successfully.`,
        });
        return { ...gateway, enabled: newEnabled };
      }
      return gateway;
    }));
  };

  const updateGatewaySettings = (gatewayId: string, settings: any) => {
    setGateways(gateways.map(gateway => 
      gateway.id === gatewayId 
        ? { ...gateway, ...settings }
        : gateway
    ));
  };

  const activeGateway = gateways.find(g => g.id === selectedGateway);

  return (
    <div className="space-y-6">
      <GatewayOverview 
        gateways={gateways}
        onToggleGateway={toggleGateway}
        onSelectGateway={setSelectedGateway}
      />

      <Tabs value={selectedGateway} onValueChange={setSelectedGateway}>
        <TabsList className="grid w-full grid-cols-3">
          {gateways.map((gateway) => (
            <TabsTrigger key={gateway.id} value={gateway.id}>
              {gateway.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {gateways.map((gateway) => (
          <TabsContent key={gateway.id} value={gateway.id} className="space-y-6">
            <GatewayDetails 
              gateway={gateway}
              onToggleGateway={toggleGateway}
              onUpdateSettings={updateGatewaySettings}
            />
          </TabsContent>
        ))}
      </Tabs>

      {/* Smart Routing Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Smart Payment Routing
          </CardTitle>
          <CardDescription>
            AI-powered routing optimizes success rates by automatically selecting the best gateway
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="font-bold text-2xl">+15.2%</p>
              <p className="text-sm text-gray-600">Success Rate Improvement</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
              <Clock className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="font-bold text-2xl">-1.3s</p>
              <p className="text-sm text-gray-600">Faster Processing</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
              <DollarSign className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="font-bold text-2xl">-8.5%</p>
              <p className="text-sm text-gray-600">Lower Fees</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentGatewayManager;
