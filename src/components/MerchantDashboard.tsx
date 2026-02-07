import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  CreditCard, 
  Activity,
  QrCode,
  TrendingUp,
  Users,
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import MerchantStats from "@/components/merchant/MerchantStats";
import RecentTransactionsList from "@/components/merchant/RecentTransactionsList";
import QuickActions from "@/components/merchant/QuickActions";
import { useMerchantStats } from "@/hooks/useMerchantStats";
import { useRealtimeTransactions } from "@/hooks/useRealtimeTransactions";

interface MerchantDashboardProps {
  merchant: {
    id: string;
    business_name?: string;
    user_id?: string;
    email?: string;
  };
}

const MerchantDashboard = ({ merchant }: MerchantDashboardProps) => {
  const { stats, recentTransactions, loading } = useMerchantStats(merchant?.id);
  const { transactions: realtimeTransactions, isConnected } = useRealtimeTransactions(merchant?.id);

  // Use realtime transactions if available, otherwise fall back to initial fetch
  const displayTransactions = realtimeTransactions.length > 0 ? realtimeTransactions : recentTransactions;

  // Generate chart data from recent transactions
  const generateChartData = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day, index) => ({
      date: day,
      amount: Math.floor(Math.random() * 100000) + 50000, // Placeholder - would aggregate real data
      count: Math.floor(Math.random() * 50) + 10,
    }));
  };

  const chartData = generateChartData();

  const paymentMethodsData = [
    { name: "Moniepoint", value: 45, color: "hsl(var(--chart-1))" },
    { name: "OPay", value: 35, color: "hsl(var(--chart-2))" },
    { name: "PalmPay", value: 20, color: "hsl(var(--chart-3))" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {merchant.business_name || merchant.email?.split('@')[0] || 'Merchant'}</h1>
          <p className="text-muted-foreground">Here's what's happening with your business</p>
        </div>
        {isConnected && (
          <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Live
          </Badge>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MerchantStats
          title="Total Revenue"
          value={`₦${stats.totalRevenue.toLocaleString()}`}
          change={stats.revenueChange}
          icon={DollarSign}
          variant="blue"
        />
        <MerchantStats
          title="Transactions"
          value={stats.totalTransactions.toLocaleString()}
          change={stats.transactionsChange}
          icon={CreditCard}
          variant="green"
        />
        <MerchantStats
          title="Success Rate"
          value={`${stats.successRate}%`}
          icon={Activity}
          variant="purple"
        />
        <MerchantStats
          title="Active QR Codes"
          value={stats.activeQRCodes}
          icon={QrCode}
          variant="orange"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Daily revenue over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  formatter={(value) => [`₦${Number(value).toLocaleString()}`, "Revenue"]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Transaction distribution by gateway</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentMethodsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {paymentMethodsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Recent Transactions
            </CardTitle>
            <CardDescription>Your latest payment activity</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentTransactionsList
              transactions={displayTransactions}
              isConnected={isConnected}
            />
          </CardContent>
        </Card>

        <QuickActions />
      </div>

      {/* Transaction Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-600">Completed</p>
              <p className="text-2xl font-bold text-emerald-900">
                {stats.completedTransactions}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-600">Pending</p>
              <p className="text-2xl font-bold text-amber-900">
                {stats.pendingTransactions}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center">
              <Activity className="h-5 w-5 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Failed</p>
              <p className="text-2xl font-bold text-red-900">
                {stats.failedTransactions}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MerchantDashboard;
