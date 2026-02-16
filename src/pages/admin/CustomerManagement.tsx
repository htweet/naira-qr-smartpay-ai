import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import DataTable from "@/components/admin/DataTable";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Plus, Users, Edit, Loader2 } from "lucide-react";

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
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: "", email: "", phone: "", status: "" });
  const [createForm, setCreateForm] = useState({ email: "", password: "", full_name: "", phone: "" });

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast({ title: "Error", description: "Failed to fetch customers", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleView = (customer: Customer) => { setSelectedCustomer(customer); setIsViewOpen(true); };
  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditForm({ full_name: customer.full_name || "", email: customer.email, phone: customer.phone || "", status: customer.status || "active" });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedCustomer) return;
    try {
      const { error } = await supabase.from("customers").update({
        full_name: editForm.full_name || null, email: editForm.email, phone: editForm.phone || null, status: editForm.status,
      }).eq("id", selectedCustomer.id);
      if (error) throw error;
      toast({ title: "Success", description: "Customer updated successfully" });
      setIsEditOpen(false);
      fetchCustomers();
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "Error", description: "Failed to update customer", variant: "destructive" });
    }
  };

  const handleDelete = async (customer: Customer) => {
    if (!confirm(`Deactivate ${customer.full_name || customer.email}?`)) return;
    try {
      const { error } = await supabase.from("customers").update({ status: "deleted" }).eq("id", customer.id);
      if (error) throw error;
      toast({ title: "Success", description: "Customer deactivated" });
      fetchCustomers();
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "Error", description: "Failed to deactivate", variant: "destructive" });
    }
  };

  const handleCreateCustomer = async () => {
    if (!createForm.email || !createForm.password) {
      toast({ title: "Error", description: "Email and password are required", variant: "destructive" });
      return;
    }
    setCreating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { data, error } = await supabase.functions.invoke("admin-create-user", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
        body: { email: createForm.email, password: createForm.password, user_type: "customer", full_name: createForm.full_name, phone: createForm.phone },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast({ title: "Customer Created", description: `${createForm.full_name || createForm.email} has been registered` });
      setIsCreateOpen(false);
      setCreateForm({ email: "", password: "", full_name: "", phone: "" });
      fetchCustomers();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to create customer";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  const columns = [
    { key: "full_name", label: "Name", render: (v: unknown) => String(v || "N/A") },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone", render: (v: unknown) => String(v || "-") },
    { key: "status", label: "Status", render: (v: unknown) => <Badge variant={v === "active" ? "default" : v === "inactive" ? "secondary" : "destructive"}>{String(v || "unknown")}</Badge> },
    { key: "total_spent", label: "Total Spent", render: (v: unknown) => `₦${Number(v || 0).toLocaleString()}` },
    { key: "total_transactions", label: "Transactions", render: (v: unknown) => Number(v || 0).toLocaleString() },
    { key: "created_at", label: "Joined", render: (v: unknown) => new Date(String(v)).toLocaleDateString() },
  ];

  const actions = [
    { label: "View Details", onClick: (row: Record<string, unknown>) => handleView(row as unknown as Customer) },
    { label: "Edit", onClick: (row: Record<string, unknown>) => handleEdit(row as unknown as Customer) },
    { label: "Deactivate", onClick: (row: Record<string, unknown>) => handleDelete(row as unknown as Customer), variant: "destructive" as const },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground">Manage all registered customers</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Customer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> All Customers ({customers.length})</CardTitle>
          <CardDescription>View and manage customer accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={customers as unknown as Record<string, unknown>[]} actions={actions} loading={loading} searchPlaceholder="Search customers..." />
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>Create a new customer account with login credentials</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Full Name</Label><Input value={createForm.full_name} onChange={(e) => setCreateForm({ ...createForm, full_name: e.target.value })} placeholder="John Doe" /></div>
            <div className="space-y-2"><Label>Email *</Label><Input type="email" value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} placeholder="customer@example.com" /></div>
            <div className="space-y-2"><Label>Password *</Label><Input type="password" value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} placeholder="Min 6 characters" /></div>
            <div className="space-y-2"><Label>Phone</Label><Input value={createForm.phone} onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })} placeholder="+234..." /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateCustomer} disabled={creating}>
              {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              Create Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Customer Details</DialogTitle></DialogHeader>
          {selectedCustomer && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label className="text-muted-foreground">Full Name</Label><p className="font-medium">{selectedCustomer.full_name || "N/A"}</p></div>
              <div className="space-y-1"><Label className="text-muted-foreground">Email</Label><p className="font-medium">{selectedCustomer.email}</p></div>
              <div className="space-y-1"><Label className="text-muted-foreground">Phone</Label><p className="font-medium">{selectedCustomer.phone || "-"}</p></div>
              <div className="space-y-1"><Label className="text-muted-foreground">Status</Label><Badge variant={selectedCustomer.status === "active" ? "default" : "destructive"}>{selectedCustomer.status}</Badge></div>
              <div className="space-y-1"><Label className="text-muted-foreground">Total Spent</Label><p className="font-medium">₦{(selectedCustomer.total_spent || 0).toLocaleString()}</p></div>
              <div className="space-y-1"><Label className="text-muted-foreground">Transactions</Label><p className="font-medium">{(selectedCustomer.total_transactions || 0).toLocaleString()}</p></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
            <Button onClick={() => { setIsViewOpen(false); if (selectedCustomer) handleEdit(selectedCustomer); }}><Edit className="h-4 w-4 mr-2" /> Edit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Customer</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Full Name</Label><Input value={editForm.full_name} onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} /></div>
            <div className="space-y-2"><Label>Phone</Label><Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} /></div>
            <div className="space-y-2"><Label>Status</Label>
              <Select value={editForm.status} onValueChange={(v) => setEditForm({ ...editForm, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerManagement;
