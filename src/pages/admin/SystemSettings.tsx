import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Settings, Shield, Bell, Globe, Zap, Save, Loader2, ToggleLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SettingsData {
  [key: string]: Record<string, unknown>;
}

const SystemSettings = () => {
  const [settings, setSettings] = useState<SettingsData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const client = supabase as any;
      const { data, error } = await client
        .from("system_settings")
        .select("key, value");

      if (error) throw error;

      const settingsMap: SettingsData = {};
      (data || []).forEach((row: { key: string; value: Record<string, unknown> }) => {
        settingsMap[row.key] = row.value;
      });
      setSettings(settingsMap);
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (category: string, key: string, value: unknown) => {
    setSettings((prev) => ({
      ...prev,
      [category]: { ...prev[category], [key]: value },
    }));
  };

  const handleSave = async (category: string) => {
    setSaving(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const client = supabase as any;
      const { error } = await client
        .from("system_settings")
        .update({ value: settings[category], updated_at: new Date().toISOString() })
        .eq("key", category);

      if (error) throw error;

      toast({ title: "Settings Saved", description: `${category} settings updated successfully` });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({ title: "Error", description: "Failed to save settings", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const general = (settings.general || {}) as Record<string, unknown>;
  const security = (settings.security || {}) as Record<string, unknown>;
  const notifications = (settings.notifications || {}) as Record<string, unknown>;
  const features = (settings.features || {}) as Record<string, unknown>;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">System Settings</h1>
        <p className="text-muted-foreground">Configure platform-wide settings with database persistence</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" /> General
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Zap className="h-4 w-4" /> Features
          </TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" /> General Settings</CardTitle>
              <CardDescription>Basic platform configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="font-medium">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">Temporarily disable access for non-admin users</p>
                </div>
                <div className="flex items-center gap-2">
                  {general.maintenance_mode && <Badge variant="destructive">Active</Badge>}
                  <Switch
                    checked={!!general.maintenance_mode}
                    onCheckedChange={(v) => updateSetting("general", "maintenance_mode", v)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Platform Name</Label>
                  <Input
                    value={String(general.platform_name || "")}
                    onChange={(e) => updateSetting("general", "platform_name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Support Email</Label>
                  <Input
                    type="email"
                    value={String(general.support_email || "")}
                    onChange={(e) => updateSetting("general", "support_email", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Session Timeout (minutes)</Label>
                <Input
                  type="number"
                  value={String(general.session_timeout || 30)}
                  onChange={(e) => updateSetting("general", "session_timeout", parseInt(e.target.value) || 30)}
                />
              </div>
              <Button onClick={() => handleSave("general")} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save General Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Security Settings</CardTitle>
              <CardDescription>Configure security and fraud prevention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="font-medium">Auto-approve Transactions</Label>
                  <p className="text-sm text-muted-foreground">Automatically approve below threshold</p>
                </div>
                <Switch
                  checked={!!security.auto_approve_transactions}
                  onCheckedChange={(v) => updateSetting("security", "auto_approve_transactions", v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="font-medium">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Require 2FA for admin operations</p>
                </div>
                <Switch
                  checked={!!security.two_factor_enabled}
                  onCheckedChange={(v) => updateSetting("security", "two_factor_enabled", v)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Max Transaction Limit (₦)</Label>
                  <Input
                    type="number"
                    value={String(security.max_transaction_limit || 1000000)}
                    onChange={(e) => updateSetting("security", "max_transaction_limit", parseInt(e.target.value) || 1000000)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fraud Detection Level</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={String(security.fraud_detection_level || "medium")}
                    onChange={(e) => updateSetting("security", "fraud_detection_level", e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <Button onClick={() => handleSave("security")} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" /> Notification Settings</CardTitle>
              <CardDescription>Configure admin notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { key: "email_notifications", label: "Email Notifications", desc: "Receive important alerts via email" },
                { key: "sms_notifications", label: "SMS Notifications", desc: "Receive urgent alerts via SMS" },
                { key: "admin_alerts", label: "Admin Alerts", desc: "New merchant registrations, disputes, etc." },
                { key: "merchant_alerts", label: "Merchant Alerts", desc: "Send automated alerts to merchants" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="font-medium">{item.label}</Label>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={!!notifications[item.key]}
                    onCheckedChange={(v) => updateSetting("notifications", item.key, v)}
                  />
                </div>
              ))}
              <Button onClick={() => handleSave("notifications")} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features */}
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5" /> Feature Toggles</CardTitle>
              <CardDescription>Enable or disable platform features globally</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { key: "qr_payments", label: "QR Payments", desc: "QR code payment generation and scanning" },
                { key: "invoicing", label: "Invoicing", desc: "Invoice creation and management" },
                { key: "recurring_payments", label: "Recurring Payments", desc: "Scheduled payment subscriptions" },
                { key: "split_payments", label: "Split Payments", desc: "Split payments among recipients" },
                { key: "escrow", label: "Escrow", desc: "Escrow payment protection" },
                { key: "disputes", label: "Disputes", desc: "Dispute filing and resolution" },
                { key: "currency_conversion", label: "Currency Conversion", desc: "Multi-currency support" },
                { key: "ai_analytics", label: "AI Analytics", desc: "AI-powered business insights" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div className="space-y-0.5 flex items-center gap-3">
                    <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <Label className="font-medium">{item.label}</Label>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={features[item.key] ? "default" : "secondary"}>
                      {features[item.key] ? "Enabled" : "Disabled"}
                    </Badge>
                    <Switch
                      checked={!!features[item.key]}
                      onCheckedChange={(v) => updateSetting("features", item.key, v)}
                    />
                  </div>
                </div>
              ))}
              <Button onClick={() => handleSave("features")} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Feature Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettings;
