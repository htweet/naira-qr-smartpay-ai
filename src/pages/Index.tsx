
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, TrendingUp, Shield, Zap, Users, CreditCard, BarChart3, Brain, ArrowRight, ChevronDown, Scan, Settings, Star, Building, Smartphone, Globe } from "lucide-react";
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
import PricingPlans from "@/components/PricingPlans";
import { useAuth } from "@/contexts/AuthContext";
import { trackEvent, trackConversion } from "@/utils/tracker";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user, loading, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'merchant' | 'customer'>('merchant');

  useEffect(() => {
    trackEvent({
      eventType: "page_view",
      eventData: { page: "home" }
    });

    if (user?.user_metadata?.user_type) {
      setUserType(user.user_metadata.user_type);
    }
  }, [user]);

  const features = [
    {
      icon: <QrCode className="h-8 w-8 text-blue-500" />,
      title: "Smart QR Payments",
      description: "Generate dynamic QR codes with real-time payment processing",
      benefits: ["Instant settlements", "Multi-gateway routing", "Advanced analytics"]
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-500" />,
      title: "AI-Powered Insights",
      description: "Machine learning algorithms optimize your payment flow",
      benefits: ["Fraud detection", "Revenue forecasting", "Customer insights"]
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: "Enterprise Security",
      description: "Bank-grade encryption with PCI DSS compliance",
      benefits: ["End-to-end encryption", "Real-time monitoring", "Compliance ready"]
    },
    {
      icon: <Zap className="h-8 w-8 text-orange-500" />,
      title: "Lightning Fast",
      description: "Sub-second payment processing with 99.9% uptime",
      benefits: ["2.1s avg processing", "99.9% uptime SLA", "Global infrastructure"]
    }
  ];

  const handleGetStarted = () => {
    trackConversion("cta_click", 0, "homepage_hero");
    navigate("/signup");
  };

  // If not logged in, show landing page
  if (!isAuthenticated && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <QrCode className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">PayQR</h1>
                  <p className="text-sm text-blue-200">Next-Gen FinTech</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-white/10"
                  onClick={() => navigate("/signin")}
                >
                  Sign In
                </Button>
                <Button 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  onClick={() => navigate("/signup")}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main>
          {/* Hero Section */}
          <section className="py-20 px-4 text-center text-white">
            <div className="container mx-auto">
              <div className="max-w-4xl mx-auto">
                <Badge className="mb-6 bg-blue-500/20 text-blue-200 border-blue-400/30">
                  <Star className="h-3 w-3 mr-1" />
                  Trusted by 50,000+ Nigerian Businesses
                </Badge>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                  The Future of
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Digital Payments</span>
                </h1>
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  Revolutionary QR payment platform powered by AI. Accept payments instantly, 
                  optimize revenue with smart routing, and scale your business with enterprise-grade security.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-3"
                    onClick={handleGetStarted}
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-3"
                  >
                    <Building className="mr-2 h-5 w-5" />
                    Enterprise Demo
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-16 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
                <div>
                  <p className="text-4xl font-bold mb-2">₦2.5T+</p>
                  <p className="text-blue-200">Transaction Volume</p>
                </div>
                <div>
                  <p className="text-4xl font-bold mb-2">150K+</p>
                  <p className="text-blue-200">Active Merchants</p>
                </div>
                <div>
                  <p className="text-4xl font-bold mb-2">99.98%</p>
                  <p className="text-blue-200">Platform Uptime</p>
                </div>
                <div>
                  <p className="text-4xl font-bold mb-2">2.1s</p>
                  <p className="text-blue-200">Avg Processing Time</p>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 px-4">
            <div className="container mx-auto">
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-purple-500/20 text-purple-200 border-purple-400/30">
                  <Zap className="h-3 w-3 mr-1" />
                  Cutting-Edge Technology
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                  Built for the Digital Economy
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Experience the next generation of payment infrastructure designed for African businesses
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-3">
                        {feature.icon}
                        <CardTitle className="text-lg text-white">{feature.title}</CardTitle>
                      </div>
                      <CardDescription className="text-gray-300">{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {feature.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
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
          <section className="py-20 px-4 bg-gradient-to-br from-blue-900/50 to-purple-900/50">
            <div className="container mx-auto">
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-green-500/20 text-green-200 border-green-400/30">
                  <CreditCard className="h-3 w-3 mr-1" />
                  Transparent Pricing
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                  Scale at Your Own Pace
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Flexible plans designed to grow with your business
                </p>
              </div>
              
              <PricingPlans />
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="container mx-auto max-w-4xl text-center text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Business?</h2>
              <p className="text-xl mb-8 text-blue-100">
                Join the payment revolution. Start accepting QR payments in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
                  onClick={handleGetStarted}
                >
                  <Smartphone className="mr-2 h-5 w-5" />
                  Start Free Trial
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-3"
                >
                  <Globe className="mr-2 h-5 w-5" />
                  Explore API Docs
                </Button>
              </div>
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center text-white">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
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
