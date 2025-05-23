
import { useState } from "react";
import { useGatewayConfigs } from "@/hooks/useGatewayConfigs";
import GatewayManager from "@/components/gateway/GatewayManager";

interface GatewayManagerContainerProps {
  merchant: any;
}

const GatewayManagerContainer = ({ merchant }: GatewayManagerContainerProps) => {
  const { configs, loading, toggleGateway, updateGatewaySettings } = useGatewayConfigs();
  const [selectedGateway, setSelectedGateway] = useState("moniepoint");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Transform configs to match expected gateway format
  const gateways = configs.map(config => ({
    id: config.gateway_id,
    name: config.gateway_name,
    status: config.enabled ? "active" : "inactive",
    enabled: config.enabled,
    successRate: 98.5, // Mock data - you can calculate from actual transactions
    avgProcessingTime: config.timeout_seconds / 10,
    transactionFee: 0.75,
    monthlyVolume: 1250000,
    monthlyCount: 847,
    lastTransaction: "2 minutes ago",
    features: getGatewayFeatures(config.gateway_id),
    maxRetries: config.max_retries,
    timeout: config.timeout_seconds,
    priority: config.priority,
    fallbackEnabled: config.fallback_enabled,
    webhookValidation: config.webhook_validation,
    autoReconciliation: config.auto_reconciliation,
    fraudDetection: config.fraud_detection,
    customHeaders: JSON.stringify(config.custom_headers),
    rateLimit: config.rate_limit,
    environment: config.environment,
    performance: generateMockPerformance()
  }));

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

const getGatewayFeatures = (gatewayId: string) => {
  const features = {
    moniepoint: ["Virtual Accounts", "Bank Transfer", "Card Payments", "Customer Verification"],
    opay: ["3DS Card Payment", "E-Wallet", "Bank Debit", "Mobile SDKs"],
    palmpay: ["Zero-fee Transfers", "Business Tools", "POS Integration", "Bulk Payments"]
  };
  return features[gatewayId as keyof typeof features] || [];
};

const generateMockPerformance = () => [
  { date: "Mon", success: 98, volume: 180000 },
  { date: "Tue", success: 99, volume: 195000 },
  { date: "Wed", success: 97, volume: 175000 },
  { date: "Thu", success: 98, volume: 210000 },
  { date: "Fri", success: 99, volume: 225000 },
  { date: "Sat", success: 98, volume: 205000 },
  { date: "Sun", success: 97, volume: 190000 }
];

export default GatewayManagerContainer;
