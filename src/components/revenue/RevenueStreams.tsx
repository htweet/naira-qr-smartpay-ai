
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, CreditCard, QrCode, Users, Globe } from "lucide-react";

interface RevenueStreamsProps {
  merchant: any;
}

const RevenueStreams = ({ merchant }: RevenueStreamsProps) => {
  const revenueStreams = [
    {
      name: "QR Code Payments",
      amount: "₦1,245,000",
      percentage: 68,
      growth: "+15.2%",
      icon: <QrCode className="h-5 w-5" />,
      color: "bg-blue-500"
    },
    {
      name: "Direct Card Payments",
      amount: "₦485,000",
      percentage: 26,
      growth: "+8.7%",
      icon: <CreditCard className="h-5 w-5" />,
      color: "bg-green-500"
    },
    {
      name: "Subscription Fees",
      amount: "₦89,500",
      percentage: 5,
      growth: "+32.1%",
      icon: <Users className="h-5 w-5" />,
      color: "bg-purple-500"
    },
    {
      name: "API Integration",
      amount: "₦28,000",
      percentage: 1,
      growth: "+45.3%",
      icon: <Globe className="h-5 w-5" />,
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {revenueStreams.map((stream, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${stream.color} text-white`}>
                  {stream.icon}
                </div>
                <Badge variant="outline" className="text-green-600">
                  {stream.growth}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-medium text-sm mb-2">{stream.name}</h3>
              <p className="text-2xl font-bold mb-2">{stream.amount}</p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Share</span>
                  <span>{stream.percentage}%</span>
                </div>
                <Progress value={stream.percentage} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Stream Performance</CardTitle>
          <CardDescription>Monthly breakdown and growth trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {revenueStreams.map((stream, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stream.color} text-white`}>
                    {stream.icon}
                  </div>
                  <div>
                    <h4 className="font-medium">{stream.name}</h4>
                    <p className="text-sm text-gray-600">Primary revenue source</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{stream.amount}</p>
                  <p className="text-sm text-green-600">{stream.growth}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueStreams;
