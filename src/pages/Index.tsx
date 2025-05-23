
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, TrendingUp, Shield, Zap, Users, CreditCard, BarChart3, Brain, ArrowRight, ChevronDown, Scan, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import MerchantDashboard from "@/components/MerchantDashboard";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import PaymentGatewayManager from "@/components/PaymentGatewayManager";
import AIAnalytics from "@/components/AIAnalytics";
import RevenueModel from "@/components/RevenueModel";
import FraudDetection from "@/components/FraudDetection";
import Footer from "@/components/Footer";
import QRScanner from "@/components/customer/QRScanner";
import PaymentProcessorConfig from "@/components/api/PaymentProcessorConfig";
import { useAuth } from "@/contexts/AuthContext";
import { trackEvent, trackConversion } from "@/utils/tracker";
import { useNavigate } from "react-router-dom";
import PricingPlans from "@/components/PricingPlans";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user, loading, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'merchant' | 'customer'>('merchant');

  useEffect(() => {
    // Track page view
    trackEvent({
      eventType: "page_view",
      eventData: { page: "home" }
    });

    // Determine user type from metadata
    if (user?.user_metadata?.user_type) {
      setUserType(user.user_metadata.user_type);
    }
  }, [user]);

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

  const handleGetStarted = () => {
    trackConversion("cta_click", 0, "homepage_hero");
    navigate("/signup");
  };

  const handleDemoClick = () => {
    toast({
      title: "Demo access granted",
      description: "You now have access to the demo dashboard",
    });
    trackConversion("demo_access");
    setActiveTab("dashboard");
  };

  // If not logged in, show landing page
  if (!isAuthenticated && !loading) {
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
                  <h1 className="text-xl font-bold">PayQR</h1>
                  <p className="text-sm text-gray-600">Payment Solutions</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/signin")}
                >
                  Sign In
                </Button>
                <Button 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main>
          {/* Hero Section */}
          <section className="py-20 px-4">
            <div className="container mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Accept Payments <span className="text-blue-600">Anywhere</span> with QR Technology
              </h1>
              <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
                Nigeria's most advanced QR payment platform with AI analytics, multi-gateway support, and powerful business tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  onClick={handleGetStarted}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={handleDemoClick}
                >
                  View Demo
                </Button>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                <div>
                  <p className="text-4xl font-bold mb-2">₦15.7B+</p>
                  <p className="text-blue-100">Transactions Processed</p>
                </div>
                <div>
                  <p className="text-4xl font-bold mb-2">85,000+</p>
                  <p className="text-blue-100">Active Merchants</p>
                </div>
                <div>
                  <p className="text-4xl font-bold mb-2">99.8%</p>
                  <p className="text-blue-100">Platform Uptime</p>
                </div>
                <div>
                  <p className="text-4xl font-bold mb-2">2.1M</p>
                  <p className="text-blue-100">Monthly Transactions</p>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 px-4">
            <div className="container mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Nigerian Merchants</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Our platform combines cutting-edge technology with local payment expertise to help your business thrive.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <Card key={index} className="group hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm h-full">
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
            </div>
          </section>

          {/* Pricing Section */}
          <section className="py-20 px-4 bg-gray-50">
            <div className="container mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Choose the plan that fits your business needs
                </p>
              </div>
              
              <PricingPlans />
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white">
            <div className="container mx-auto max-w-4xl text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Payment Experience?</h2>
              <p className="text-xl mb-8 text-blue-100">
                Join thousands of Nigerian merchants who trust PayQR for their payment needs.
              </p>
              <Button 
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={handleGetStarted}
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  // If loading, show loading indicator
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // If authenticated, show appropriate dashboard based on user type
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
                <h1 className="text-xl font-bold">
                  PayQR {userType === 'customer' ? 'Customer' : 'Merchant'}
                </h1>
                <p className="text-sm text-gray-600">
                  {userType === 'customer' ? 'Mobile Payment Solution' : 'Advanced Payment Solutions'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {user?.user_metadata?.subscriptionTier || "Free"} Plan
              </Badge>
              <div className="text-right">
                <p className="font-medium">{user?.user_metadata?.business_name || user?.email}</p>
                <p className="text-sm text-gray-600 capitalize">{userType}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={signOut}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {userType === 'customer' ? (
          // Customer Interface
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-white/50 backdrop-blur-sm">
              <TabsTrigger value="scanner" className="flex items-center gap-2">
                <Scan className="h-4 w-4" />
                QR Scanner
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                My Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scanner">
              <QRScanner />
            </TabsContent>

            <TabsContent value="analytics">
              <AIAnalytics merchant={user} userType="customer" />
            </TabsContent>
          </Tabs>
        ) : (
          // Merchant Interface
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-7 bg-white/50 backdrop-blur-sm">
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
              <TabsTrigger value="api-config" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                API Config
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
              <PricingPlans className="mt-8" />
            </TabsContent>

            <TabsContent value="dashboard">
              <MerchantDashboard merchant={user} />
            </TabsContent>

            <TabsContent value="qr-generator">
              <QRCodeGenerator merchant={user} />
            </TabsContent>

            <TabsContent value="payments">
              <PaymentGatewayManager merchant={user} />
            </TabsContent>

            <TabsContent value="ai-analytics">
              <AIAnalytics merchant={user} userType="merchant" />
            </TabsContent>

            <TabsContent value="revenue">
              <RevenueModel merchant={user} />
            </TabsContent>

            <TabsContent value="api-config">
              <PaymentProcessorConfig />
            </TabsContent>
          </Tabs>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Index;
