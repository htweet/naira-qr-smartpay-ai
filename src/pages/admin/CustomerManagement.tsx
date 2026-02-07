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
import { Plus, Users, Eye, Edit, Trash } from "lucide-react";

interface Customer {
  id: string;
  user_id: string | null;
  merchant_id: string | null;
  full_name: string | null;
  email: string;
  phone: string | null;
  status: string | null;
  total_spent: number | null;
  total_transactions: number | null;
  created_at: string;
}

const CustomerManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    status: "",
  });

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast({
        title: "Error",
        description: "Failed to fetch customers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleView = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsViewOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditForm({
      full_name: customer.full_name || "",
      email: customer.email,
      phone: customer.phone || "",
      status: customer.status || "active",
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedCustomer) return;

    try {
      const { error } = await supabase
        .from("customers")
        .update({
          full_name: editForm.full_name || null,
          email: editForm.email,
          phone: editForm.phone || null,
          status: editForm.status,
        })
        .eq("id", selectedCustomer.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Customer updated successfully",
      });

      setIsEditOpen(false);
      fetchCustomers();
    } catch (error) {
      console.error("Error updating customer:", error);
      toast({
        title: "Error",
        description: "Failed to update customer",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (customer: Customer) => {
    if (!confirm(`Are you sure you want to delete ${customer.full_name || customer.email}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("customers")
        .update({ status: "deleted" })
        .eq("id", customer.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Customer deleted successfully",
      });

      fetchCustomers();
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive",
      });
    }
  };

  const columns = [
    {
      key: "full_name",
      label: "Name",
      render: (value: unknown) => String(value || "N/A"),
    },
    { key: "email", label: "Email" },
    {
      key: "phone",
      label: "Phone",
      render: (value: unknown) => String(value || "-"),
    },
    {
      key: "status",
      label: "Status",
      render: (value: unknown) => (
        <Badge
          variant={
            value === "active"
              ? "default"
              : value === "inactive"
              ? "secondary"
              : "destructive"
          }
        >
          {String(value || "unknown")}
        </Badge>
      ),
    },
    {
      key: "total_spent",
      label: "Total Spent",
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
      onClick: (row: Record<string, unknown>) => handleView(row as unknown as Customer),
    },
    {
      label: "Edit",
      onClick: (row: Record<string, unknown>) => handleEdit(row as unknown as Customer),
    },
    {
      label: "Delete",
      onClick: (row: Record<string, unknown>) => handleDelete(row as unknown as Customer),
      variant: "destructive" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground">
            Manage all registered customers
          </p>
        </div>
        <Button disabled>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All Customers ({customers.length})
          </CardTitle>
          <CardDescription>
            View and manage customer accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={customers as unknown as Record<string, unknown>[]}
            actions={actions}
            loading={loading}
            searchPlaceholder="Search customers..."
          />
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              Full information about the customer
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-muted-foreground">Full Name</Label>
                <p className="font-medium">{selectedCustomer.full_name || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium">{selectedCustomer.email}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Phone</Label>
                <p className="font-medium">{selectedCustomer.phone || "-"}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Status</Label>
                <Badge
                  variant={
                    selectedCustomer.status === "active"
                      ? "default"
                      : selectedCustomer.status === "inactive"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {selectedCustomer.status || "unknown"}
                </Badge>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Total Spent</Label>
                <p className="font-medium">
                  ₦{(selectedCustomer.total_spent || 0).toLocaleString()}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Total Transactions</Label>
                <p className="font-medium">
                  {(selectedCustomer.total_transactions || 0).toLocaleString()}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">User ID</Label>
                <p className="font-mono text-sm">{selectedCustomer.user_id || "-"}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Joined</Label>
                <p className="font-medium">
                  {new Date(selectedCustomer.created_at).toLocaleDateString()}
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
              if (selectedCustomer) handleEdit(selectedCustomer);
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
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update customer information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={editForm.full_name}
                onChange={(e) =>
                  setEditForm({ ...editForm, full_name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm({ ...editForm, phone: e.target.value })
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
                  <SelectItem value="inactive">Inactive</SelectItem>
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

export default CustomerManagement;
