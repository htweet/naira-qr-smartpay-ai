
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Settings, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import PaymentProcessorConfig from "@/components/api/PaymentProcessorConfig";

const AdminPaymentGateways = () => {
  const mockGateways = [
    { id: 'moniepoint', name: 'Moniepoint', status: 'active', merchants: 45, volume: '₦12.5M' },
    { id: 'opay', name: 'Opay', status: 'active', merchants: 32, volume: '₦8.2M' },
    { id: 'palmpay', name: 'Palmpay', status: 'maintenance', merchants: 18, volume: '₦3.1M' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case 'maintenance':
        return <Badge variant="outline"><AlertTriangle className="h-3 w-3 mr-1" />Maintenance</Badge>;
      case 'disabled':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Disabled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Total Gateways</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">2</div>
            <p className="text-xs text-muted-foreground">Active Gateways</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">95</div>
            <p className="text-xs text-muted-foreground">Connected Merchants</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">₦23.8M</div>
            <p className="text-xs text-muted-foreground">Total Volume</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Gateway Overview</CardTitle>
          <CardDescription>
            Monitor and manage payment gateway integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gateway</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Connected Merchants</TableHead>
                <TableHead>Monthly Volume</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockGateways.map((gateway) => (
                <TableRow key={gateway.id}>
                  <TableCell className="font-medium">{gateway.name}</TableCell>
                  <TableCell>{getStatusBadge(gateway.status)}</TableCell>
                  <TableCell>{gateway.merchants}</TableCell>
                  <TableCell>{gateway.volume}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <Settings className="h-3 w-3 mr-1" />
                      Configure
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>
            Configure payment processor API settings and credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentProcessorConfig />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPaymentGateways;
