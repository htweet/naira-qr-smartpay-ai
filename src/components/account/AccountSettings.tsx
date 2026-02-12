import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building, Upload, Save, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const AccountSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    avatar_url: ''
  });
  const [merchant, setMerchant] = useState({
    business_name: '',
    business_logo: '',
    business_phone: '',
    business_address: '',
    website: '',
    description: ''
  });
  const [isMerchant, setIsMerchant] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfileAndMerchant();
    }
  }, [user]);

  const fetchProfileAndMerchant = async () => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (profileError) throw profileError;

      if (profileData) {
        setProfile({
          full_name: profileData.full_name || '',
          phone: profileData.phone || '',
          avatar_url: profileData.avatar_url || ''
        });
      }

      // Fetch merchant data
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
          website: merchantData.website || '',
          description: merchantData.description || ''
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please choose a file smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/logo.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('business-assets')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('business-assets')
        .getPublicUrl(filePath);

      setMerchant(prev => ({ ...prev, business_logo: publicUrl }));

      toast({
        title: "Logo uploaded successfully",
        description: "Your business logo will now appear on QR codes and payment confirmations",
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload logo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Update profile - use update instead of upsert to avoid duplicate key
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingProfile) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: profile.full_name,
            phone: profile.phone,
            avatar_url: profile.avatar_url,
          })
          .eq('user_id', user.id);
        if (profileError) throw profileError;
      } else {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            full_name: profile.full_name,
            phone: profile.phone,
            avatar_url: profile.avatar_url,
          });
        if (profileError) throw profileError;
      }

      // Update or create merchant if applicable
      if (isMerchant || merchant.business_name) {
        const { error: merchantError } = await supabase
          .from('merchants')
          .upsert({
            user_id: user.id,
            business_name: merchant.business_name || 'My Business',
            business_logo: merchant.business_logo,
            business_phone: merchant.business_phone,
            business_address: merchant.business_address,
            website: merchant.website,
            description: merchant.description,
          });

        if (merchantError) throw merchantError;
        setIsMerchant(true);
      }

      toast({
        title: "Settings saved",
        description: "Your account settings have been updated successfully",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Save failed",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
        <p className="text-gray-600">Manage your account and business information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Business Information
            </CardTitle>
            <CardDescription>
              Update your business details and branding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="business_name">Business Name</Label>
              <Input
                id="business_name"
                value={merchant.business_name}
                onChange={(e) => setMerchant(prev => ({ ...prev, business_name: e.target.value }))}
                placeholder="Enter your business name"
              />
            </div>

            <div>
              <Label htmlFor="business_phone">Business Phone</Label>
              <Input
                id="business_phone"
                value={merchant.business_phone}
                onChange={(e) => setMerchant(prev => ({ ...prev, business_phone: e.target.value }))}
                placeholder="Enter your business phone"
              />
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={merchant.website}
                onChange={(e) => setMerchant(prev => ({ ...prev, website: e.target.value }))}
                placeholder="Enter your website URL"
              />
            </div>

            <div>
              <Label htmlFor="address">Business Address</Label>
              <Textarea
                id="address"
                value={merchant.business_address}
                onChange={(e) => setMerchant(prev => ({ ...prev, business_address: e.target.value }))}
                placeholder="Enter your business address"
                className="resize-none"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="description">Business Description</Label>
              <Textarea
                id="description"
                value={merchant.description}
                onChange={(e) => setMerchant(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your business"
                className="resize-none"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Business Logo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Business Logo
            </CardTitle>
            <CardDescription>
              Upload your business logo for QR codes and branding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={merchant.business_logo} alt="Business Logo" />
                <AvatarFallback className="text-2xl">
                  <Building className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>

              <div className="text-center">
                <Label htmlFor="logo-upload" className="cursor-pointer">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                    <Upload className="h-4 w-4" />
                    {merchant.business_logo ? 'Change Logo' : 'Upload Logo'}
                  </div>
                </Label>
                <Input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  disabled={loading}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Recommended: 150x150px, PNG or JPG, max 5MB
                </p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Logo Usage</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Appears on generated QR codes</li>
                <li>• Used in payment confirmations</li>
                <li>• Displayed in customer-facing interfaces</li>
                <li>• Enhances brand recognition</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Information
          </CardTitle>
          <CardDescription>
            Your account details and authentication information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={profile.full_name}
                onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <Label>Email Address</Label>
              <Input value={user?.email || ''} disabled className="bg-gray-50" />
            </div>
            <div>
              <Label>Member Since</Label>
              <Input 
                value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : ''} 
                disabled 
                className="bg-gray-50" 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading} className="px-6">
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default AccountSettings;