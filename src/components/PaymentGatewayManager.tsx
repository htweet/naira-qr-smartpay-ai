
import { useState } from "react";
import GatewayManager from "@/components/gateway/GatewayManager";
import { usePaymentGateways } from "@/hooks/usePaymentGateways";

interface PaymentGatewayManagerProps {
  merchant: any;
}

const PaymentGatewayManager = ({ merchant }: PaymentGatewayManagerProps) => {
  const { gateways, toggleGateway, updateGatewaySettings } = usePaymentGateways();
  const [selectedGateway, setSelectedGateway] = useState("moniepoint");

  return (
    <GatewayManager
      gateways={gateways}
      selectedGateway={selectedGateway}
      onToggleGateway={toggleGateway}
      onSelectGateway={setSelectedGateway}
      onUpdateSettings={updateGatewaySettings}
    />
  );
};

export default PaymentGatewayManager;
