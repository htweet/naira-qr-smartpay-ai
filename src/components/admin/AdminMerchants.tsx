
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useAdminPanel } from "@/hooks/useAdminPanel";

const AdminMerchants = () => {
  const { merchants } = useAdminPanel();

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
            <div className="text-2xl font-bold">{merchants.length}</div>
            <p className="text-xs text-muted-foreground">Total Merchants</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {merchants.filter(m => m.merchant_management?.[0]?.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Active Merchants</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">
              {merchants.filter(m => m.merchant_management?.[0]?.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              {merchants.filter(m => m.merchant_management?.[0]?.status === 'suspended').length}
            </div>
            <p className="text-xs text-muted-foreground">Suspended</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Merchant Management</CardTitle>
          <CardDescription>
            Manage merchant accounts, verification status, and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {merchants.map((merchant) => (
                <TableRow key={merchant.id}>
                  <TableCell className="font-medium">
                    {merchant.business_name || 'No business name'}
                  </TableCell>
                  <TableCell>{merchant.email || 'No email'}</TableCell>
                  <TableCell>
                    {getStatusBadge(merchant.merchant_management?.[0]?.status || 'pending')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={merchant.merchant_management?.[0]?.verification_status === 'verified' ? 'default' : 'outline'}>
                      {merchant.merchant_management?.[0]?.verification_status || 'pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(merchant.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
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
    </div>
  );
};

export default AdminMerchants;
