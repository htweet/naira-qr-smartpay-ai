
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

interface RevenueChartsProps {
  merchant: any;
}

const RevenueCharts = ({ merchant }: RevenueChartsProps) => {
  const monthlyData = [
    { month: "Jan", revenue: 1200000, transactions: 450 },
    { month: "Feb", revenue: 1550000, transactions: 620 },
    { month: "Mar", revenue: 1800000, transactions: 780 },
    { month: "Apr", revenue: 2100000, transactions: 920 },
    { month: "May", revenue: 2450000, transactions: 1150 },
    { month: "Jun", revenue: 2847500, transactions: 1284 },
  ];

  const paymentMethodData = [
    { name: "Bank Transfer", value: 45, color: "#3B82F6" },
    { name: "Card Payment", value: 35, color: "#10B981" },
    { name: "USSD", value: 15, color: "#F59E0B" },
    { name: "Mobile Wallet", value: 5, color: "#EF4444" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>Monthly revenue and transaction growth</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                name === 'revenue' ? `₦${value.toLocaleString()}` : value,
                name === 'revenue' ? 'Revenue' : 'Transactions'
              ]} />
              <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="transactions" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Revenue distribution by payment method</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentMethodData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
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
    </div>
  );
};

export default RevenueCharts;
