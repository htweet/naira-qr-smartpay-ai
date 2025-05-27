
import { useState } from "react";
import { useGatewayData } from "./payment/useGatewayData";
import { useGatewayConfig } from "./payment/useGatewayConfig";

export const usePaymentGateways = () => {
  const { gateways: initialGateways } = useGatewayData();
  const { toggleGateway: toggleGatewayConfig, updateGatewaySettings: updateGatewayConfig } = useGatewayConfig();
  const [gateways, setGateways] = useState(initialGateways);

  const toggleGateway = async (gatewayId: string) => {
    const gateway = gateways.find(g => g.id === gatewayId);
    if (!gateway) return;

    try {
      const newEnabled = await toggleGatewayConfig(gatewayId, gateway.name, gateway.enabled);
      
      setGateways(prevGateways => 
        prevGateways.map(g => 
          g.id === gatewayId ? { ...g, enabled: newEnabled } : g
        )
      );
    } catch (error) {
      // Error handling is done in useGatewayConfig
    }
  };

  const updateGatewaySettings = async (gatewayId: string, settings: any) => {
    const gateway = gateways.find(g => g.id === gatewayId);
    if (!gateway) return;

    try {
      await updateGatewayConfig(gatewayId, gateway.name, gateway.enabled, settings);
      
      setGateways(prevGateways => 
        prevGateways.map(g => 
          g.id === gatewayId ? { ...g, ...settings } : g
        )
      );
    } catch (error) {
      // Error handling is done in useGatewayConfig
    }
  };

  return {
    gateways,
    toggleGateway,
    updateGatewaySettings,
  };
};
