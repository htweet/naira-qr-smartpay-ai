
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useAdminPanel } from "@/hooks/useAdminPanel";
import CustomerDetailModal from "./CustomerDetailModal";

const AdminCustomers = () => {
  const { customers, loadCustomers } = useAdminPanel();
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleUpdateCustomer = () => {
    loadCustomers();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case 'suspended':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Suspended</Badge>;
      case 'pending':
        return <Badge variant="outline"><AlertTriangle className="h-3 w-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">Total Customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {customers.filter(c => c.customer_management?.[0]?.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Active Customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">
              {customers.filter(c => c.customer_management?.[0]?.risk_level === 'medium').length}
            </div>
            <p className="text-xs text-muted-foreground">Medium Risk</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              {customers.filter(c => c.customer_management?.[0]?.risk_level === 'high').length}
            </div>
            <p className="text-xs text-muted-foreground">High Risk</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Management</CardTitle>
          <CardDescription>
            Monitor customer accounts, risk levels, and transaction patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    {customer.business_name || 'Customer'}
                  </TableCell>
                  <TableCell>{customer.email || 'No email'}</TableCell>
                  <TableCell>
                    {getStatusBadge(customer.customer_management?.[0]?.status || 'active')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={customer.customer_management?.[0]?.risk_level === 'low' ? 'default' : 'destructive'}>
                      {customer.customer_management?.[0]?.risk_level || 'low'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(customer.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewCustomer(customer)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onUpdate={handleUpdateCustomer}
        />
      )}
    </div>
  );
};

export default AdminCustomers;
