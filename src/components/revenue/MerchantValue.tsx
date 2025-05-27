
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, Users, Target, Star, Award } from "lucide-react";

interface MerchantValueProps {
  merchant: any;
}

const MerchantValue = ({ merchant }: MerchantValueProps) => {
  const valueMetrics = [
    {
      title: "Customer Lifetime Value",
      value: "₦45,670",
      change: "+18.5%",
      description: "Average value per customer over their lifetime"
    },
    {
      title: "Monthly Active Customers",
      value: "1,284",
      change: "+12.3%",
      description: "Customers who made at least one transaction"
    },
    {
      title: "Average Transaction Size",
      value: "₦15,450",
      change: "+8.7%",
      description: "Mean transaction amount across all payments"
    },
    {
      title: "Customer Acquisition Cost",
      value: "₦2,340",
      change: "-15.2%",
      description: "Cost to acquire a new paying customer"
    }
  ];

  const customerSegments = [
    {
      segment: "Premium Customers",
      count: 89,
      value: "₦1,245,000",
      percentage: 68
    },
    {
      segment: "Regular Customers", 
      count: 456,
      value: "₦485,000",
      percentage: 26
    },
    {
      segment: "New Customers",
      count: 234,
      value: "₦117,500",
      percentage: 6
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {valueMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{metric.value}</div>
              <Badge variant="outline" className={metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                {metric.change}
              </Badge>
              <p className="text-xs text-gray-600 mt-2">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Customer Segmentation
            </CardTitle>
            <CardDescription>Revenue contribution by customer tier</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customerSegments.map((segment, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{segment.segment}</h4>
                    <p className="text-sm text-gray-600">{segment.count} customers</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{segment.value}</p>
                    <p className="text-sm text-gray-600">{segment.percentage}% of revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Business Health Score
            </CardTitle>
            <CardDescription>Overall business performance rating</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-green-600 mb-2">A+</div>
              <div className="text-lg font-medium mb-1">Excellent Performance</div>
              <p className="text-sm text-gray-600">Based on 12 key metrics</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Revenue Growth</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '92%'}}></div>
                  </div>
                  <span className="text-sm font-medium">92%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Customer Satisfaction</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '89%'}}></div>
                  </div>
                  <span className="text-sm font-medium">89%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Payment Success Rate</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '96%'}}></div>
                  </div>
                  <span className="text-sm font-medium">96%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Value Optimization Recommendations</CardTitle>
          <CardDescription>AI-powered suggestions to increase customer value</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-medium text-blue-900 mb-2">Upsell Opportunity</h4>
              <p className="text-sm text-blue-700 mb-2">234 customers are eligible for premium plan upgrade. Potential additional revenue: ₦456,000/month</p>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">View Eligible Customers</Button>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <h4 className="font-medium text-green-900 mb-2">Retention Focus</h4>
              <p className="text-sm text-green-700 mb-2">67 high-value customers show signs of decreased activity. Early intervention could retain ₦234,000 in revenue.</p>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">Launch Retention Campaign</Button>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
              <h4 className="font-medium text-purple-900 mb-2">Cross-sell Potential</h4>
              <p className="text-sm text-purple-700 mb-2">AI analytics suggest 156 customers would benefit from additional payment features.</p>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">View Recommendations</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MerchantValue;
