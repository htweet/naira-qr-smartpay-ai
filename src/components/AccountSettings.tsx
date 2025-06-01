
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Save, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Profile {
  business_name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  business_logo: string;
}

const AccountSettings = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile>({
    business_name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    business_logo: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile({
          business_name: data.business_name || '',
          email: data.email || user?.email || '',
          phone: data.phone || '',
          address: data.address || '',
          website: data.website || '',
          business_logo: data.business_logo || ''
        });
      } else {
        // Create profile if it doesn't exist
        setProfile(prev => ({
          ...prev,
          email: user?.email || ''
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      setUploading(true);
      
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/logo.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('business-logos')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('business-logos')
        .getPublicUrl(fileName);

      const logoUrl = urlData.publicUrl;

      // Update profile with logo URL
      setProfile(prev => ({ ...prev, business_logo: logoUrl }));

      toast({
        title: "Success",
        description: "Business logo uploaded successfully",
      });
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload logo",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);

      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          business_name: profile.business_name,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
          website: profile.website,
          business_logo: profile.business_logo,
          user_type: user.user_metadata?.user_type || 'merchant',
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile settings saved successfully",
      });
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save profile settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Business Profile</CardTitle>
          <CardDescription>
            Manage your business information and branding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Business Logo Upload */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.business_logo} alt="Business Logo" />
              <AvatarFallback>
                {profile.business_name?.charAt(0)?.toUpperCase() || 'B'}
              </AvatarFallback>
            </Avatar>
            <div>
              <Label htmlFor="logo-upload" className="cursor-pointer">
                <Button variant="outline" disabled={uploading} asChild>
                  <span>
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Camera className="h-4 w-4 mr-2" />
                    )}
                    {uploading ? 'Uploading...' : 'Upload Logo'}
                  </span>
                </Button>
              </Label>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <p className="text-sm text-gray-500 mt-1">
                Upload your business logo (JPG, PNG, max 5MB)
              </p>
            </div>
          </div>

          {/* Business Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="business_name">Business Name</Label>
              <Input
                id="business_name"
                value={profile.business_name}
                onChange={(e) => setProfile(prev => ({ ...prev, business_name: e.target.value }))}
                placeholder="Enter business name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={profile.website}
                onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                placeholder="Enter website URL"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Business Address</Label>
            <Input
              id="address"
              value={profile.address}
              onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Enter business address"
            />
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;
