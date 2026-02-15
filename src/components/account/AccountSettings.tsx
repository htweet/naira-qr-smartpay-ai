import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Building, Upload, Save, User, Bell, MapPin, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const AccountSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    avatar_url: '',
    address: '',
    notification_preferences: {
      email_payments: true,
      email_disputes: true,
      email_invoices: true,
    },
  });
  const [merchant, setMerchant] = useState({
    business_name: '',
    business_logo: '',
    business_phone: '',
    business_address: '',
    business_email: '',
    website: '',
    description: '',
  });
  const [isMerchant, setIsMerchant] = useState(false);

  useEffect(() => {
    if (user) fetchProfileAndMerchant();
  }, [user]);

  const fetchProfileAndMerchant = async () => {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (profileData) {
        const notifPrefs = typeof profileData.notification_preferences === 'object' && profileData.notification_preferences
          ? profileData.notification_preferences as Record<string, boolean>
          : { email_payments: true, email_disputes: true, email_invoices: true };
        setProfile({
          full_name: profileData.full_name || '',
          phone: profileData.phone || '',
          avatar_url: profileData.avatar_url || '',
          address: (profileData as any).address || '',
          notification_preferences: {
            email_payments: notifPrefs.email_payments !== false,
            email_disputes: notifPrefs.email_disputes !== false,
            email_invoices: notifPrefs.email_invoices !== false,
          },
        });
      }

      const { data: merchantData, error: merchantError } = await supabase
        .from('merchants')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (merchantError && merchantError.code !== 'PGRST116') throw merchantError;

      if (merchantData) {
        setIsMerchant(true);
        setMerchant({
          business_name: merchantData.business_name || '',
          business_logo: merchantData.business_logo || '',
          business_phone: merchantData.business_phone || '',
          business_address: merchantData.business_address || '',
          business_email: merchantData.business_email || '',
          website: merchantData.website || '',
          description: merchantData.description || '',
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 5MB", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('business-assets').upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('business-assets').getPublicUrl(filePath);
      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
      toast({ title: "Avatar uploaded", description: "Your profile photo has been updated" });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 5MB", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/logo.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('business-assets').upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('business-assets').getPublicUrl(filePath);
      setMerchant(prev => ({ ...prev, business_logo: publicUrl }));
      toast({ title: "Logo uploaded" });
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: existingProfile } = await supabase.from('profiles').select('id').eq('user_id', user.id).maybeSingle();
      const profilePayload = {
        full_name: profile.full_name,
        phone: profile.phone,
        avatar_url: profile.avatar_url,
        address: profile.address,
        notification_preferences: profile.notification_preferences,
      };

      if (existingProfile) {
        const { error } = await supabase.from('profiles').update(profilePayload).eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('profiles').insert({ user_id: user.id, ...profilePayload });
        if (error) throw error;
      }

      if (isMerchant || merchant.business_name) {
        const { error: merchantError } = await supabase.from('merchants').upsert({
          user_id: user.id,
          business_name: merchant.business_name || 'My Business',
          business_logo: merchant.business_logo,
          business_phone: merchant.business_phone,
          business_address: merchant.business_address,
          business_email: merchant.business_email,
          website: merchant.website,
          description: merchant.description,
        });
        if (merchantError) throw merchantError;
        setIsMerchant(true);
      }

      toast({ title: "Settings saved", description: "Your account settings have been updated" });
    } catch (error) {
      console.error('Error saving:', error);
      toast({ title: "Save failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Account Settings</h2>
        <p className="text-muted-foreground">Manage your profile, business, and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />Personal Profile</CardTitle>
            <CardDescription>Your personal information and avatar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className="text-xl">{profile.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="avatar-upload" className="cursor-pointer">
                  <div className="inline-flex items-center gap-2 px-3 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors text-sm">
                    <Upload className="h-4 w-4" />{profile.avatar_url ? 'Change Photo' : 'Upload Photo'}
                  </div>
                </Label>
                <Input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" disabled={loading} />
                <p className="text-xs text-muted-foreground mt-1">Max 5MB, JPG or PNG</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Full Name</Label>
                <Input value={profile.full_name} onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))} placeholder="Your full name" />
              </div>
              <div className="space-y-1">
                <Label>Phone</Label>
                <Input value={profile.phone} onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))} placeholder="Phone number" />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input value={user?.email || ''} disabled className="bg-muted" />
            </div>
            <div className="space-y-1">
              <Label className="flex items-center gap-1"><MapPin className="h-3 w-3" />Address</Label>
              <Textarea value={profile.address} onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))} placeholder="Your address" rows={2} className="resize-none" />
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" />Notifications</CardTitle>
            <CardDescription>Control what notifications you receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium text-sm">Payment Notifications</p>
                <p className="text-xs text-muted-foreground">Get notified about successful payments and refunds</p>
              </div>
              <Switch checked={profile.notification_preferences.email_payments} onCheckedChange={(checked) => setProfile(prev => ({ ...prev, notification_preferences: { ...prev.notification_preferences, email_payments: checked } }))} />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium text-sm">Dispute Alerts</p>
                <p className="text-xs text-muted-foreground">Get notified about new disputes and resolutions</p>
              </div>
              <Switch checked={profile.notification_preferences.email_disputes} onCheckedChange={(checked) => setProfile(prev => ({ ...prev, notification_preferences: { ...prev.notification_preferences, email_disputes: checked } }))} />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium text-sm">Invoice Updates</p>
                <p className="text-xs text-muted-foreground">Get notified when invoices are paid or overdue</p>
              </div>
              <Switch checked={profile.notification_preferences.email_invoices} onCheckedChange={(checked) => setProfile(prev => ({ ...prev, notification_preferences: { ...prev.notification_preferences, email_invoices: checked } }))} />
            </div>

            <Separator />

            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium flex items-center gap-2"><Shield className="h-4 w-4" />Account Security</p>
              <p className="text-xs text-muted-foreground mt-1">Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</p>
              <p className="text-xs text-muted-foreground">Last sign-in: {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : '—'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Business Information */}
      {(isMerchant || user?.user_metadata?.user_type === 'merchant') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Building className="h-5 w-5" />Business Information</CardTitle>
              <CardDescription>Update your business details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Business Name</Label>
                  <Input value={merchant.business_name} onChange={(e) => setMerchant(prev => ({ ...prev, business_name: e.target.value }))} placeholder="Business name" />
                </div>
                <div className="space-y-1">
                  <Label>Business Email</Label>
                  <Input type="email" value={merchant.business_email} onChange={(e) => setMerchant(prev => ({ ...prev, business_email: e.target.value }))} placeholder="business@example.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Business Phone</Label>
                  <Input value={merchant.business_phone} onChange={(e) => setMerchant(prev => ({ ...prev, business_phone: e.target.value }))} placeholder="Business phone" />
                </div>
                <div className="space-y-1">
                  <Label>Website</Label>
                  <Input value={merchant.website} onChange={(e) => setMerchant(prev => ({ ...prev, website: e.target.value }))} placeholder="https://..." />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Business Address</Label>
                <Textarea value={merchant.business_address} onChange={(e) => setMerchant(prev => ({ ...prev, business_address: e.target.value }))} placeholder="Business address" rows={2} className="resize-none" />
              </div>
              <div className="space-y-1">
                <Label>Description</Label>
                <Textarea value={merchant.description} onChange={(e) => setMerchant(prev => ({ ...prev, description: e.target.value }))} placeholder="Describe your business" rows={2} className="resize-none" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5" />Business Logo</CardTitle>
              <CardDescription>Upload your business logo for branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={merchant.business_logo} />
                  <AvatarFallback className="text-2xl"><Building className="h-12 w-12" /></AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <Label htmlFor="logo-upload" className="cursor-pointer">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                      <Upload className="h-4 w-4" />{merchant.business_logo ? 'Change Logo' : 'Upload Logo'}
                    </div>
                  </Label>
                  <Input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={loading} />
                  <p className="text-sm text-muted-foreground mt-2">150x150px, PNG or JPG, max 5MB</p>
                </div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2 text-sm">Logo Usage</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Appears on generated QR codes</li>
                  <li>• Used in payment confirmations</li>
                  <li>• Displayed in customer-facing interfaces</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading} className="px-6">
          <Save className="h-4 w-4 mr-2" />{loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default AccountSettings;
