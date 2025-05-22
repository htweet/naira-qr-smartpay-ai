
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  CreditCard, 
  DollarSign, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  QrCode
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface MerchantDashboardProps {
  merchant: any;
}

const MerchantDashboard = ({ merchant }: MerchantDashboardProps) => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [timeRange, setTimeRange] = useState("30d");

  useEffect(() => {
    // Simulate fetching dashboard data
    const mockData = {
      overview: {
        totalRevenue: 2450000,
        revenueChange: 12.5,
        totalTransactions: 1847,
        transactionsChange: 8.2,
        successRate: 98.7,
        successRateChange: 0.3,
        activeQRCodes: 23,
        qrCodeChange: 4
      },
      transactions: {
        recent: [
          { id: "TXN001", amount: 15000, customer: "John Doe", status: "completed", gateway: "Moniepoint", time: "2 mins ago" },
          { id: "TXN002", amount: 8500, customer: "Jane Smith", status: "completed", gateway: "Opay", time: "5 mins ago" },
          { id: "TXN003", amount: 25000, customer: "Mike Johnson", status: "pending", gateway: "Palmpay", time: "8 mins ago" },
          { id: "TXN004", amount: 12000, customer: "Sarah Wilson", status: "completed", gateway: "Moniepoint", time: "12 mins ago" },
          { id: "TXN005", amount: 7500, customer: "David Brown", status: "failed", gateway: "Opay", time: "15 mins ago" }
        ],
        daily: [
          { date: "Mon", amount: 85000, count: 45 },
          { date: "Tue", amount: 92000, count: 52 },
          { date: "Wed", amount: 78000, count: 41 },
          { date: "Thu", amount: 105000, count: 58 },
          { date: "Fri", amount: 125000, count: 67 },
          { date: "Sat", amount: 150000, count: 82 },
          { date: "Sun", amount: 110000, count: 61 }
        ]
      },
      analytics: {
        paymentMethods: [
          { name: "Moniepoint", value: 45, color: "#8884d8" },
          { name: "Opay", value: 35, color: "#82ca9d" },
          { name: "Palmpay", value: 20, color: "#ffc658" }
        ],
        customerBehavior: [
          { hour: "6AM", transactions: 2 },
          { hour: "9AM", transactions: 15 },
          { hour: "12PM", transactions: 45 },
          { hour: "3PM", transactions: 38 },
          { hour: "6PM", transactions: 52 },
          { hour: "9PM", transactions: 28 },
          { hour: "12AM", transactions: 8 }
        ]
      },
      alerts: [
        { type: "success", message: "Payment gateway performance optimal", time: "5 mins ago" },
        { type: "warning", message: "Unusual transaction pattern detected", time: "1 hour ago" },
        { type: "info", message: "Weekly report available for download", time: "2 hours ago" }
      ]
    };
    setDashboardData(mockData);
  }, [timeRange]);

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      completed: "default",
      pending: "secondary",
      failed: "destructive"
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Revenue</p>
                <p className="text-2xl font-bold text-blue-900">
                  ₦{dashboardData.overview.totalRevenue.toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">
                    +{dashboardData.overview.revenueChange}%
                  </span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Transactions</p>
                <p className="text-2xl font-bold text-green-900">
                  {dashboardData.overview.totalTransactions.toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">
                    +{dashboardData.overview.transactionsChange}%
                  </span>
                </div>
              </div>
              <CreditCard className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Success Rate</p>
                <p className="text-2xl font-bold text-purple-900">
                  {dashboardData.overview.successRate}%
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">
                    +{dashboardData.overview.successRateChange}%
                  </span>
                </div>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Active QR Codes</p>
                <p className="text-2xl font-bold text-orange-900">
                  {dashboardData.overview.activeQRCodes}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">
                    +{dashboardData.overview.qrCodeChange}
                  </span>
                </div>
              </div>
              <QrCode className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Transaction Volume</CardTitle>
            <CardDescription>Revenue and transaction count over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dashboardData.transactions.daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === "amount" ? `₦${value.toLocaleString()}` : value,
                  name === "amount" ? "Revenue" : "Count"
                ]} />
                <Area type="monotone" dataKey="amount" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Methods Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Gateway Distribution</CardTitle>
            <CardDescription>Transaction volume by payment gateway</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.analytics.paymentMethods}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dashboardData.analytics.paymentMethods.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest payment activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.transactions.recent.map((transaction: any) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(transaction.status)}
                    <div>
                      <p className="font-medium">{transaction.customer}</p>
                      <p className="text-sm text-gray-600">{transaction.id} • {transaction.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₦{transaction.amount.toLocaleString()}</p>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(transaction.status)}
                      <Badge variant="outline" className="text-xs">
                        {transaction.gateway}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts & Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Alerts & Notifications</CardTitle>
            <CardDescription>System updates and important notices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.alerts.map((alert: any, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    alert.type === "success" ? "bg-green-500" :
                    alert.type === "warning" ? "bg-yellow-500" : "bg-blue-500"
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-gray-500">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Behavior Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Transaction Patterns</CardTitle>
          <CardDescription>Hourly transaction distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.analytics.customerBehavior}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="transactions" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default MerchantDashboard;
