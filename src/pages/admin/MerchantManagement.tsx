import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DataTable from "@/components/admin/DataTable";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Plus, Store, Eye, Edit, Trash } from "lucide-react";

interface Merchant {
  id: string;
  user_id: string;
  business_name: string;
  business_email: string | null;
  business_phone: string | null;
  status: string | null;
  total_revenue: number | null;
  total_transactions: number | null;
  created_at: string;
}

const MerchantManagement = () => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    business_name: "",
    business_email: "",
    business_phone: "",
    status: "",
  });

  const fetchMerchants = async () => {
    try {
      const { data, error } = await supabase
        .from("merchants")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMerchants(data || []);
    } catch (error) {
      console.error("Error fetching merchants:", error);
      toast({
        title: "Error",
        description: "Failed to fetch merchants",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchants();
  }, []);

  const handleView = (merchant: Merchant) => {
    setSelectedMerchant(merchant);
    setIsViewOpen(true);
  };

  const handleEdit = (merchant: Merchant) => {
    setSelectedMerchant(merchant);
    setEditForm({
      business_name: merchant.business_name,
      business_email: merchant.business_email || "",
      business_phone: merchant.business_phone || "",
      status: merchant.status || "active",
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedMerchant) return;

    try {
      const { error } = await supabase
        .from("merchants")
        .update({
          business_name: editForm.business_name,
          business_email: editForm.business_email || null,
          business_phone: editForm.business_phone || null,
          status: editForm.status,
        })
        .eq("id", selectedMerchant.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Merchant updated successfully",
      });

      setIsEditOpen(false);
      fetchMerchants();
    } catch (error) {
      console.error("Error updating merchant:", error);
      toast({
        title: "Error",
        description: "Failed to update merchant",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (merchant: Merchant) => {
    if (!confirm(`Are you sure you want to delete ${merchant.business_name}?`)) {
      return;
    }

    try {
      // Note: This will fail due to RLS if not admin or no delete policy
      // Soft delete by setting status to 'deleted'
      const { error } = await supabase
        .from("merchants")
        .update({ status: "deleted" })
        .eq("id", merchant.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Merchant deleted successfully",
      });

      fetchMerchants();
    } catch (error) {
      console.error("Error deleting merchant:", error);
      toast({
        title: "Error",
        description: "Failed to delete merchant",
        variant: "destructive",
      });
    }
  };

  const columns = [
    { key: "business_name", label: "Business Name" },
    { key: "business_email", label: "Email" },
    {
      key: "status",
      label: "Status",
      render: (value: unknown) => (
        <Badge
          variant={
            value === "active"
              ? "default"
              : value === "pending"
              ? "secondary"
              : "destructive"
          }
        >
          {String(value || "unknown")}
        </Badge>
      ),
    },
    {
      key: "total_revenue",
      label: "Revenue",
      render: (value: unknown) => `₦${Number(value || 0).toLocaleString()}`,
    },
    {
      key: "total_transactions",
      label: "Transactions",
      render: (value: unknown) => Number(value || 0).toLocaleString(),
    },
    {
      key: "created_at",
      label: "Joined",
      render: (value: unknown) => new Date(String(value)).toLocaleDateString(),
    },
  ];

  const actions = [
    {
      label: "View Details",
      onClick: (row: Record<string, unknown>) => handleView(row as unknown as Merchant),
    },
    {
      label: "Edit",
      onClick: (row: Record<string, unknown>) => handleEdit(row as unknown as Merchant),
    },
    {
      label: "Delete",
      onClick: (row: Record<string, unknown>) => handleDelete(row as unknown as Merchant),
      variant: "destructive" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Merchant Management</h1>
          <p className="text-muted-foreground">
            Manage all registered merchants
          </p>
        </div>
        <Button disabled>
          <Plus className="h-4 w-4 mr-2" />
          Add Merchant
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            All Merchants ({merchants.length})
          </CardTitle>
          <CardDescription>
            View and manage merchant accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={merchants as unknown as Record<string, unknown>[]}
            actions={actions}
            loading={loading}
            searchPlaceholder="Search merchants..."
          />
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Merchant Details</DialogTitle>
            <DialogDescription>
              Full information about the merchant
            </DialogDescription>
          </DialogHeader>
          {selectedMerchant && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-muted-foreground">Business Name</Label>
                <p className="font-medium">{selectedMerchant.business_name}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium">{selectedMerchant.business_email || "-"}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Phone</Label>
                <p className="font-medium">{selectedMerchant.business_phone || "-"}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Status</Label>
                <Badge
                  variant={
                    selectedMerchant.status === "active"
                      ? "default"
                      : selectedMerchant.status === "pending"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {selectedMerchant.status || "unknown"}
                </Badge>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Total Revenue</Label>
                <p className="font-medium">
                  ₦{(selectedMerchant.total_revenue || 0).toLocaleString()}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Total Transactions</Label>
                <p className="font-medium">
                  {(selectedMerchant.total_transactions || 0).toLocaleString()}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">User ID</Label>
                <p className="font-mono text-sm">{selectedMerchant.user_id}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Joined</Label>
                <p className="font-medium">
                  {new Date(selectedMerchant.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setIsViewOpen(false);
              if (selectedMerchant) handleEdit(selectedMerchant);
            }}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Merchant</DialogTitle>
            <DialogDescription>
              Update merchant information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Business Name</Label>
              <Input
                value={editForm.business_name}
                onChange={(e) =>
                  setEditForm({ ...editForm, business_name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={editForm.business_email}
                onChange={(e) =>
                  setEditForm({ ...editForm, business_email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={editForm.business_phone}
                onChange={(e) =>
                  setEditForm({ ...editForm, business_phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={editForm.status}
                onValueChange={(value) =>
                  setEditForm({ ...editForm, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="deleted">Deleted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MerchantManagement;
