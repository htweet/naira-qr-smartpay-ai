
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, TrendingUp, Shield, Zap, Users, CreditCard, BarChart3, Brain } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import MerchantDashboard from "@/components/MerchantDashboard";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import PaymentGatewayManager from "@/components/PaymentGatewayManager";
import AIAnalytics from "@/components/AIAnalytics";
import RevenueModel from "@/components/RevenueModel";
import FraudDetection from "@/components/FraudDetection";

const Index = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Simulate user authentication
  useEffect(() => {
    // In a real app, this would check for actual authentication
    const mockUser = {
      id: "merchant_001",
      name: "Adebayo's Electronics",
      email: "adebayo@electronics.ng",
      businessType: "Electronics Retail",
      subscriptionTier: "premium",
      registrationDate: "2024-01-15"
    };
    setCurrentUser(mockUser);
  }, []);

  const features = [
    {
      icon: <QrCode className="h-8 w-8 text-blue-500" />,
      title: "Dynamic QR Codes",
      description: "Generate customizable QR codes with your branding",
      benefits: ["Instant payment collection", "Brand recognition", "Security features"]
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-500" />,
      title: "AI-Powered Analytics",
      description: "Advanced insights and predictive analytics",
      benefits: ["Fraud detection", "Sales forecasting", "Customer behavior analysis"]
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: "Bank-Grade Security",
      description: "PCI DSS compliant with multi-layer protection",
      benefits: ["End-to-end encryption", "Real-time monitoring", "Fraud prevention"]
    },
    {
      icon: <CreditCard className="h-8 w-8 text-orange-500" />,
      title: "Multi-Gateway Support",
      description: "Integrated with Moniepoint, Opay, and Palmpay",
      benefits: ["Higher success rates", "Lower fees", "Customer preference"]
    }
  ];

  const revenueStreams = [
    {
      name: "Transaction Fees",
      rate: "0.5% - 1.5%",
      description: "Competitive rates per transaction",
      revenue: "₦2.5M/month"
    },
    {
      name: "Subscription Plans",
      rate: "₦5,000 - ₦50,000",
      description: "Monthly plans with advanced features",
      revenue: "₦8.2M/month"
    },
    {
      name: "Premium Analytics",
      rate: "₦15,000/month",
      description: "AI-powered business insights",
      revenue: "₦3.1M/month"
    },
    {
      name: "API Access",
      rate: "₦25,000/month",
      description: "Enterprise integration services",
      revenue: "₦1.8M/month"
    }
  ];

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <QrCode className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">PayQR Merchant</CardTitle>
            <CardDescription>Secure QR Payment Solutions for Nigerian Merchants</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setCurrentUser({ id: "demo" })} 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Access Demo Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <QrCode className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">PayQR Merchant</h1>
                <p className="text-sm text-gray-600">Advanced Payment Solutions</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {currentUser.subscriptionTier?.toUpperCase()} Plan
              </Badge>
              <div className="text-right">
                <p className="font-medium">{currentUser.name}</p>
                <p className="text-sm text-gray-600">{currentUser.businessType}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="qr-generator" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              QR Codes
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="ai-analytics" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Analytics
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Revenue
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Hero Section */}
            <div className="text-center py-12 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-xl text-white">
              <h2 className="text-4xl font-bold mb-4">Nigeria's Most Advanced QR Payment Platform</h2>
              <p className="text-xl mb-6 max-w-3xl mx-auto">
                Empowering merchants with AI-driven insights, multi-gateway integration, and comprehensive revenue optimization
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold">₦15.7B</div>
                  <div className="text-blue-100">Total Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">85,000+</div>
                  <div className="text-blue-100">Active Merchants</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">99.8%</div>
                  <div className="text-blue-100">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">2.1M</div>
                  <div className="text-blue-100">Monthly Transactions</div>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      {feature.icon}
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Revenue Model Overview */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Platform Revenue Model
                </CardTitle>
                <CardDescription>
                  Diversified revenue streams ensuring sustainable growth and merchant value
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {revenueStreams.map((stream, index) => (
                    <div key={index} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                      <h4 className="font-semibold text-gray-900">{stream.name}</h4>
                      <div className="text-2xl font-bold text-green-600 my-2">{stream.rate}</div>
                      <p className="text-sm text-gray-600 mb-2">{stream.description}</p>
                      <div className="text-sm font-medium text-blue-600">{stream.revenue}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">Total Monthly Recurring Revenue</h4>
                      <p className="text-sm text-gray-600">Projected based on current growth rate</p>
                    </div>
                    <div className="text-3xl font-bold text-green-600">₦15.6M</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard">
            <MerchantDashboard merchant={currentUser} />
          </TabsContent>

          <TabsContent value="qr-generator">
            <QRCodeGenerator merchant={currentUser} />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentGatewayManager merchant={currentUser} />
          </TabsContent>

          <TabsContent value="ai-analytics">
            <AIAnalytics merchant={currentUser} />
          </TabsContent>

          <TabsContent value="revenue">
            <RevenueModel merchant={currentUser} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
