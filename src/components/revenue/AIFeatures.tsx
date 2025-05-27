
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Zap, Target, TrendingUp, Users, BarChart3 } from "lucide-react";

interface AIFeaturesProps {
  merchant: any;
}

const AIFeatures = ({ merchant }: AIFeaturesProps) => {
  const aiFeatures = [
    {
      name: "Fraud Detection",
      usage: 89,
      revenue: "₦125,000",
      prevented: "₦2,340,000",
      icon: <Brain className="h-5 w-5" />,
      status: "Active"
    },
    {
      name: "Customer Insights",
      usage: 76,
      revenue: "₦89,500",
      value: "23% conversion boost",
      icon: <Users className="h-5 w-5" />,
      status: "Active"
    },
    {
      name: "Revenue Predictions",
      usage: 92,
      revenue: "₦67,000",
      accuracy: "94.2% accuracy",
      icon: <TrendingUp className="h-5 w-5" />,
      status: "Active"
    },
    {
      name: "Smart Analytics",
      usage: 85,
      revenue: "₦78,500",
      insights: "1,245 insights generated",
      icon: <BarChart3 className="h-5 w-5" />,
      status: "Active"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {aiFeatures.map((feature, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                  {feature.icon}
                </div>
                <Badge variant="outline" className="text-green-600">
                  {feature.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-medium text-sm mb-2">{feature.name}</h3>
              <p className="text-lg font-bold mb-2">{feature.revenue}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Usage</span>
                  <span>{feature.usage}%</span>
                </div>
                <Progress value={feature.usage} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            AI Revenue Impact
          </CardTitle>
          <CardDescription>How AI features contribute to your bottom line</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-1">Total AI Revenue</h4>
                <p className="text-2xl font-bold text-purple-700">₦360,000</p>
                <p className="text-sm text-purple-600">+28% this month</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-1">Fraud Prevention Savings</h4>
                <p className="text-2xl font-bold text-green-700">₦2,340,000</p>
                <p className="text-sm text-green-600">Losses prevented</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-1">Efficiency Gains</h4>
                <p className="text-2xl font-bold text-blue-700">67%</p>
                <p className="text-sm text-blue-600">Time saved on analysis</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Feature Performance</h4>
              <div className="space-y-3">
                {aiFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                        {feature.icon}
                      </div>
                      <div>
                        <h5 className="font-medium">{feature.name}</h5>
                        <p className="text-sm text-gray-600">
                          {feature.prevented && `Prevented: ${feature.prevented}`}
                          {feature.value && feature.value}
                          {feature.accuracy && feature.accuracy}
                          {feature.insights && feature.insights}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{feature.revenue}</p>
                      <p className="text-sm text-gray-600">{feature.usage}% usage</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIFeatures;
