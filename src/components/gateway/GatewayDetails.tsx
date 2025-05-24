
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, Activity, TrendingUp, Clock, CheckCircle } from "lucide-react";
import GatewaySettings from "@/components/payment/GatewaySettings";

interface GatewayDetailsProps {
  gateway: any;
  onToggleGateway: (gatewayId: string) => void;
  onUpdateSettings: (gatewayId: string, settings: any) => void;
}

const GatewayDetails = ({ gateway, onToggleGateway, onUpdateSettings }: GatewayDetailsProps) => {
  const handleMainToggle = (checked: boolean) => {
    console.log('Gateway details toggle:', gateway.id, checked);
    onToggleGateway(gateway.id);
  };

  const handleFeatureToggle = (feature: string, checked: boolean) => {
    console.log('Feature toggle:', feature, checked);
    onUpdateSettings(gateway.id, { [feature]: checked });
  };

  return (
    <div className="space-y-6">
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
              {gateway.features.map((feature: string, index: number) => (
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
                <p className="font-medium">Gateway Status</p>
                <p className="text-sm text-gray-600">Enable/disable gateway for processing</p>
              </div>
              <Switch 
                checked={gateway.enabled} 
                onCheckedChange={handleMainToggle}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-Retry Failed Payments</p>
                <p className="text-sm text-gray-600">Automatically retry failed transactions</p>
              </div>
              <Switch 
                checked={gateway.fallbackEnabled} 
                onCheckedChange={(checked) => handleFeatureToggle('fallbackEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Webhook Notifications</p>
                <p className="text-sm text-gray-600">Real-time payment status updates</p>
              </div>
              <Switch 
                checked={gateway.webhookValidation} 
                onCheckedChange={(checked) => handleFeatureToggle('webhookValidation', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Priority Routing</p>
                <p className="text-sm text-gray-600">Prefer this gateway for new payments</p>
              </div>
              <Switch 
                checked={gateway.enabled} 
                onCheckedChange={handleMainToggle}
              />
            </div>

            <GatewaySettings 
              gateway={gateway} 
              onUpdate={onUpdateSettings}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GatewayDetails;
