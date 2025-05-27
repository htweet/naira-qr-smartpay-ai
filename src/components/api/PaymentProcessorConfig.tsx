import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProcessorConfigForm from "./ProcessorConfigForm";
import { toast } from "@/hooks/use-toast";

interface PaymentProcessor {
  id: string;
  name: string;
  description: string;
  fields: {
    key: string;
    label: string;
    type: string;
    required: boolean;
    placeholder: string;
  }[];
  testEndpoint?: string;
}

const PaymentProcessorConfig = () => {
  const [processors] = useState<PaymentProcessor[]>([
    {
      id: "moniepoint",
      name: "Moniepoint (Monnify)",
      description: "Nigeria's leading payment gateway with virtual accounts and instant settlements",
      fields: [
        { key: "api_key", label: "API Key", type: "password", required: true, placeholder: "mk_live_..." },
        { key: "secret_key", label: "Secret Key", type: "password", required: true, placeholder: "sk_live_..." },
        { key: "contract_code", label: "Contract Code", type: "text", required: true, placeholder: "123456789" },
        { key: "webhook_url", label: "Webhook URL", type: "url", required: false, placeholder: "https://yoursite.com/webhook" }
      ],
      testEndpoint: "/api/moniepoint/test"
    },
    {
      id: "opay",
      name: "Opay",
      description: "Fast and secure payment processing with mobile wallet integration",
      fields: [
        { key: "merchant_id", label: "Merchant ID", type: "text", required: true, placeholder: "256612345678901" },
        { key: "public_key", label: "Public Key", type: "password", required: true, placeholder: "OPAYPUB..." },
        { key: "private_key", label: "Private Key", type: "password", required: true, placeholder: "OPAYPRV..." },
        { key: "passphrase", label: "Passphrase", type: "password", required: true, placeholder: "your_passphrase" }
      ],
      testEndpoint: "/api/opay/test"
    },
    {
      id: "palmpay",
      name: "Palmpay",
      description: "Zero-fee transfers with comprehensive business tools",
      fields: [
        { key: "app_id", label: "App ID", type: "text", required: true, placeholder: "your_app_id" },
        { key: "app_secret", label: "App Secret", type: "password", required: true, placeholder: "your_app_secret" },
        { key: "merchant_code", label: "Merchant Code", type: "text", required: true, placeholder: "PP123456" },
        { key: "callback_url", label: "Callback URL", type: "url", required: false, placeholder: "https://yoursite.com/callback" }
      ],
      testEndpoint: "/api/palmpay/test"
    }
  ]);

  const [configurations, setConfigurations] = useState<Record<string, any>>({});
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [testing, setTesting] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, 'success' | 'error' | null>>({});

  const handleConfigChange = (processorId: string, field: string, value: string) => {
    setConfigurations(prev => ({
      ...prev,
      [processorId]: {
        ...prev[processorId],
        [field]: value
      }
    }));
  };

  const toggleSecretVisibility = (processorId: string, field: string) => {
    const key = `${processorId}_${field}`;
    setShowSecrets(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const saveConfiguration = async (processorId: string) => {
    try {
      toast({
        title: "Configuration Saved",
        description: `${processors.find(p => p.id === processorId)?.name} configuration has been saved successfully.`,
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save configuration. Please try again.",
        variant: "destructive",
      });
    }
  };

  const testConnection = async (processorId: string) => {
    setTesting(prev => ({ ...prev, [processorId]: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const success = Math.random() > 0.3;
      
      setTestResults(prev => ({
        ...prev,
        [processorId]: success ? 'success' : 'error'
      }));

      toast({
        title: success ? "Connection Successful" : "Connection Failed",
        description: success 
          ? "API credentials are valid and connection is working."
          : "Invalid credentials or connection error. Please check your settings.",
        variant: success ? "default" : "destructive",
      });
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [processorId]: 'error'
      }));
    } finally {
      setTesting(prev => ({ ...prev, [processorId]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Payment Processor Configuration</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Configure your payment processors to enable real-time QR code payments. 
          Secure your API keys and test connections before going live.
        </p>
      </div>

      <Tabs defaultValue="moniepoint" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          {processors.map((processor) => (
            <TabsTrigger key={processor.id} value={processor.id}>
              {processor.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {processors.map((processor) => (
          <TabsContent key={processor.id} value={processor.id}>
            <ProcessorConfigForm
              processor={processor}
              configuration={configurations[processor.id]}
              showSecrets={showSecrets}
              testing={testing[processor.id] || false}
              testResult={testResults[processor.id] || null}
              onConfigChange={(field, value) => handleConfigChange(processor.id, field, value)}
              onToggleSecret={(field) => toggleSecretVisibility(processor.id, field)}
              onSave={() => saveConfiguration(processor.id)}
              onTest={() => testConnection(processor.id)}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default PaymentProcessorConfig;
