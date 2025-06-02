
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CustomerDetailModalProps {
  customer: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const CustomerDetailModal = ({ customer, isOpen, onClose, onUpdate }: CustomerDetailModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    status: customer.customer_management?.[0]?.status || 'active',
    risk_level: customer.customer_management?.[0]?.risk_level || 'low',
    notes: customer.customer_management?.[0]?.notes || '',
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('customer_management')
        .upsert({
          user_id: customer.id,
          status: formData.status,
          risk_level: formData.risk_level,
          notes: formData.notes,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Customer Updated",
        description: "Customer information has been updated successfully.",
      });

      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating customer:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update customer information.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Customer Details - {customer.business_name || 'Customer'}
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
                  <Label>Customer ID</Label>
                  <p className="text-sm text-gray-600">{customer.id}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm text-gray-600">{customer.email || 'Not provided'}</p>
                </div>
                <div>
                  <Label>Business Name</Label>
                  <p className="text-sm text-gray-600">{customer.business_name || 'Not provided'}</p>
                </div>
                <div>
                  <Label>Joined Date</Label>
                  <p className="text-sm text-gray-600">{new Date(customer.created_at).toLocaleDateString()}</p>
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
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="risk_level">Risk Level</Label>
                  <Select value={formData.risk_level} onValueChange={(value) => setFormData(prev => ({ ...prev, risk_level: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select risk level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Risk</SelectItem>
                      <SelectItem value="medium">Medium Risk</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes">Administrative Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any notes about this customer..."
                  rows={4}
                />
              </div>

              <div className="flex items-center gap-2">
                <Label>Current Risk Level:</Label>
                <Badge className={getRiskBadgeColor(formData.risk_level)}>
                  {formData.risk_level.toUpperCase()}
                </Badge>
                {formData.risk_level === 'high' && (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
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

export default CustomerDetailModal;
