
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Users, TrendingUp, Calendar } from "lucide-react";

interface SubscriptionRevenueProps {
  merchant: any;
}

const SubscriptionRevenue = ({ merchant }: SubscriptionRevenueProps) => {
  const subscriptionTiers = [
    {
      name: "Basic Plan",
      subscribers: 145,
      revenue: "₦45,000",
      price: "₦310/month",
      growth: "+12%"
    },
    {
      name: "Pro Plan", 
      subscribers: 89,
      revenue: "₦89,000",
      price: "₦1,000/month",
      growth: "+25%"
    },
    {
      name: "Enterprise",
      subscribers: 12,
      revenue: "₦156,000",
      price: "₦13,000/month",
      growth: "+40%"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">246</div>
            <p className="text-sm text-green-600">+18.2% this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦290,000</div>
            <p className="text-sm text-green-600">+23.5% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Revenue Per User</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦1,179</div>
            <p className="text-sm text-green-600">+5.8% this month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Subscription Tiers Performance
          </CardTitle>
          <CardDescription>Revenue breakdown by subscription plans</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscriptionTiers.map((tier, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{tier.name}</h4>
                    <p className="text-sm text-gray-600">{tier.price}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">{tier.subscribers} subscribers</p>
                    <p className="text-sm text-gray-600">{tier.revenue}/month</p>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    {tier.growth}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Insights</CardTitle>
          <CardDescription>Key metrics and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Growth Opportunity</h4>
              <p className="text-sm text-green-700">Enterprise tier showing 40% growth. Consider expanding enterprise features.</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Retention Rate</h4>
              <p className="text-sm text-blue-700">94.2% monthly retention rate. Excellent customer satisfaction.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionRevenue;
