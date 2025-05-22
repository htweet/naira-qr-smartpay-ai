
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShieldCheck, 
  AlertTriangle,
  Target,
  Lightbulb,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface AIAnalyticsProps {
  merchant: any;
}

const AIAnalytics = ({ merchant }: AIAnalyticsProps) => {
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d");

  useEffect(() => {
    // Simulate AI-powered analytics data
    const mockData = {
      insights: [
        {
          type: "revenue_opportunity",
          title: "Revenue Optimization Opportunity",
          description: "Peak transaction hours are 2-4 PM. Consider promotional campaigns during this time.",
          impact: "+18% potential revenue increase",
          confidence: 87,
          action: "Schedule targeted promotions"
        },
        {
          type: "customer_behavior",
          title: "Customer Behavior Pattern",
          description: "Customers prefer Moniepoint for transactions above ₦50,000.",
          impact: "Higher success rate for large payments",
          confidence: 93,
          action: "Route high-value payments to Moniepoint"
        },
        {
          type: "fraud_alert",
          title: "Fraud Risk Assessment",
          description: "Unusual transaction patterns detected from new customer segments.",
          impact: "Medium risk level",
          confidence: 78,
          action: "Enable additional verification"
        },
        {
          type: "seasonal_trend",
          title: "Seasonal Trend Analysis",
          description: "Expected 35% increase in transactions during upcoming weekend.",
          impact: "Prepare for higher volume",
          confidence: 91,
          action: "Scale infrastructure"
        }
      ],
      predictiveAnalytics: {
        revenueForecasting: [
          { month: "Jan", actual: 2450000, predicted: 2500000 },
          { month: "Feb", actual: 2680000, predicted: 2650000 },
          { month: "Mar", actual: 2890000, predicted: 2850000 },
          { month: "Apr", actual: null, predicted: 3100000 },
          { month: "May", actual: null, predicted: 3350000 },
          { month: "Jun", actual: null, predicted: 3600000 }
        ],
        customerSegmentation: [
          { segment: "High Value", count: 145, revenue: 1800000, color: "#8884d8" },
          { segment: "Regular", count: 823, revenue: 650000, color: "#82ca9d" },
          { segment: "Occasional", count: 456, revenue: 180000, color: "#ffc658" },
          { segment: "New", count: 234, revenue: 95000, color: "#ff7300" }
        ],
        churnRisk: [
          { risk: "Low", count: 892, percentage: 68 },
          { risk: "Medium", count: 312, percentage: 24 },
          { risk: "High", count: 104, percentage: 8 }
        ]
      },
      fraudDetection: {
        riskScore: 23, // Out of 100
        threatsBlocked: 12,
        suspiciousTransactions: 8,
        falsePositives: 2,
        recentAlerts: [
          { time: "2 hours ago", type: "Velocity Check", status: "blocked", amount: 150000 },
          { time: "4 hours ago", type: "Device Fingerprint", status: "flagged", amount: 75000 },
          { time: "6 hours ago", type: "Geo-location", status: "reviewed", amount: 45000 },
          { time: "1 day ago", type: "Pattern Analysis", status: "cleared", amount: 125000 }
        ]
      },
      performanceOptimization: {
        conversionRate: 87.3,
        averageTransactionValue: 45600,
        peakHours: [
          { hour: "9 AM", conversion: 78 },
          { hour: "12 PM", conversion: 89 },
          { hour: "3 PM", conversion: 94 },
          { hour: "6 PM", conversion: 85 },
          { hour: "9 PM", conversion: 67 }
        ],
        gatewayPerformance: [
          { gateway: "Moniepoint", score: 94, recommendation: "Optimal" },
          { gateway: "Opay", score: 87, recommendation: "Good" },
          { gateway: "Palmpay", score: 73, recommendation: "Needs Improvement" }
        ]
      }
    };
    setAiInsights(mockData);
  }, [selectedTimeframe]);

  if (!aiInsights) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-gray-600">AI is analyzing your data...</p>
        </div>
      </div>
    );
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "revenue_opportunity":
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case "customer_behavior":
        return <Users className="h-5 w-5 text-blue-500" />;
      case "fraud_alert":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "seasonal_trend":
        return <BarChart3 className="h-5 w-5 text-purple-500" />;
      default:
        return <Lightbulb className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "text-green-600 bg-green-50";
      case "Medium": return "text-yellow-600 bg-yellow-50";
      case "High": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <Card className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">AI-Powered Business Intelligence</h2>
              <p className="text-purple-100">Advanced analytics and predictive insights for your business</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">94%</div>
              <div className="text-purple-100">Prediction Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">+₦2.1M</div>
              <div className="text-purple-100">Revenue Opportunity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">12</div>
              <div className="text-purple-100">Threats Blocked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">87%</div>
              <div className="text-purple-100">Optimization Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="predictive" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Predictive Analytics
          </TabsTrigger>
          <TabsTrigger value="fraud" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Fraud Detection
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          {/* Key Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiInsights.insights.map((insight: any, index: number) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getInsightIcon(insight.type)}
                      <div>
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {insight.confidence}% confidence
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">{insight.description}</p>
                  <div className="bg-gray-50 p-3 rounded-lg mb-3">
                    <p className="font-medium text-green-600">{insight.impact}</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    {insight.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-6">
          {/* Revenue Forecasting */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Forecasting</CardTitle>
              <CardDescription>AI-powered 6-month revenue predictions</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={aiInsights.predictiveAnalytics.revenueForecasting}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₦${value?.toLocaleString()}`, "Revenue"]} />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="Actual Revenue"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Predicted Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Segmentation */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Segmentation Analysis</CardTitle>
                <CardDescription>AI-identified customer segments by value</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPieChart>
                    <Pie
                      data={aiInsights.predictiveAnalytics.customerSegmentation}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ segment, percentage }) => `${segment}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {aiInsights.predictiveAnalytics.customerSegmentation.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Churn Risk Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Churn Risk</CardTitle>
                <CardDescription>AI-powered churn prediction analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiInsights.predictiveAnalytics.churnRisk.map((risk: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge className={getRiskColor(risk.risk)}>
                        {risk.risk} Risk
                      </Badge>
                      <span className="font-medium">{risk.count} customers</span>
                    </div>
                    <div className="text-right">
                      <Progress value={risk.percentage} className="w-24" />
                      <span className="text-sm text-gray-600">{risk.percentage}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fraud" className="space-y-6">
          {/* Fraud Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-blue-50">
              <CardContent className="p-4 text-center">
                <ShieldCheck className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{aiInsights.fraudDetection.riskScore}</p>
                <p className="text-sm text-gray-600">Risk Score (Low)</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
              <CardContent className="p-4 text-center">
                <Activity className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{aiInsights.fraudDetection.threatsBlocked}</p>
                <p className="text-sm text-gray-600">Threats Blocked</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50">
              <CardContent className="p-4 text-center">
                <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-600">{aiInsights.fraudDetection.suspiciousTransactions}</p>
                <p className="text-sm text-gray-600">Under Review</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">{aiInsights.fraudDetection.falsePositives}</p>
                <p className="text-sm text-gray-600">False Positives</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Fraud Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Alerts</CardTitle>
              <CardDescription>Real-time fraud detection and prevention activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiInsights.fraudDetection.recentAlerts.map((alert: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        alert.status === "blocked" ? "bg-red-500" :
                        alert.status === "flagged" ? "bg-yellow-500" :
                        alert.status === "reviewed" ? "bg-blue-500" : "bg-green-500"
                      }`} />
                      <div>
                        <p className="font-medium">{alert.type}</p>
                        <p className="text-sm text-gray-600">{alert.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₦{alert.amount.toLocaleString()}</p>
                      <Badge variant="outline" className={
                        alert.status === "blocked" ? "border-red-200 text-red-600" :
                        alert.status === "flagged" ? "border-yellow-200 text-yellow-600" :
                        alert.status === "reviewed" ? "border-blue-200 text-blue-600" : 
                        "border-green-200 text-green-600"
                      }>
                        {alert.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          {/* Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Rate by Hour</CardTitle>
                <CardDescription>Optimize timing for maximum conversions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={aiInsights.performanceOptimization.peakHours}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="conversion" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gateway Performance Scores</CardTitle>
                <CardDescription>AI-calculated optimization recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiInsights.performanceOptimization.gatewayPerformance.map((gateway: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{gateway.gateway}</p>
                      <p className="text-sm text-gray-600">{gateway.recommendation}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{gateway.score}</p>
                      <Progress value={gateway.score} className="w-20" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Key Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Current optimization levels and targets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Conversion Rate</span>
                      <span className="text-2xl font-bold text-green-600">
                        {aiInsights.performanceOptimization.conversionRate}%
                      </span>
                    </div>
                    <Progress value={aiInsights.performanceOptimization.conversionRate} />
                    <p className="text-sm text-gray-600 mt-1">Target: 90%</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Avg. Transaction Value</span>
                      <span className="text-2xl font-bold text-blue-600">
                        ₦{aiInsights.performanceOptimization.averageTransactionValue.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-green-600">+12% from last month</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">AI Recommendations</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      Route high-value payments through Moniepoint
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      Enable smart retry for failed payments
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      Optimize QR code placement for peak hours
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIAnalytics;
