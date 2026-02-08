import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCard from "@/components/admin/StatsCard";
import { supabase } from "@/integrations/supabase/client";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  Activity,
  QrCode
} from "lucide-react";

const PlatformAnalytics = () => {
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalRevenue: 0,
    totalMerchants: 0,
    totalCustomers: 0,
    totalQRCodes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [transactionsRes, merchantsRes, customersRes, qrCodesRes] = await Promise.all([
          supabase.from("transactions").select("amount, status"),
          supabase.from("merchants").select("id", { count: "exact", head: true }),
          supabase.from("customers").select("id", { count: "exact", head: true }),
          supabase.from("qr_codes").select("id", { count: "exact", head: true }),
        ]);

        const transactions = transactionsRes.data || [];
        const completedTx = transactions.filter((t) => t.status === "completed");
        const totalRevenue = completedTx.reduce((sum, t) => sum + Number(t.amount), 0);

        setStats({
          totalTransactions: transactions.length,
          totalRevenue,
          totalMerchants: merchantsRes.count || 0,
          totalCustomers: customersRes.count || 0,
          totalQRCodes: qrCodesRes.count || 0,
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Mock data for charts
  const weeklyData = [
    { day: "Mon", transactions: 45, revenue: 125000 },
    { day: "Tue", transactions: 52, revenue: 145000 },
    { day: "Wed", transactions: 38, revenue: 98000 },
    { day: "Thu", transactions: 65, revenue: 178000 },
    { day: "Fri", transactions: 71, revenue: 195000 },
    { day: "Sat", transactions: 58, revenue: 156000 },
    { day: "Sun", transactions: 42, revenue: 112000 },
  ];

  const paymentMethodData = [
    { name: "Moniepoint", value: 45, color: "hsl(var(--chart-1))" },
    { name: "OPay", value: 35, color: "hsl(var(--chart-2))" },
    { name: "PalmPay", value: 20, color: "hsl(var(--chart-3))" },
  ];

  const statusData = [
    { name: "Completed", value: 78, color: "hsl(142, 71%, 45%)" },
    { name: "Pending", value: 15, color: "hsl(45, 93%, 47%)" },
    { name: "Failed", value: 7, color: "hsl(0, 84%, 60%)" },
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
      <div>
        <h1 className="text-3xl font-bold">Platform Analytics</h1>
        <p className="text-muted-foreground">
          Overview of platform performance and metrics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Total Revenue"
          value={`₦${stats.totalRevenue.toLocaleString()}`}
          icon={TrendingUp}
          iconColor="text-emerald-600"
          bgColor="bg-emerald-100"
        />
        <StatsCard
          title="Transactions"
          value={stats.totalTransactions}
          icon={CreditCard}
          iconColor="text-blue-600"
          bgColor="bg-blue-100"
        />
        <StatsCard
          title="Merchants"
          value={stats.totalMerchants}
          icon={Users}
          iconColor="text-purple-600"
          bgColor="bg-purple-100"
        />
        <StatsCard
          title="Customers"
          value={stats.totalCustomers}
          icon={Activity}
          iconColor="text-amber-600"
          bgColor="bg-amber-100"
        />
        <StatsCard
          title="QR Codes"
          value={stats.totalQRCodes}
          icon={QrCode}
          iconColor="text-cyan-600"
          bgColor="bg-cyan-100"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Transactions</CardTitle>
            <CardDescription>Transaction volume over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="transactions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Daily revenue over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`₦${Number(value).toLocaleString()}`, "Revenue"]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Pie Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Distribution by gateway</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Status</CardTitle>
            <CardDescription>Breakdown by status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlatformAnalytics;
