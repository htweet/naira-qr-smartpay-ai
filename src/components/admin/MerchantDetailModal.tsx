
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, CheckCircle, XCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MerchantDetailModalProps {
  merchant: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const MerchantDetailModal = ({ merchant, isOpen, onClose, onUpdate }: MerchantDetailModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    status: merchant.merchant_management?.[0]?.status || 'pending',
    verification_status: merchant.merchant_management?.[0]?.verification_status || 'pending',
    business_type: merchant.merchant_management?.[0]?.business_type || '',
    verification_notes: merchant.merchant_management?.[0]?.verification_notes || '',
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('merchant_management')
        .upsert({
          user_id: merchant.id,
          status: formData.status,
          verification_status: formData.verification_status,
          business_type: formData.business_type,
          verification_notes: formData.verification_notes,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Merchant Updated",
        description: "Merchant information has been updated successfully.",
      });

      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating merchant:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update merchant information.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationBadgeColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Merchant Details - {merchant.business_name || 'Merchant'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Merchant ID</Label>
                  <p className="text-sm text-gray-600">{merchant.id}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm text-gray-600">{merchant.email || 'Not provided'}</p>
                </div>
                <div>
                  <Label>Business Name</Label>
                  <p className="text-sm text-gray-600">{merchant.business_name || 'Not provided'}</p>
                </div>
                <div>
                  <Label>Joined Date</Label>
                  <p className="text-sm text-gray-600">{new Date(merchant.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Management Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Account Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="pending">Pending Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="verification_status">Verification Status</Label>
                  <Select value={formData.verification_status} onValueChange={(value) => setFormData(prev => ({ ...prev, verification_status: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select verification status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="business_type">Business Type</Label>
                <Select value={formData.business_type} onValueChange={(value) => setFormData(prev => ({ ...prev, business_type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="verification_notes">Verification Notes</Label>
                <Textarea
                  id="verification_notes"
                  value={formData.verification_notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, verification_notes: e.target.value }))}
                  placeholder="Add verification notes or reasons for status changes..."
                  rows={4}
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label>Status:</Label>
                  <Badge className={getStatusBadgeColor(formData.status)}>
                    {formData.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Label>Verification:</Label>
                  <Badge className={getVerificationBadgeColor(formData.verification_status)}>
                    {formData.verification_status === 'verified' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {formData.verification_status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                    {formData.verification_status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <Save className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MerchantDetailModal;
