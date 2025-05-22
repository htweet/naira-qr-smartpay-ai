
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, TrendingUp, Shield, Zap, Users, CreditCard, BarChart3, Brain, ArrowRight, ChevronDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import MerchantDashboard from "@/components/MerchantDashboard";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import PaymentGatewayManager from "@/components/PaymentGatewayManager";
import AIAnalytics from "@/components/AIAnalytics";
import RevenueModel from "@/components/RevenueModel";
import FraudDetection from "@/components/FraudDetection";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { trackEvent, trackConversion } from "@/utils/tracker";
import { useNavigate } from "react-router-dom";
import PricingPlans from "@/components/PricingPlans";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Track page view
    trackEvent({
      eventType: "page_view",
      eventData: { page: "home" }
    });
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
              <div className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
                <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors">How It Works</a>
                <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">Pricing</a>
              </div>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    trackEvent({
                      eventType: "signin_click",
                      eventData: { location: "header" }
                    });
                    navigate("/signin");
                  }}
                >
                  Sign In
                </Button>
                <Button 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  onClick={() => {
                    trackEvent({
                      eventType: "signup_click",
                      eventData: { location: "header" }
                    });
                    navigate("/signup");
                  }}
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
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-10 md:mb-0">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                    Accept Payments <span className="text-blue-600">Anywhere</span> with QR Technology
                  </h1>
                  <p className="text-xl text-gray-700 mb-8">
                    Nigeria's most advanced QR payment platform with AI analytics, multi-gateway support, and powerful business tools.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
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
                  <div className="flex items-center gap-6 mt-8">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((n) => (
                        <div 
                          key={n} 
                          className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                        >
                          {n}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">85,000+</span> Nigerian merchants trust PayQR
                    </p>
                  </div>
                </div>
                <div className="md:w-1/2">
                  <div className="bg-white p-6 rounded-xl shadow-2xl rotate-3 relative">
                    <div className="absolute -top-4 -left-4 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      LIVE DEMO
                    </div>
                    <img 
                      src="https://placehold.co/600x400/e0f2fe/0284c7?text=QR+Payment+Demo&font=montserrat" 
                      alt="PayQR Demo" 
                      className="rounded-lg w-full" 
                    />
                    <div className="mt-4 flex justify-between items-center">
                      <div>
                        <p className="text-lg font-semibold">Payment Received</p>
                        <p className="text-gray-500">Transaction ID: #57829</p>
                      </div>
                      <div className="bg-green-50 p-2 rounded-lg">
                        <p className="text-green-700 font-medium">₦12,500.00</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <p className="text-4xl font-bold mb-2">₦15.7B+</p>
                  <p className="text-blue-100">Transactions Processed</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold mb-2">85,000+</p>
                  <p className="text-blue-100">Active Merchants</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold mb-2">99.8%</p>
                  <p className="text-blue-100">Platform Uptime</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold mb-2">2.1M</p>
                  <p className="text-blue-100">Monthly Transactions</p>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-20 px-4">
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

          {/* How It Works */}
          <section id="how-it-works" className="py-20 px-4 bg-gray-50">
            <div className="container mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">How PayQR Works</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Get started with our seamless integration in just a few steps
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    step: "1",
                    title: "Create Your Account",
                    description: "Sign up in minutes and verify your business credentials",
                    icon: <Users className="h-10 w-10 text-blue-500" />
                  },
                  {
                    step: "2",
                    title: "Generate QR Codes",
                    description: "Create custom QR codes with your branding and payment details",
                    icon: <QrCode className="h-10 w-10 text-purple-500" />
                  },
                  {
                    step: "3",
                    title: "Accept Payments",
                    description: "Customers scan your QR code to make instant payments",
                    icon: <CreditCard className="h-10 w-10 text-green-500" />
                  }
                ].map((item, index) => (
                  <div key={index} className="bg-white p-8 rounded-xl shadow-md relative">
                    <div className="absolute -top-5 -left-5 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {item.step}
                    </div>
                    <div className="mb-4">{item.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-16 text-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  onClick={handleGetStarted}
                >
                  Start Accepting Payments
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="py-20 px-4">
            <div className="container mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Choose the plan that fits your business needs
                </p>
              </div>
              
              <PricingPlans />

              <div className="mt-12 p-6 bg-blue-50 rounded-lg max-w-3xl mx-auto">
                <h3 className="text-xl font-semibold mb-2 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                  Transaction Fees
                </h3>
                <p className="mb-4 text-gray-700">
                  All plans include a competitive 1.5% transaction fee on successful payments (capped at ₦2,000 per transaction).
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-green-500 shrink-0" />
                  <span>No hidden charges. No setup fees. No monthly minimums.</span>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-20 px-4 bg-gray-50">
            <div className="container mx-auto max-w-4xl">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
                <p className="text-xl text-gray-600">
                  Everything you need to know about our platform
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    question: "How does PayQR compare to other payment systems?",
                    answer: "PayQR offers multi-gateway integration, AI-powered analytics, and Nigeria-specific optimizations that other systems lack. Our platform is designed specifically for Nigerian merchants with features like naira optimization and local payment method support."
                  },
                  {
                    question: "How long does it take to set up?",
                    answer: "Most merchants can complete the signup and verification process within 24 hours. Once approved, you can immediately create QR codes and begin accepting payments."
                  },
                  {
                    question: "Is PayQR secure?",
                    answer: "Yes, PayQR employs bank-grade security with end-to-end encryption, real-time fraud monitoring, and PCI DSS compliance to ensure your transactions are always secure."
                  },
                  {
                    question: "Can I integrate PayQR with my accounting software?",
                    answer: "Yes, PayQR integrates seamlessly with popular accounting software like QuickBooks, Sage, and local solutions like Accounteer."
                  }
                ].map((faq, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                    <button className="w-full flex items-center justify-between text-left">
                      <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    </button>
                    <div className="mt-2 text-gray-600">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <p className="text-gray-600 mb-4">Still have questions?</p>
                <Button variant="outline">
                  Contact Support
                </Button>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white">
            <div className="container mx-auto max-w-4xl text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Payment Experience?</h2>
              <p className="text-xl mb-8 text-blue-100">
                Join thousands of Nigerian merchants who trust PayQR for their payment needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  onClick={handleGetStarted}
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => {
                    trackEvent({
                      eventType: "contact_sales_click",
                      eventData: { location: "cta_section" }
                    });
                  }}
                >
                  Contact Sales
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // If authenticated, show dashboard
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
                {user?.user_metadata?.subscriptionTier || "Free"} Plan
              </Badge>
              <div className="text-right">
                <p className="font-medium">{user?.user_metadata?.business_name || user?.email}</p>
                <p className="text-sm text-gray-600">{user?.user_metadata?.businessType || "Merchant"}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  const { signOut } = require("@/contexts/AuthContext").useAuth();
                  signOut();
                }}
              >
                Sign Out
              </Button>
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
            <AIAnalytics merchant={user} />
          </TabsContent>

          <TabsContent value="revenue">
            <RevenueModel merchant={user} />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
