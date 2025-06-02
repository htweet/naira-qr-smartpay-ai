
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Settings, CreditCard, Shield, BarChart3, Database } from "lucide-react";
import { useAdminPanel } from "@/hooks/useAdminPanel";
import AdminMerchants from "./AdminMerchants";
import AdminCustomers from "./AdminCustomers";
import AdminSystemSettings from "./AdminSystemSettings";
import AdminPaymentGateways from "./AdminPaymentGateways";
import AdminAnalytics from "./AdminAnalytics";
import DatabaseManagement from "./DatabaseManagement";

const AdminPanel = () => {
  const { isAdmin, loading, createSuperAdmin } = useAdminPanel();
  const [superAdminEmail, setSuperAdminEmail] = useState("");

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Admin Access Required
            </CardTitle>
            <CardDescription>
              You need admin privileges to access this panel.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Create Super Admin</label>
              <div className="flex gap-2 mt-1">
                <Input
                  placeholder="Enter email address"
                  value={superAdminEmail}
                  onChange={(e) => setSuperAdminEmail(e.target.value)}
                />
                <Button 
                  onClick={() => createSuperAdmin(superAdminEmail)}
                  disabled={!superAdminEmail}
                >
                  Create
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600">Comprehensive system management</p>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              <Shield className="h-3 w-3 mr-1" />
              Administrator
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="merchants" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="merchants" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Merchants
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Customers
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment Gateways
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              System Settings
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Database
            </TabsTrigger>
          </TabsList>

          <TabsContent value="merchants">
            <AdminMerchants />
          </TabsContent>

          <TabsContent value="customers">
            <AdminCustomers />
          </TabsContent>

          <TabsContent value="payments">
            <AdminPaymentGateways />
          </TabsContent>

          <TabsContent value="analytics">
            <AdminAnalytics />
          </TabsContent>

          <TabsContent value="system">
            <AdminSystemSettings />
          </TabsContent>

          <TabsContent value="database">
            <DatabaseManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
