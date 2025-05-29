
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Save, TestTube, CheckCircle, AlertCircle } from "lucide-react";
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
      // Here you would typically save to your backend/database
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
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Random success/failure for demo
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
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {processor.name}
                      {testResults[processor.id] === 'success' && (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      )}
                      {testResults[processor.id] === 'error' && (
                        <Badge variant="destructive">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Error
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{processor.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => testConnection(processor.id)}
                      disabled={testing[processor.id]}
                    >
                      <TestTube className="h-4 w-4 mr-2" />
                      {testing[processor.id] ? "Testing..." : "Test Connection"}
                    </Button>
                    <Button onClick={() => saveConfiguration(processor.id)}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {processor.fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={`${processor.id}_${field.key}`}>
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    <div className="relative">
                      <Input
                        id={`${processor.id}_${field.key}`}
                        type={
                          field.type === 'password' && !showSecrets[`${processor.id}_${field.key}`]
                            ? 'password'
                            : 'text'
                        }
                        placeholder={field.placeholder}
                        value={configurations[processor.id]?.[field.key] || ''}
                        onChange={(e) => handleConfigChange(processor.id, field.key, e.target.value)}
                        className="pr-10"
                      />
                      {field.type === 'password' && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => toggleSecretVisibility(processor.id, field.key)}
                        >
                          {showSecrets[`${processor.id}_${field.key}`] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Security Note</h4>
                  <p className="text-sm text-blue-800">
                    Your API credentials are encrypted and stored securely. Never share these 
                    credentials or include them in client-side code.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default PaymentProcessorConfig;
