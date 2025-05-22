import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Users, 
  Target,
  Zap,
  Crown,
  Star,
  Rocket,
  BarChart3,
  PieChart,
  Calendar
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface RevenueModelProps {
  merchant: any;
}

const RevenueModel = ({ merchant }: RevenueModelProps) => {
  const [revenueData, setRevenueData] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState("premium");

  useEffect(() => {
    // Comprehensive revenue model data
    const mockData = {
      platformRevenue: {
        totalMonthly: 15600000,
        growth: 28.5,
        streams: [
          {
            name: "Transaction Fees",
            amount: 2500000,
            percentage: 16.0,
            growth: 15.2,
            description: "0.5% - 1.5% per successful transaction",
            monthlyTransactions: 2100000,
            avgFeeRate: 0.85
          },
          {
            name: "Subscription Plans",
            amount: 8200000,
            percentage: 52.6,
            growth: 34.8,
            description: "Monthly recurring subscription revenue",
            activeSubscribers: 12400,
            avgRevenuePer: 661
          },
          {
            name: "Premium Analytics",
            amount: 3100000,
            percentage: 19.9,
            growth: 42.1,
            description: "AI-powered business intelligence",
            premiumUsers: 2890,
            avgRevenuePer: 1072
          },
          {
            name: "API Access & Integration",
            amount: 1800000,
            percentage: 11.5,
            growth: 18.7,
            description: "Enterprise integration services",
            apiClients: 145,
            avgRevenuePer: 12414
          }
        ],
        monthlyTrend: [
          { month: "Oct", total: 12100000, fees: 1800000, subs: 6200000, analytics: 2400000, api: 1700000 },
          { month: "Nov", total: 13500000, fees: 2100000, subs: 7100000, analytics: 2700000, api: 1600000 },
          { month: "Dec", total: 14800000, fees: 2300000, subs: 7800000, analytics: 2900000, api: 1800000 },
          { month: "Jan", total: 15600000, fees: 2500000, subs: 8200000, analytics: 3100000, api: 1800000 }
        ]
      },
      subscriptionPlans: [
        {
          id: "starter",
          name: "Starter",
          price: 5000,
          features: ["Basic QR Generation", "3 Payment Gateways", "Basic Analytics", "Email Support"],
          subscribers: 6800,
          revenue: 34000000,
          churnRate: 8.2,
          ltv: 45000,
          icon: <Star className="h-6 w-6" />
        },
        {
          id: "professional",
          name: "Professional", 
          price: 15000,
          features: ["Unlimited QR Codes", "Advanced Branding", "Real-time Analytics", "Priority Support", "Webhook Integration"],
          subscribers: 4200,
          revenue: 63000000,
          churnRate: 5.8,
          ltv: 125000,
          icon: <Rocket className="h-6 w-6" />
        },
        {
          id: "premium",
          name: "Premium",
          price: 35000,
          features: ["Everything in Pro", "AI Analytics", "Fraud Detection", "White-label Solution", "Dedicated Manager"],
          subscribers: 1400,
          revenue: 49000000,
          churnRate: 3.2,
          ltv: 280000,
          icon: <Crown className="h-6 w-6" />
        }
      ],
      merchantValueCreation: {
        avgMonthlyGMV: 2850000, // Gross Merchandise Value
        platformTakeRate: 0.85,
        merchantRetentionRate: 94.2,
        valueMetrics: [
          { metric: "Payment Success Rate", improvement: "+15.2%", value: "98.7%" },
          { metric: "Transaction Speed", improvement: "-2.3s", value: "1.8s avg" },
          { metric: "Cost Reduction", improvement: "-23%", value: "vs traditional POS" },
          { metric: "Revenue Growth", improvement: "+34%", value: "merchant avg" }
        ]
      },
      aiMonetization: {
        fraudPrevention: {
          monthlyRevenue: 850000,
          fraudBlocked: 45200000,
          savingsToMerchants: 15600000,
          accuracy: 97.8
        },
        predictiveAnalytics: {
          monthlyRevenue: 1200000,
          insights: 15600,
          revenueOptimization: 23400000,
          subscribers: 980
        },
        smartRouting: {
          monthlyRevenue: 650000,
          successRateImprovement: 12.5,
          costSavings: 3200000,
          transactions: 1800000
        }
      },
      projections: {
        yearOne: { revenue: 187200000, merchants: 85000, growth: 45 },
        yearTwo: { revenue: 298800000, merchants: 156000, growth: 60 },
        yearThree: { revenue: 447500000, merchants: 285000, growth: 50 }
      }
    };
    setRevenueData(mockData);
  }, []);

  if (!revenueData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff88'];

  return (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <Card className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">Platform Revenue Model</h2>
              <p className="text-green-100">Diversified, sustainable, and AI-enhanced revenue streams</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">₦{(revenueData.platformRevenue.totalMonthly / 1000000).toFixed(1)}M</div>
              <div className="text-green-100">Monthly Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">+{revenueData.platformRevenue.growth}%</div>
              <div className="text-green-100">Monthly Growth</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">85K+</div>
              <div className="text-green-100">Active Merchants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">₦2.1B</div>
              <div className="text-green-100">Monthly GMV</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="streams" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="streams">Revenue Streams</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="ai-monetization">AI Features</TabsTrigger>
          <TabsTrigger value="merchant-value">Merchant Value</TabsTrigger>
          <TabsTrigger value="projections">Projections</TabsTrigger>
        </TabsList>

        <TabsContent value="streams" className="space-y-6">
          {/* Revenue Streams Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {revenueData.platformRevenue.streams.map((stream: any, index: number) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    {stream.name}
                    <Badge variant="outline" className="text-green-600">
                      +{stream.growth}%
                    </Badge>
                  </CardTitle>
                  <CardDescription>{stream.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        ₦{(Number(stream.amount) / 1000000).toFixed(1)}M
                      </p>
                      <p className="text-sm text-gray-600">{stream.percentage}% of total</p>
                    </div>
                    <Progress value={stream.percentage} className="h-2" />
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600">Volume</p>
                        <p className="font-medium">
                          {stream.monthlyTransactions ? 
                            `${(Number(stream.monthlyTransactions) / 1000000).toFixed(1)}M txns` :
                            stream.activeSubscribers ? 
                            `${stream.activeSubscribers.toLocaleString()} subs` :
                            stream.premiumUsers ?
                            `${stream.premiumUsers.toLocaleString()} users` :
                            `${stream.apiClients} clients`
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Avg Revenue</p>
                        <p className="font-medium">
                          ₦{stream.avgRevenuePer?.toLocaleString() || stream.avgFeeRate}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Revenue Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue Trend by Stream</CardTitle>
              <CardDescription>Last 4 months revenue breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={revenueData.platformRevenue.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₦${(Number(value) / 1000000).toFixed(1)}M`, "Revenue"]} />
                  <Legend />
                  <Area type="monotone" dataKey="fees" stackId="1" stroke="#8884d8" fill="#8884d8" name="Transaction Fees" />
                  <Area type="monotone" dataKey="subs" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Subscriptions" />
                  <Area type="monotone" dataKey="analytics" stackId="1" stroke="#ffc658" fill="#ffc658" name="Analytics" />
                  <Area type="monotone" dataKey="api" stackId="1" stroke="#ff7300" fill="#ff7300" name="API Access" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-6">
          {/* Subscription Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {revenueData.subscriptionPlans.map((plan: any, index: number) => (
              <Card key={index} className={`hover:shadow-lg transition-all ${plan.id === 'premium' ? 'border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-blue-50' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {plan.icon}
                      <CardTitle>{plan.name}</CardTitle>
                    </div>
                    {plan.id === 'premium' && <Badge className="bg-purple-600">Most Popular</Badge>}
                  </div>
                  <div className="text-3xl font-bold">₦{plan.price.toLocaleString()}<span className="text-sm text-gray-600">/month</span></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <p className="text-sm text-gray-600">Subscribers</p>
                        <p className="font-bold">{plan.subscribers.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Monthly Revenue</p>
                        <p className="font-bold text-green-600">₦{(Number(plan.revenue) / 1000000).toFixed(1)}M</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Churn Rate</p>
                        <p className="font-bold">{plan.churnRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">LTV</p>
                        <p className="font-bold">₦{(plan.ltv / 1000).toFixed(0)}K</p>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      variant={plan.id === selectedPlan ? "default" : "outline"}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      {plan.id === selectedPlan ? "Current Plan" : "Switch Plan"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Subscription Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Distribution</CardTitle>
                <CardDescription>Revenue contribution by plan type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPieChart>
                    <Pie
                      data={revenueData.subscriptionPlans}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${(percentage || 0).toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="revenue"
                    >
                      {revenueData.subscriptionPlans.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`₦${(Number(value) / 1000000).toFixed(1)}M`, "Revenue"]} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subscription Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">₦661</p>
                    <p className="text-sm text-gray-600">ARPU (Monthly)</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">5.7%</p>
                    <p className="text-sm text-gray-600">Avg Churn Rate</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">₦150K</p>
                    <p className="text-sm text-gray-600">Avg Customer LTV</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">34.8%</p>
                    <p className="text-sm text-gray-600">Growth Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-monetization" className="space-y-6">
          {/* AI Revenue Streams */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-red-500" />
                  Fraud Prevention
                </CardTitle>
                <CardDescription>AI-powered security services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      ₦{(revenueData.aiMonetization.fraudPrevention.monthlyRevenue / 1000).toFixed(0)}K
                    </p>
                    <p className="text-sm text-gray-600">Monthly Revenue</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Fraud Blocked:</span>
                      <span className="font-medium">₦{(revenueData.aiMonetization.fraudPrevention.fraudBlocked / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Merchant Savings:</span>
                      <span className="font-medium">₦{(revenueData.aiMonetization.fraudPrevention.savingsToMerchants / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Accuracy:</span>
                      <span className="font-medium">{revenueData.aiMonetization.fraudPrevention.accuracy}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  Predictive Analytics
                </CardTitle>
                <CardDescription>Business intelligence insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      ₦{(revenueData.aiMonetization.predictiveAnalytics.monthlyRevenue / 1000).toFixed(0)}K
                    </p>
                    <p className="text-sm text-gray-600">Monthly Revenue</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Insights Generated:</span>
                      <span className="font-medium">{revenueData.aiMonetization.predictiveAnalytics.insights.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revenue Optimized:</span>
                      <span className="font-medium">₦{(revenueData.aiMonetization.predictiveAnalytics.revenueOptimization / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subscribers:</span>
                      <span className="font-medium">{revenueData.aiMonetization.predictiveAnalytics.subscribers}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-green-500" />
                  Smart Routing
                </CardTitle>
                <CardDescription>Intelligent payment optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      ₦{(revenueData.aiMonetization.smartRouting.monthlyRevenue / 1000).toFixed(0)}K
                    </p>
                    <p className="text-sm text-gray-600">Monthly Revenue</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Success Improvement:</span>
                      <span className="font-medium">+{revenueData.aiMonetization.smartRouting.successRateImprovement}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cost Savings:</span>
                      <span className="font-medium">₦{(revenueData.aiMonetization.smartRouting.costSavings / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Transactions:</span>
                      <span className="font-medium">{(revenueData.aiMonetization.smartRouting.transactions / 1000000).toFixed(1)}M</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI ROI Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>AI Feature ROI Analysis</CardTitle>
              <CardDescription>Return on investment for AI-powered features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-purple-600">₦2.7M</p>
                  <p className="text-sm text-gray-600">Total AI Revenue</p>
                  <p className="text-xs text-green-600 mt-1">+42% monthly growth</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">15:1</p>
                  <p className="text-sm text-gray-600">ROI Ratio</p>
                  <p className="text-xs text-green-600 mt-1">Value created vs cost</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">₦42M</p>
                  <p className="text-sm text-gray-600">Value Created</p>
                  <p className="text-xs text-green-600 mt-1">For merchants monthly</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
                  <p className="text-3xl font-bold text-orange-600">3,025</p>
                  <p className="text-sm text-gray-600">AI Users</p>
                  <p className="text-xs text-green-600 mt-1">+28% monthly growth</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="merchant-value" className="space-y-6">
          {/* Merchant Value Creation */}
          <Card>
            <CardHeader>
              <CardTitle>Value Creation for Merchants</CardTitle>
              <CardDescription>How the platform drives merchant success and justifies revenue share</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {revenueData.merchantValueCreation.valueMetrics.map((metric: any, index: number) => (
                  <div key={index} className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">{metric.metric}</p>
                    <p className="text-2xl font-bold text-blue-600 mb-1">{metric.value}</p>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      {metric.improvement}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Platform Economics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Economics</CardTitle>
                <CardDescription>Core financial metrics driving sustainable growth</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Monthly GMV</p>
                    <p className="text-2xl font-bold">₦{(revenueData.merchantValueCreation.avgMonthlyGMV / 1000000).toFixed(1)}B</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Platform Take Rate</p>
                    <p className="text-2xl font-bold">{revenueData.merchantValueCreation.platformTakeRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Merchant Retention</p>
                    <p className="text-2xl font-bold text-green-600">{revenueData.merchantValueCreation.merchantRetentionRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Net Revenue</p>
                    <p className="text-2xl font-bold text-purple-600">₦24.2M</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <h4 className="font-medium mb-2">Value Proposition</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• 15x ROI improvement over traditional payment systems</li>
                    <li>• 98.7% payment success rate vs 85% industry average</li>
                    <li>• 34% average merchant revenue growth within 6 months</li>
                    <li>• 23% reduction in payment processing costs</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Merchant Success Stories</CardTitle>
                <CardDescription>Real impact on merchant businesses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Electronics Retailer</p>
                      <p className="text-sm text-gray-600">Lagos State</p>
                    </div>
                  </div>
                  <p className="text-sm mb-2">Increased payment success rate from 82% to 97% using smart routing</p>
                  <Badge className="bg-green-100 text-green-700">+45% revenue growth</Badge>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Fashion Store</p>
                      <p className="text-sm text-gray-600">Abuja</p>
                    </div>
                  </div>
                  <p className="text-sm mb-2">Reduced checkout abandonment by 60% with optimized QR codes</p>
                  <Badge className="bg-blue-100 text-blue-700">+28% conversion rate</Badge>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Restaurant Chain</p>
                      <p className="text-sm text-gray-600">Port Harcourt</p>
                    </div>
                  </div>
                  <p className="text-sm mb-2">AI insights helped optimize menu pricing and peak hour staffing</p>
                  <Badge className="bg-purple-100 text-purple-700">+22% profit margin</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projections" className="space-y-6">
          {/* Growth Projections */}
          <Card>
            <CardHeader>
              <CardTitle>3-Year Growth Projections</CardTitle>
              <CardDescription>Revenue and merchant growth forecasts based on current trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Year 1 (2024)</p>
                  <p className="text-3xl font-bold text-blue-600 mb-1">₦187M</p>
                  <p className="text-sm text-gray-600">Annual Revenue</p>
                  <div className="mt-2">
                    <Badge className="bg-blue-100 text-blue-700">85K merchants</Badge>
                  </div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Year 2 (2025)</p>
                  <p className="text-3xl font-bold text-purple-600 mb-1">₦299M</p>
                  <p className="text-sm text-gray-600">Annual Revenue</p>
                  <div className="mt-2">
                    <Badge className="bg-purple-100 text-purple-700">156K merchants</Badge>
                  </div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Year 3 (2026)</p>
                  <p className="text-3xl font-bold text-green-600 mb-1">₦448M</p>
                  <p className="text-sm text-gray-600">Annual Revenue</p>
                  <div className="mt-2">
                    <Badge className="bg-green-100 text-green-700">285K merchants</Badge>
                  </div>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={[
                  { year: "2024", revenue: 187, merchants: 85, growth: 45 },
                  { year: "2025", revenue: 299, merchants: 156, growth: 60 },
                  { year: "2026", revenue: 448, merchants: 285, growth: 50 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={3} name="Revenue (₦M)" />
                  <Line yAxisId="right" type="monotone" dataKey="merchants" stroke="#82ca9d" strokeWidth={3} name="Merchants (K)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Market Opportunity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Opportunity</CardTitle>
                <CardDescription>Total addressable market analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Nigeria SME Market</span>
                    <span className="font-bold">41.5M businesses</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">Digital Payment Adoption</span>
                    <span className="font-bold">23% annually</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Target Market (TAM)</span>
                    <span className="font-bold">₦2.8T annually</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="font-medium">Our Potential Share</span>
                    <span className="font-bold">0.16% by 2026</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investment Requirements</CardTitle>
                <CardDescription>Capital needed to achieve projections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Technology Development</span>
                    <span className="font-bold">₦125M</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">Market Expansion</span>
                    <span className="font-bold">₦85M</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">AI/ML Infrastructure</span>
                    <span className="font-bold">₦45M</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="font-medium">Total Investment</span>
                    <span className="font-bold">₦255M</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <p className="text-sm font-medium">Projected ROI: 175% by Year 3</p>
                  <p className="text-xs text-gray-600">Break-even expected in Month 18</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RevenueModel;
