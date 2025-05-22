
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, 
  Activity, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Settings,
  DollarSign,
  Clock,
  Zap
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

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
    setGateways(gateways.map(gateway => 
      gateway.id === gatewayId 
        ? { ...gateway, enabled: !gateway.enabled }
        : gateway
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      active: "default",
      warning: "secondary",
      error: "destructive"
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const activeGateway = gateways.find(g => g.id === selectedGateway);

  return (
    <div className="space-y-6">
      {/* Gateway Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {gateways.map((gateway) => (
          <Card key={gateway.id} className={`transition-all ${gateway.enabled ? 'bg-gradient-to-br from-green-50 to-blue-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(gateway.status)}
                  <CardTitle className="text-lg">{gateway.name}</CardTitle>
                </div>
                <Switch
                  checked={gateway.enabled}
                  onCheckedChange={() => toggleGateway(gateway.id)}
                />
              </div>
              {getStatusBadge(gateway.status)}
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Success Rate</p>
                  <p className="font-bold text-green-600">{gateway.successRate}%</p>
                </div>
                <div>
                  <p className="text-gray-600">Avg. Time</p>
                  <p className="font-bold">{gateway.avgProcessingTime}s</p>
                </div>
                <div>
                  <p className="text-gray-600">Fee Rate</p>
                  <p className="font-bold">{gateway.transactionFee}%</p>
                </div>
                <div>
                  <p className="text-gray-600">This Month</p>
                  <p className="font-bold">₦{(gateway.monthlyVolume / 1000).toFixed(0)}K</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => setSelectedGateway(gateway.id)}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

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
            {/* Detailed Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Monthly Volume</span>
                  </div>
                  <p className="text-2xl font-bold">₦{gateway.monthlyVolume.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+12.5% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Transactions</span>
                  </div>
                  <p className="text-2xl font-bold">{gateway.monthlyCount}</p>
                  <p className="text-sm text-blue-600">+8.2% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                    <span className="text-sm text-gray-600">Success Rate</span>
                  </div>
                  <p className="text-2xl font-bold">{gateway.successRate}%</p>
                  <Progress value={gateway.successRate} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-gray-600">Avg. Processing</span>
                  </div>
                  <p className="text-2xl font-bold">{gateway.avgProcessingTime}s</p>
                  <p className="text-sm text-orange-600">-0.2s improvement</p>
                </CardContent>
              </Card>
            </div>

            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>7-Day Performance Trend</CardTitle>
                <CardDescription>Success rate and transaction volume</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={gateway.performance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" domain={[90, 100]} />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line 
                      yAxisId="left" 
                      type="monotone" 
                      dataKey="success" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      name="Success Rate (%)"
                    />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="volume" 
                      stroke="#82ca9d" 
                      strokeWidth={2}
                      name="Volume (₦)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle>Features & Capabilities</CardTitle>
                  <CardDescription>Available payment methods and features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {gateway.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Gateway Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Gateway Configuration</CardTitle>
                  <CardDescription>Manage settings and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-Retry Failed Payments</p>
                      <p className="text-sm text-gray-600">Automatically retry failed transactions</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Webhook Notifications</p>
                      <p className="text-sm text-gray-600">Real-time payment status updates</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Priority Routing</p>
                      <p className="text-sm text-gray-600">Prefer this gateway for new payments</p>
                    </div>
                    <Switch checked={gateway.enabled} />
                  </div>

                  <Button className="w-full" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Advanced Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
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
