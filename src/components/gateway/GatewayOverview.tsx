
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface GatewayOverviewProps {
  gateways: any[];
  onToggleGateway: (gatewayId: string) => void;
  onSelectGateway: (gatewayId: string) => void;
}

const GatewayOverview = ({ gateways, onToggleGateway, onSelectGateway }: GatewayOverviewProps) => {
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

  const handleToggle = async (gateway: any) => {
    try {
      // Update the gateway status in the database
      const { error } = await supabase
        .from('payment_gateway_configs')
        .update({ enabled: !gateway.enabled })
        .eq('id', gateway.id);
      
      if (error) throw error;
      
      // Call the toggle handler to update the UI
      onToggleGateway(gateway.id);
      
      toast({
        title: `Gateway ${!gateway.enabled ? 'Enabled' : 'Disabled'}`,
        description: `${gateway.name} has been ${!gateway.enabled ? 'enabled' : 'disabled'} successfully.`,
      });
    } catch (error) {
      console.error('Failed to update gateway status:', error);
      toast({
        title: "Update Failed",
        description: "Could not update gateway status. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
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
                onCheckedChange={() => handleToggle(gateway)}
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
              onClick={() => onSelectGateway(gateway.id)}
            >
              View Details
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GatewayOverview;
