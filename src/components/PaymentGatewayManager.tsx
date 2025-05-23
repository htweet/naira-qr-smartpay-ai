
import GatewayManagerContainer from "@/components/gateway/GatewayManagerContainer";

interface PaymentGatewayManagerProps {
  merchant: any;
}

const PaymentGatewayManager = ({ merchant }: PaymentGatewayManagerProps) => {
  return <GatewayManagerContainer merchant={merchant} />;
};

export default PaymentGatewayManager;
