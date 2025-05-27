
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Save, Settings } from "lucide-react";
import { useAdminPanel } from "@/hooks/useAdminPanel";

const AdminSystemSettings = () => {
  const { systemSettings, updateSystemSetting } = useAdminPanel();
  const [localSettings, setLocalSettings] = useState<Record<string, any>>({});

  const handleSettingChange = (key: string, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = (key: string) => {
    const value = localSettings[key];
    if (value !== undefined) {
      updateSystemSetting(key, value);
    }
  };

  const getSettingValue = (setting: any) => {
    const localValue = localSettings[setting.key];
    if (localValue !== undefined) return localValue;
    
    if (typeof setting.value === 'string') {
      try {
        return JSON.parse(setting.value);
      } catch {
        return setting.value;
      }
    }
    return setting.value;
  };

  const groupedSettings = systemSettings.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push(setting);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Configuration
          </CardTitle>
          <CardDescription>
            Manage application-wide settings and configurations
          </CardDescription>
        </CardHeader>
      </Card>

      {Object.entries(groupedSettings).map(([category, settings]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="capitalize">{category} Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.map((setting) => {
              const value = getSettingValue(setting);
              const hasLocalChange = localSettings[setting.key] !== undefined;

              return (
                <div key={setting.key} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Label className="font-medium">{setting.key.replace(/_/g, ' ').toUpperCase()}</Label>
                      {hasLocalChange && <Badge variant="outline">Modified</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{setting.description}</p>
                    
                    {typeof value === 'boolean' ? (
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => handleSettingChange(setting.key, checked)}
                      />
                    ) : (
                      <Input
                        value={value}
                        onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                        className="max-w-md"
                      />
                    )}
                  </div>
                  
                  {hasLocalChange && (
                    <Button onClick={() => handleSave(setting.key)} size="sm">
                      <Save className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminSystemSettings;
