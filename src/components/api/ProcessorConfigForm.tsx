
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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

interface ProcessorConfigFormProps {
  processor: PaymentProcessor;
  configuration: any;
  showSecrets: Record<string, boolean>;
  testing: boolean;
  testResult: 'success' | 'error' | null;
  onConfigChange: (field: string, value: string) => void;
  onToggleSecret: (field: string) => void;
  onSave: () => void;
  onTest: () => void;
}

const ProcessorConfigForm = ({
  processor,
  configuration,
  showSecrets,
  testing,
  testResult,
  onConfigChange,
  onToggleSecret,
  onSave,
  onTest
}: ProcessorConfigFormProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {processor.name}
              {testResult === 'success' && (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              )}
              {testResult === 'error' && (
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
              onClick={onTest}
              disabled={testing}
            >
              <TestTube className="h-4 w-4 mr-2" />
              {testing ? "Testing..." : "Test Connection"}
            </Button>
            <Button onClick={onSave}>
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
                value={configuration?.[field.key] || ''}
                onChange={(e) => onConfigChange(field.key, e.target.value)}
                className="pr-10"
              />
              {field.type === 'password' && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => onToggleSecret(field.key)}
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
  );
};

export default ProcessorConfigForm;
