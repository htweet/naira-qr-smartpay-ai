import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { QrCode, TrendingUp, Shield, Zap, Users, CreditCard, BarChart3, Brain, ArrowRight, ChevronDown, Scan, Settings, Star, Building, Smartphone, Globe, CheckCircle, Eye } from "lucide-react";
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
import PaymentGatewaySection from "@/components/landing/PaymentGatewaySection";

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

  const handleGetStarted = () => {
    trackConversion("cta_click", 0, "homepage_hero");
    navigate("/signup");
  };

  // If not logged in, show landing page
  if (!isAuthenticated && !loading) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <QrCode className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">PayQR</h1>
                  <p className="text-sm text-gray-600">Payment Solutions</p>
                </div>
              </div>
              <nav className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
                <a href="#how-it-works" className="text-gray-600 hover:text-gray-900">How It Works</a>
                <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
              </nav>
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  className="text-gray-600 hover:text-gray-900"
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
            <div className="container mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-6">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    LIVE DEMO
                  </div>
                  <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
                    Accept Payments <br />
                    <span className="text-blue-600">Anywhere</span> with QR <br />
                    Technology
                  </h1>
                  <p className="text-xl text-gray-600 mb-8 max-w-lg">
                    Nigeria's most advanced QR payment platform with AI analytics, multi-gateway support, and powerful business tools.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-3"
                      onClick={handleGetStarted}
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 text-lg px-8 py-3"
                    >
                      View Demo
                    </Button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">B</div>
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">C</div>
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">+</div>
                    </div>
                    <span className="text-gray-600">85,000+ Nigerian merchants trust PayQR</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                        QR Payment Demo
                      </div>
                      <div className="w-48 h-48 bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mx-auto mb-4">
                        <QrCode className="h-24 w-24 text-gray-400" />
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Payment Received</span>
                        <span className="text-green-600 font-bold">₦12,500.00</span>
                      </div>
                      <div className="text-sm text-gray-500">Transaction ID: #57829</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
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
          <section id="features" className="py-20 px-4 bg-gray-50">
            <div className="container mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                  Powerful Features for Nigerian Merchants
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Our platform combines cutting-edge technology with local payment expertise to help your business thrive.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <QrCode className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl mb-2">Dynamic QR Codes</CardTitle>
                    <CardDescription>Generate customizable QR codes with your branding</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Instant payment collection
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Brand recognition
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Security features
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                      <Brain className="h-6 w-6 text-purple-600" />
                    </div>
                    <CardTitle className="text-xl mb-2">AI-Powered Analytics</CardTitle>
                    <CardDescription>Advanced insights and predictive analytics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Fraud detection
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Sales forecasting
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Customer behavior analysis
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                      <Shield className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-xl mb-2">Bank-Grade Security</CardTitle>
                    <CardDescription>PCI DSS compliant with multi-layer protection</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        End-to-end encryption
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Real-time monitoring
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Fraud prevention
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                      <CreditCard className="h-6 w-6 text-orange-600" />
                    </div>
                    <CardTitle className="text-xl mb-2">Multi-Gateway Support</CardTitle>
                    <CardDescription>Integrated with Moniepoint, Opay, and Palmpay</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Higher success rates
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Lower fees
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Customer preference
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Payment Gateway Section */}
          <PaymentGatewaySection />

          {/* How It Works Section */}
          <section id="how-it-works" className="py-20 px-4">
            <div className="container mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                  How PayQR Works
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Get started with our seamless integration in just a few steps
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto">
                    1
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Create Your Account</h3>
                  <p className="text-gray-600">
                    Sign up in minutes and verify your business credentials
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto">
                    2
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <QrCode className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Generate QR Codes</h3>
                  <p className="text-gray-600">
                    Create custom QR codes with your branding and payment details
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto">
                    3
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Accept Payments</h3>
                  <p className="text-gray-600">
                    Customers scan your QR code to make instant payments
                  </p>
                </div>
              </div>

              <div className="text-center mt-12">
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
          <section id="pricing" className="py-20 px-4 bg-gray-50">
            <div className="container mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                  Simple, Transparent Pricing
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Choose the plan that fits your business needs
                </p>
              </div>
              
              <PricingPlans />

              {/* Transaction Fees */}
              <div className="mt-16 max-w-4xl mx-auto">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      Transaction Fees
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      All plans include a competitive 1.5% transaction fee on successful payments (capped at ₦2,000 per transaction).
                    </p>
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>No hidden charges. No setup fees. No monthly minimums.</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-20 px-4">
            <div className="container mx-auto max-w-4xl">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                  Frequently Asked Questions
                </h2>
                <p className="text-xl text-gray-600">
                  Everything you need to know about our platform
                </p>
              </div>

              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="compare" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left">
                    How does PayQR compare to other payment systems?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    PayQR offers multi-gateway integration, AI-powered analytics, and Nigeria-specific optimizations that other 
                    systems lack. Our platform is designed specifically for Nigerian merchants with features like naira optimization 
                    and local payment method support.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="setup" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left">
                    How long does it take to set up?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Most merchants can complete the signup and verification process within 24 hours. Once approved, you can 
                    immediately create QR codes and begin accepting payments.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="security" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left">
                    Is PayQR secure?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Yes, PayQR employs bank-grade security with end-to-end encryption, real-time fraud monitoring, and PCI DSS 
                    compliance to ensure your transactions are always secure.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="integration" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left">
                    Can I integrate PayQR with my accounting software?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Yes, PayQR integrates seamlessly with popular accounting software like QuickBooks, Sage, and local solutions 
                    like Accounteer.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="text-center mt-12">
                <p className="text-gray-600 mb-4">Still have questions?</p>
                <Button variant="outline" className="border-gray-300">
                  Contact Support
                </Button>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-4 bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="container mx-auto max-w-4xl text-center text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Transform Your Payment Experience?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Join thousands of Nigerian merchants who trust PayQR for their payment needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
                  onClick={handleGetStarted}
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-3"
                >
                  Schedule Demo
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If authenticated, show appropriate dashboard based on user type
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
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
            <TabsList className="grid w-full grid-cols-2 bg-white">
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
            <TabsList className="grid w-full grid-cols-7 bg-white">
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
