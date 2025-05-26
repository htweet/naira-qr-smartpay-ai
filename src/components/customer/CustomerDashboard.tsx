
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Scan, 
  CreditCard, 
  Brain,
  QrCode,
  TrendingUp,
  Clock,
  CheckCircle,
  History,
  Wallet,
  Star
} from "lucide-react";
import QRScanner from "@/components/customer/QRScanner";
import CustomerTransactions from "@/components/customer/CustomerTransactions";
import AIAnalytics from "@/components/AIAnalytics";

interface CustomerDashboardProps {
  user: any;
}

const CustomerDashboard = ({ user }: CustomerDashboardProps) => {
  const [activeTab, setActiveTab] = useState("scanner");
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    // Simulate fetching customer dashboard data
    const mockData = {
      overview: {
        totalSpent: 125000,
        transactionCount: 34,
        favoriteVendors: 8,
        rewardsEarned: 2500
      },
      recentTransactions: [
        { id: "TXN001", vendor: "Mama Put Restaurant", amount: 2500, status: "completed", time: "2 hours ago" },
        { id: "TXN002", vendor: "Grocery Store", amount: 8500, status: "completed", time: "1 day ago" },
        { id: "TXN003", vendor: "Fuel Station", amount: 15000, status: "completed", time: "2 days ago" },
        { id: "TXN004", vendor: "Pharmacy", amount: 3200, status: "completed", time: "3 days ago" }
      ],
      favoriteVendors: [
        { name: "Mama Put Restaurant", visits: 12, lastVisit: "2 hours ago" },
        { name: "Grocery Store", visits: 8, lastVisit: "1 day ago" },
        { name: "Coffee Shop", visits: 6, lastVisit: "5 days ago" }
      ]
    };
    setDashboardData(mockData);
  }, []);

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
        <p className="text-blue-100">Ready to make your next payment? Scan a QR code to get started.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Spent</p>
                <p className="text-2xl font-bold text-green-900">
                  ₦{dashboardData.overview.totalSpent.toLocaleString()}
                </p>
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
                <p className="text-2xl font-bold text-blue-900">
                  {dashboardData.overview.transactionCount}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Favorite Vendors</p>
                <p className="text-2xl font-bold text-purple-900">
                  {dashboardData.overview.favoriteVendors}
                </p>
              </div>
              <Star className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Rewards Earned</p>
                <p className="text-2xl font-bold text-orange-900">
                  ₦{dashboardData.overview.rewardsEarned.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white">
          <TabsTrigger value="scanner" className="flex items-center gap-2">
            <Scan className="h-4 w-4" />
            QR Scanner
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scanner" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <QRScanner />
            </div>
            <div className="space-y-6">
              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.recentTransactions.slice(0, 3).map((transaction: any) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <div>
                            <p className="font-medium text-sm">{transaction.vendor}</p>
                            <p className="text-xs text-gray-600">{transaction.time}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">₦{transaction.amount.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Favorite Vendors */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Favorite Vendors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.favoriteVendors.map((vendor: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <div>
                            <p className="font-medium text-sm">{vendor.name}</p>
                            <p className="text-xs text-gray-600">{vendor.visits} visits</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">{vendor.lastVisit}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <CustomerTransactions />
        </TabsContent>

        <TabsContent value="analytics">
          <AIAnalytics merchant={user} userType="customer" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerDashboard;
