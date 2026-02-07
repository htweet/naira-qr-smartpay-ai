import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatsCard from "@/components/admin/StatsCard";
import DataTable from "@/components/admin/DataTable";
import { supabase } from "@/integrations/supabase/client";
import {
  DollarSign,
  Store,
  Users,
  CreditCard,
  TrendingUp,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface PlatformStats {
  totalRevenue: number;
  totalMerchants: number;
  totalCustomers: number;
  totalTransactions: number;
  successRate: number;
}

interface Transaction {
  id: string;
  amount: number;
  status: string;
  merchant_id: string;
  created_at: string;
}

interface Merchant {
  id: string;
  business_name: string;
  status: string;
  total_revenue: number;
  total_transactions: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<PlatformStats>({
    totalRevenue: 0,
    totalMerchants: 0,
    totalCustomers: 0,
    totalTransactions: 0,
    successRate: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [topMerchants, setTopMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch merchants
        const { data: merchants } = await supabase
          .from("merchants")
          .select("*")
          .order("total_revenue", { ascending: false });

        // Fetch customers
        const { data: customers } = await supabase
          .from("customers")
          .select("id");

        // Fetch transactions
        const { data: transactions } = await supabase
          .from("transactions")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100);

        const txList = transactions || [];
        const completedTx = txList.filter((tx) => tx.status === "completed");
        const totalRevenue = completedTx.reduce((sum, tx) => sum + Number(tx.amount), 0);
        const successRate = txList.length > 0 
          ? (completedTx.length / txList.length) * 100 
          : 0;

        setStats({
          totalRevenue,
          totalMerchants: merchants?.length || 0,
          totalCustomers: customers?.length || 0,
          totalTransactions: txList.length,
          successRate: Math.round(successRate * 10) / 10,
        });

        setRecentTransactions(txList.slice(0, 10));
        setTopMerchants((merchants || []).slice(0, 5));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const transactionColumns = [
    { key: "id", label: "ID", render: (value: unknown) => String(value).slice(0, 8) },
    {
      key: "amount",
      label: "Amount",
      render: (value: unknown) => `₦${Number(value).toLocaleString()}`,
    },
    {
      key: "status",
      label: "Status",
      render: (value: unknown) => (
        <Badge
          variant={
            value === "completed"
              ? "default"
              : value === "pending"
              ? "secondary"
              : "destructive"
          }
        >
          {String(value)}
        </Badge>
      ),
    },
    {
      key: "created_at",
      label: "Date",
      render: (value: unknown) =>
        new Date(String(value)).toLocaleDateString(),
    },
  ];

  // Chart data
  const revenueData = [
    { name: "Mon", revenue: 45000 },
    { name: "Tue", revenue: 52000 },
    { name: "Wed", revenue: 48000 },
    { name: "Thu", revenue: 61000 },
    { name: "Fri", revenue: 55000 },
    { name: "Sat", revenue: 72000 },
    { name: "Sun", revenue: 58000 },
  ];

  const statusDistribution = [
    { name: "Completed", value: 75, color: "hsl(var(--chart-1))" },
    { name: "Pending", value: 15, color: "hsl(var(--chart-2))" },
    { name: "Failed", value: 10, color: "hsl(var(--chart-3))" },
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
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the PayQR Admin Panel
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={`₦${stats.totalRevenue.toLocaleString()}`}
          change={12.5}
          icon={DollarSign}
          iconColor="text-emerald-600"
          bgColor="bg-emerald-100"
          subtitle="vs last month"
        />
        <StatsCard
          title="Active Merchants"
          value={stats.totalMerchants}
          change={8.2}
          icon={Store}
          iconColor="text-blue-600"
          bgColor="bg-blue-100"
          subtitle="vs last month"
        />
        <StatsCard
          title="Total Customers"
          value={stats.totalCustomers}
          change={15.3}
          icon={Users}
          iconColor="text-purple-600"
          bgColor="bg-purple-100"
          subtitle="vs last month"
        />
        <StatsCard
          title="Success Rate"
          value={`${stats.successRate}%`}
          change={2.1}
          icon={Activity}
          iconColor="text-amber-600"
          bgColor="bg-amber-100"
          subtitle="vs last month"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Daily revenue over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
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

        <Card>
          <CardHeader>
            <CardTitle>Transaction Status</CardTitle>
            <CardDescription>Distribution of transaction statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest platform transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={transactionColumns as Array<{ key: string; label: string; render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode }>}
            data={recentTransactions as unknown as Record<string, unknown>[]}
            searchable={false}
            pageSize={5}
          />
        </CardContent>
      </Card>

      {/* Top Merchants */}
      <Card>
        <CardHeader>
          <CardTitle>Top Merchants</CardTitle>
          <CardDescription>Highest revenue generating merchants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topMerchants.map((merchant, index) => (
              <div
                key={merchant.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{merchant.business_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {merchant.total_transactions || 0} transactions
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    ₦{(merchant.total_revenue || 0).toLocaleString()}
                  </p>
                  <Badge variant={merchant.status === "active" ? "default" : "secondary"}>
                    {merchant.status}
                  </Badge>
                </div>
              </div>
            ))}
            {topMerchants.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No merchants found
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
