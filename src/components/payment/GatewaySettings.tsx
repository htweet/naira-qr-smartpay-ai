import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings, Save, RotateCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface GatewaySettingsProps {
  gateway: {
    id: string;
    name: string;
    enabled?: boolean;
    maxRetries?: number;
    timeout?: number;
    priority?: number;
    fallbackEnabled?: boolean;
    webhookValidation?: boolean;
    autoReconciliation?: boolean;
    fraudDetection?: boolean;
    customHeaders?: string;
    rateLimit?: number;
    environment?: string;
  };
  onUpdate: (gatewayId: string, settings: Record<string, unknown>) => void;
}

const GatewaySettings = ({ gateway, onUpdate }: GatewaySettingsProps) => {
  const [settings, setSettings] = useState({
    maxRetries: gateway.maxRetries ?? 3,
    timeout: gateway.timeout ?? 30,
    priority: gateway.priority ?? 1,
    fallbackEnabled: gateway.fallbackEnabled ?? true,
    webhookValidation: gateway.webhookValidation ?? true,
    autoReconciliation: gateway.autoReconciliation ?? false,
    fraudDetection: gateway.fraudDetection ?? true,
    customHeaders: gateway.customHeaders ?? "",
    rateLimit: gateway.rateLimit ?? 1000,
    environment: gateway.environment ?? "live"
  });

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadGatewaySettings();
    }
  }, [isOpen]);

  const loadGatewaySettings = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const client = supabase as any;
      const { data, error } = await client
        .from('payment_gateway_configs')
        .select('*')
        .eq('gateway_id', gateway.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings({
          maxRetries: data.max_retries ?? 3,
          timeout: data.timeout_seconds ?? 30,
          priority: data.priority ?? 1,
          fallbackEnabled: data.fallback_enabled ?? true,
          webhookValidation: data.webhook_validation ?? true,
          autoReconciliation: data.auto_reconciliation ?? false,
          fraudDetection: data.fraud_detection ?? true,
          customHeaders: JSON.stringify(data.custom_headers ?? {}),
          rateLimit: data.rate_limit ?? 1000,
          environment: data.environment ?? "live"
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      let parsedHeaders = {};
      if (settings.customHeaders) {
        try { parsedHeaders = JSON.parse(settings.customHeaders); } catch { throw new Error("Invalid JSON"); }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const client = supabase as any;
      const { error } = await client.from('payment_gateway_configs').upsert({
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

      onUpdate(gateway.id, settings);
      setIsOpen(false);
      toast({ title: "Settings Updated", description: `${gateway.name} configuration saved.` });
    } catch (error: unknown) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to save", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm"><Settings className="h-3 w-3" /></Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{gateway.name} Settings</DialogTitle>
          <DialogDescription>Configure gateway settings</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Connection</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Max Retries</Label>
                  <Input type="number" value={settings.maxRetries} onChange={(e) => setSettings({...settings, maxRetries: parseInt(e.target.value) || 3})} />
                </div>
                <div>
                  <Label>Timeout (s)</Label>
                  <Input type="number" value={settings.timeout} onChange={(e) => setSettings({...settings, timeout: parseInt(e.target.value) || 30})} />
                </div>
              </div>
              <div>
                <Label>Environment</Label>
                <Select value={settings.environment} onValueChange={(v) => setSettings({...settings, environment: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sandbox">Sandbox</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="flex justify-between mb-2"><Label>Priority</Label><Badge variant="outline">{settings.priority}</Badge></div>
              <Slider value={[settings.priority]} onValueChange={(v) => setSettings({...settings, priority: v[0]})} max={10} min={1} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Features</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'fallbackEnabled', label: 'Fallback Routing' },
                { key: 'webhookValidation', label: 'Webhook Validation' },
                { key: 'autoReconciliation', label: 'Auto Reconciliation' },
                { key: 'fraudDetection', label: 'Fraud Detection' }
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <Label>{label}</Label>
                  <Switch checked={settings[key as keyof typeof settings] as boolean} onCheckedChange={(c) => setSettings({...settings, [key]: c})} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setSettings({ maxRetries: 3, timeout: 30, priority: 1, fallbackEnabled: true, webhookValidation: true, autoReconciliation: false, fraudDetection: true, customHeaders: "", rateLimit: 1000, environment: "live" })}>
            <RotateCcw className="h-4 w-4 mr-2" /> Reset
          </Button>
          <Button onClick={handleSaveSettings} disabled={loading}>
            <Save className="h-4 w-4 mr-2" /> {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GatewaySettings;