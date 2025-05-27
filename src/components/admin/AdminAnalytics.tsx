
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const AdminAnalytics = () => {
  const transactionData = [
    { month: 'Jan', volume: 4000000, count: 240 },
    { month: 'Feb', volume: 5200000, count: 320 },
    { month: 'Mar', volume: 4800000, count: 290 },
    { month: 'Apr', volume: 6100000, count: 380 },
    { month: 'May', volume: 7200000, count: 450 },
    { month: 'Jun', volume: 8500000, count: 520 },
  ];

  const gatewayUsage = [
    { name: 'Moniepoint', value: 45, color: '#3B82F6' },
    { name: 'Opay', value: 32, color: '#10B981' },
    { name: 'Palmpay', value: 23, color: '#F59E0B' },
  ];

  const userGrowth = [
    { month: 'Jan', merchants: 15, customers: 120 },
    { month: 'Feb', merchants: 22, customers: 180 },
    { month: 'Mar', merchants: 28, customers: 240 },
    { month: 'Apr', merchants: 35, customers: 320 },
    { month: 'May', merchants: 42, customers: 410 },
    { month: 'Jun', merchants: 48, customers: 520 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">₦23.8M</div>
            <p className="text-xs text-muted-foreground">Total Transaction Volume</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">2,221</div>
            <p className="text-xs text-muted-foreground">Total Transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">Active Merchants</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">520</div>
            <p className="text-xs text-muted-foreground">Active Customers</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Volume</CardTitle>
            <CardDescription>Monthly transaction volume and count</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={transactionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₦${(value as number).toLocaleString()}`} />
                <Bar dataKey="volume" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gateway Usage Distribution</CardTitle>
            <CardDescription>Payment gateway usage by percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gatewayUsage}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {gatewayUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Monthly growth of merchants and customers</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="merchants" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="customers" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
