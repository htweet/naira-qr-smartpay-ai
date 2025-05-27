
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, Target, Calendar, Brain } from "lucide-react";

interface RevenueProjectionsProps {
  merchant: any;
}

const RevenueProjections = ({ merchant }: RevenueProjectionsProps) => {
  const projectionData = [
    { month: "Jan", actual: 1200000, projected: 1150000, optimistic: 1300000, conservative: 1100000 },
    { month: "Feb", actual: 1550000, projected: 1480000, optimistic: 1650000, conservative: 1350000 },
    { month: "Mar", actual: 1800000, projected: 1750000, optimistic: 1950000, conservative: 1600000 },
    { month: "Apr", actual: 2100000, projected: 2050000, optimistic: 2250000, conservative: 1900000 },
    { month: "May", actual: 2450000, projected: 2380000, optimistic: 2600000, conservative: 2200000 },
    { month: "Jun", actual: 2847500, projected: 2800000, optimistic: 3050000, conservative: 2600000 },
    { month: "Jul", projected: 3200000, optimistic: 3500000, conservative: 2950000 },
    { month: "Aug", projected: 3650000, optimistic: 4000000, conservative: 3350000 },
    { month: "Sep", projected: 4100000, optimistic: 4500000, conservative: 3750000 },
    { month: "Oct", projected: 4600000, optimistic: 5100000, conservative: 4200000 },
    { month: "Nov", projected: 5200000, optimistic: 5800000, conservative: 4750000 },
    { month: "Dec", projected: 5850000, optimistic: 6500000, conservative: 5350000 }
  ];

  const scenarios = [
    {
      name: "Conservative",
      value: "₦5.35M",
      probability: "85%",
      description: "Based on current growth patterns with market challenges",
      color: "text-orange-600"
    },
    {
      name: "Most Likely", 
      value: "₦5.85M",
      probability: "70%",
      description: "AI-predicted scenario based on historical data and trends",
      color: "text-blue-600"
    },
    {
      name: "Optimistic",
      value: "₦6.50M",
      probability: "40%",
      description: "Assuming successful execution of growth initiatives",
      color: "text-green-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarios.map((scenario, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{scenario.name} Scenario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold mb-1 ${scenario.color}`}>{scenario.value}</div>
              <Badge variant="outline" className="mb-2">
                {scenario.probability} probability
              </Badge>
              <p className="text-xs text-gray-600">{scenario.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Revenue Projection Chart
          </CardTitle>
          <CardDescription>12-month revenue forecast with confidence intervals</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}M`} />
              <Tooltip 
                formatter={(value, name) => [
                  `₦${(value as number / 1000000).toFixed(2)}M`,
                  name === 'actual' ? 'Actual' : 
                  name === 'projected' ? 'Projected' :
                  name === 'optimistic' ? 'Optimistic' : 'Conservative'
                ]}
              />
              <Area type="monotone" dataKey="optimistic" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
              <Area type="monotone" dataKey="conservative" stackId="2" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.1} />
              <Line type="monotone" dataKey="actual" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }} />
              <Line type="monotone" dataKey="projected" stroke="#8B5CF6" strokeWidth={2} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              AI Prediction Insights
            </CardTitle>
            <CardDescription>Machine learning analysis of revenue patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-1">Seasonal Patterns</h4>
                <p className="text-sm text-purple-700">Q4 typically shows 35% revenue increase. Model suggests similar pattern this year.</p>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-1">Growth Factors</h4>
                <p className="text-sm text-blue-700">Customer acquisition rate and transaction frequency are primary growth drivers.</p>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-1">Confidence Level</h4>
                <p className="text-sm text-green-700">94.2% accuracy on 6-month projections based on historical performance.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Revenue Targets
            </CardTitle>
            <CardDescription>Monthly and quarterly goals tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Q3 Target</h4>
                  <p className="text-sm text-gray-600">July - September</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">₦10.95M</p>
                  <p className="text-sm text-gray-600">78% achieved</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Q4 Target</h4>
                  <p className="text-sm text-gray-600">October - December</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">₦15.75M</p>
                  <p className="text-sm text-gray-600">Projected</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Annual Target</h4>
                  <p className="text-sm text-gray-600">2024 Full Year</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-purple-600">₦45.0M</p>
                  <p className="text-sm text-gray-600">68% achieved</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RevenueProjections;
