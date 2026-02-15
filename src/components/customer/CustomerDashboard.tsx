import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scan, CreditCard, Brain, QrCode, TrendingUp, CheckCircle, History, Wallet, Star, Settings } from "lucide-react";
import QRScanner from "@/components/customer/QRScanner";
import CustomerTransactions from "@/components/customer/CustomerTransactions";
import AIAnalytics from "@/components/AIAnalytics";
import AccountSettings from "@/components/account/AccountSettings";
import { supabase } from "@/integrations/supabase/client";

interface CustomerDashboardProps {
  user: any;
}

const CustomerDashboard = ({ user }: CustomerDashboardProps) => {
  const [activeTab, setActiveTab] = useState("scanner");
  const [stats, setStats] = useState({ totalSpent: 0, transactionCount: 0, completedCount: 0 });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const fetchCustomerData = async () => {
      try {
        // Fetch transactions where this user is the customer
        const { data: customerRecords } = await supabase
          .from("customers")
          .select("id")
          .eq("user_id", user.id);

        const customerIds = customerRecords?.map(c => c.id) || [];

        if (customerIds.length > 0) {
          const { data: txns } = await supabase
            .from("transactions")
            .select("*")
            .in("customer_id", customerIds)
            .order("created_at", { ascending: false })
            .limit(10);

          const txList = txns || [];
          const completed = txList.filter(t => t.status === "completed");
          const totalSpent = completed.reduce((sum, t) => sum + Number(t.amount), 0);

          setStats({ totalSpent, transactionCount: txList.length, completedCount: completed.length });
          setRecentTransactions(txList.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchCustomerData();
  }, [user?.id]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
        <p className="text-blue-100">Ready to make your next payment? Scan a QR code to get started.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Spent</p>
                <p className="text-2xl font-bold text-green-900">₦{stats.totalSpent.toLocaleString()}</p>
              </div>
              <Wallet className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Transactions</p>
                <p className="text-2xl font-bold text-blue-900">{stats.transactionCount}</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Completed</p>
                <p className="text-2xl font-bold text-purple-900">{stats.completedCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white">
          <TabsTrigger value="scanner" className="flex items-center gap-2"><Scan className="h-4 w-4" />QR Scanner</TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2"><History className="h-4 w-4" />Transactions</TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2"><Brain className="h-4 w-4" />Analytics</TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2"><Settings className="h-4 w-4" />Account</TabsTrigger>
        </TabsList>

        <TabsContent value="scanner" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2"><QRScanner /></div>
            <div className="space-y-6">
              <Card>
                <CardHeader><CardTitle className="text-lg">Recent Transactions</CardTitle></CardHeader>
                <CardContent>
                  {recentTransactions.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No transactions yet</p>
                  ) : (
                    <div className="space-y-3">
                      {recentTransactions.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <CheckCircle className={`h-4 w-4 ${tx.status === "completed" ? "text-green-500" : "text-amber-500"}`} />
                            <div>
                              <p className="font-medium text-sm">{tx.description || "Payment"}</p>
                              <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <p className="font-medium text-sm">₦{Number(tx.amount).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="transactions"><CustomerTransactions /></TabsContent>
        <TabsContent value="analytics"><AIAnalytics merchant={user} userType="customer" /></TabsContent>
        <TabsContent value="settings"><AccountSettings /></TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerDashboard;
