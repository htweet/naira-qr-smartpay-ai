
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings, Save, RotateCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import GatewayConnectionSettings from "./GatewayConnectionSettings";
import GatewayFeatureSettings from "./GatewayFeatureSettings";
import GatewayPrioritySettings from "./GatewayPrioritySettings";
import GatewayCustomSettings from "./GatewayCustomSettings";

interface GatewaySettingsProps {
  gateway: any;
  onUpdate: (gatewayId: string, settings: any) => void;
}

const GatewaySettings = ({ gateway, onUpdate }: GatewaySettingsProps) => {
  const [settings, setSettings] = useState({
    maxRetries: 3,
    timeout: 30,
    priority: 1,
    fallbackEnabled: true,
    webhookValidation: true,
    autoReconciliation: false,
    fraudDetection: true,
    customHeaders: "",
    rateLimit: 1000,
    environment: "live"
  });

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadGatewaySettings();
    }
  }, [isOpen, gateway.id]);

  const loadGatewaySettings = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_gateway_configs')
        .select('*')
        .eq('gateway_id', gateway.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings({
          maxRetries: data.max_retries || 3,
          timeout: data.timeout_seconds || 30,
          priority: data.priority || 1,
          fallbackEnabled: data.fallback_enabled || true,
          webhookValidation: data.webhook_validation || true,
          autoReconciliation: data.auto_reconciliation || false,
          fraudDetection: data.fraud_detection || true,
          customHeaders: JSON.stringify(data.custom_headers || {}),
          rateLimit: data.rate_limit || 1000,
          environment: data.environment || "live"
        });
      } else {
        // Set defaults from gateway object if available
        setSettings({
          maxRetries: gateway.maxRetries || 3,
          timeout: gateway.timeout || 30,
          priority: gateway.priority || 1,
          fallbackEnabled: gateway.fallbackEnabled || true,
          webhookValidation: gateway.webhookValidation || true,
          autoReconciliation: gateway.autoReconciliation || false,
          fraudDetection: gateway.fraudDetection || true,
          customHeaders: gateway.customHeaders || "",
          rateLimit: gateway.rateLimit || 1000,
          environment: gateway.environment || "live"
        });
      }
    } catch (error) {
      console.error('Error loading gateway settings:', error);
      toast({
        title: "Error",
        description: "Failed to load gateway settings",
        variant: "destructive",
      });
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      let parsedHeaders = {};
      if (settings.customHeaders) {
        try {
          parsedHeaders = JSON.parse(settings.customHeaders);
        } catch (e) {
          throw new Error("Invalid JSON in custom headers");
        }
      }

      const { error } = await supabase
        .from('payment_gateway_configs')
        .upsert({
          gateway_id: gateway.id,
          gateway_name: gateway.name,
          max_retries: settings.maxRetries,
          timeout_seconds: settings.timeout,
          priority: settings.priority,
          fallback_enabled: settings.fallbackEnabled,
          webhook_validation: settings.webhookValidation,
          auto_reconciliation: settings.autoReconciliation,
          fraud_detection: settings.fraudDetection,
          custom_headers: parsedHeaders,
          rate_limit: settings.rateLimit,
          environment: settings.environment,
          enabled: gateway.enabled,
        });

      if (error) throw error;

      onUpdate(gateway.id, {
        maxRetries: settings.maxRetries,
        timeout: settings.timeout,
        priority: settings.priority,
        fallbackEnabled: settings.fallbackEnabled,
        webhookValidation: settings.webhookValidation,
        autoReconciliation: settings.autoReconciliation,
        fraudDetection: settings.fraudDetection,
        customHeaders: settings.customHeaders,
        rateLimit: settings.rateLimit,
        environment: settings.environment,
      });

      setIsOpen(false);
      toast({
        title: "Settings Updated",
        description: `${gateway.name} configuration has been updated successfully.`,
      });
    } catch (error: any) {
      console.error('Error saving gateway settings:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save gateway settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaults = () => {
    setSettings({
      maxRetries: 3,
      timeout: 30,
      priority: 1,
      fallbackEnabled: true,
      webhookValidation: true,
      autoReconciliation: false,
      fraudDetection: true,
      customHeaders: "",
      rateLimit: 1000,
      environment: "live"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {gateway.name} Advanced Settings
          </DialogTitle>
          <DialogDescription>
            Configure advanced settings for {gateway.name} payment gateway
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <GatewayConnectionSettings settings={settings} setSettings={setSettings} />
          <GatewayPrioritySettings settings={settings} setSettings={setSettings} />
          <GatewayFeatureSettings settings={settings} setSettings={setSettings} />
          <GatewayCustomSettings settings={settings} setSettings={setSettings} />
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={resetToDefaults}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSaveSettings} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : "Save Settings"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GatewaySettings;
