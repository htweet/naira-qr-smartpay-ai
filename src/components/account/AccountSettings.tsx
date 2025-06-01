
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Save, User, Building, Phone, Globe, MapPin } from "lucide-react";
import { useAccountSettings } from "@/hooks/useAccountSettings";

const AccountSettings = () => {
  const { profile, loading, saving, updateProfile, uploadLogo } = useAccountSettings();
  const [formData, setFormData] = useState({
    business_name: '',
    phone: '',
    address: '',
    website: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Update form when profile loads
  React.useEffect(() => {
    if (profile) {
      setFormData({
        business_name: profile.business_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        website: profile.website || '',
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
    }
  };

  const handleSave = async () => {
    try {
      // Upload logo first if there's a new one
      if (logoFile) {
        await uploadLogo(logoFile);
        setLogoFile(null);
      }

      // Update profile data
      await updateProfile(formData);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Settings
          </CardTitle>
          <CardDescription>
            Manage your business profile and account information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Business Logo */}
          <div className="space-y-4">
            <Label>Business Logo</Label>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile?.business_logo} alt="Business Logo" />
                <AvatarFallback>
                  <Building className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                  id="logo-upload"
                />
                <Label htmlFor="logo-upload">
                  <Button variant="outline" className="cursor-pointer" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </span>
                  </Button>
                </Label>
                {logoFile && (
                  <p className="text-sm text-gray-600 mt-1">
                    Selected: {logoFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="business_name">Business Name</Label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="business_name"
                  className="pl-10"
                  value={formData.business_name}
                  onChange={(e) => handleInputChange('business_name', e.target.value)}
                  placeholder="Enter your business name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  className="pl-10"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="website"
                  className="pl-10"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Business Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Textarea
                  id="address"
                  className="pl-10 min-h-[80px]"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter your business address"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;
