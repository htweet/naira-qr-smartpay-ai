
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, TrendingUp, Clock, DollarSign } from "lucide-react";
import GatewayOverview from "@/components/gateway/GatewayOverview";
import GatewayDetails from "@/components/gateway/GatewayDetails";

interface GatewayManagerProps {
  gateways: any[];
  selectedGateway: string;
  onToggleGateway: (gatewayId: string) => void;
  onSelectGateway: (gatewayId: string) => void;
  onUpdateSettings: (gatewayId: string, settings: any) => void;
}

const GatewayManager = ({
  gateways,
  selectedGateway,
  onToggleGateway,
  onSelectGateway,
  onUpdateSettings
}: GatewayManagerProps) => {
  return (
    <div className="space-y-6">
      <GatewayOverview 
        gateways={gateways}
        onToggleGateway={onToggleGateway}
        onSelectGateway={onSelectGateway}
      />

      <Tabs value={selectedGateway} onValueChange={onSelectGateway}>
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
              onToggleGateway={onToggleGateway}
              onUpdateSettings={onUpdateSettings}
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

export default GatewayManager;
