
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useGatewayConfig = () => {
  const [loading, setLoading] = useState(false);

  const toggleGateway = async (gatewayId: string, gatewayName: string, currentEnabled: boolean) => {
    console.log('Toggling gateway:', gatewayId);
    
    const newEnabled = !currentEnabled;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { error } = await supabase
        .from('payment_gateway_configs')
        .upsert({
          user_id: user.id,
          gateway_id: gatewayId,
          gateway_name: gatewayName,
          enabled: newEnabled,
        }, {
          onConflict: 'gateway_id,user_id'
        });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      toast({
        title: `${gatewayName} ${newEnabled ? 'Enabled' : 'Disabled'}`,
        description: `Payment gateway has been ${newEnabled ? 'activated' : 'deactivated'} successfully.`,
      });

      return newEnabled;
    } catch (error: any) {
      console.error('Error toggling gateway:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update gateway status. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateGatewaySettings = async (gatewayId: string, gatewayName: string, gatewayEnabled: boolean, settings: any) => {
    console.log('Updating gateway settings:', gatewayId, settings);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { error } = await supabase
        .from('payment_gateway_configs')
        .upsert({
          user_id: user.id,
          gateway_id: gatewayId,
          gateway_name: gatewayName,
          enabled: gatewayEnabled,
          ...settings,
        }, {
          onConflict: 'gateway_id,user_id'
        });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      toast({
        title: "Settings Updated",
        description: "Gateway configuration has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error updating gateway settings:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update gateway settings",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    loading,
    toggleGateway,
    updateGatewaySettings,
  };
};
