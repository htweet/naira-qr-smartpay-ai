
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Users, BarChart3 } from "lucide-react";

interface RevenueOverviewProps {
  merchant: any;
}

const RevenueOverview = ({ merchant }: RevenueOverviewProps) => {
  const revenueMetrics = [
    {
      title: "Monthly Revenue",
      value: "₦2,847,500",
      change: "+23.5%",
      icon: <DollarSign className="h-6 w-6" />,
      color: "text-green-500"
    },
    {
      title: "Active Customers",
      value: "1,284",
      change: "+12.8%",
      icon: <Users className="h-6 w-6" />,
      color: "text-blue-500"
    },
    {
      title: "Avg. Transaction",
      value: "₦15,450",
      change: "+8.2%",
      icon: <BarChart3 className="h-6 w-6" />,
      color: "text-purple-500"
    },
    {
      title: "Growth Rate",
      value: "18.7%",
      change: "+4.1%",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "text-orange-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {revenueMetrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <div className={metric.color}>{metric.icon}</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-green-600">{metric.change} from last month</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RevenueOverview;
