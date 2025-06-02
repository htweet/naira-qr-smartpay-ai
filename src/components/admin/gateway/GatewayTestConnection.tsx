
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TestTube, CheckCircle, XCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface GatewayTestConnectionProps {
  apiKey: string;
  secretKey: string;
  testResult: 'success' | 'error' | null;
  onTestResult: (result: 'success' | 'error' | null) => void;
}

const GatewayTestConnection = ({ apiKey, secretKey, testResult, onTestResult }: GatewayTestConnectionProps) => {
  const [testing, setTesting] = useState(false);

  const handleTest = async () => {
    setTesting(true);
    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Random success/failure for demo (in real implementation, you'd test actual API)
      const success = Math.random() > 0.3;
      onTestResult(success ? 'success' : 'error');

      toast({
        title: success ? "Test Successful" : "Test Failed",
        description: success 
          ? "Gateway connection is working correctly."
          : "Failed to connect to gateway. Please check your credentials.",
        variant: success ? "default" : "destructive",
      });
    } catch (error) {
      onTestResult('error');
      toast({
        title: "Test Failed",
        description: "Failed to test gateway connection.",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="flex justify-between items-center">
      <Button
        variant="outline"
        onClick={handleTest}
        disabled={testing || !apiKey || !secretKey}
      >
        {testing ? (
          <>
            <TestTube className="h-4 w-4 mr-2 animate-spin" />
            Testing...
          </>
        ) : (
          <>
            <TestTube className="h-4 w-4 mr-2" />
            Test Connection
          </>
        )}
      </Button>
      
      {testResult === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
      {testResult === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
    </div>
  );
};

export default GatewayTestConnection;
