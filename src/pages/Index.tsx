
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
import AccountSettings from "@/components/account/AccountSettings";
import SubscriptionBilling from "@/components/subscription/SubscriptionBilling";
import CustomerTransactions from "@/components/customer/CustomerTransactions";
import { useAuth } from "@/contexts/AuthContext";
import { trackEvent, trackConversion } from "@/utils/tracker";
import { useNavigate } from "react-router-dom";
import PaymentGatewaySection from "@/components/landing/PaymentGatewaySection";

// Landing page components
import HeroSection from "@/components/landing/HeroSection";
import FeatureSection from "@/components/landing/FeatureSection";
import PricingSection from "@/components/landing/PricingSection";
import TestimonialSection from "@/components/landing/TestimonialSection";
import FAQSection from "@/components/landing/FAQSection";

const Index = () => {
  const [activeTab, setActiveTab] = useState("scanner");
  const { user, loading, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'merchant' | 'customer'>('customer');

  useEffect(() => {
    trackEvent({
      eventType: "page_view",
      eventData: { page: "home" }
    });

    if (user?.user_metadata?.user_type) {
      setUserType(user.user_metadata.user_type);
    }

    // Set default tab based on user type
    if (user) {
      if (user.user_metadata?.user_type === 'customer') {
        setActiveTab("scanner");
      } else {
        setActiveTab("dashboard");
      }
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
          <HeroSection />
          <FeatureSection />
          <PaymentGatewaySection />
          <PricingSection />
          <TestimonialSection />
          <FAQSection />
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
          // Customer Interface - Scanner is default
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white">
              <TabsTrigger value="scanner" className="flex items-center gap-2">
                <Scan className="h-4 w-4" />
                QR Scanner
              </TabsTrigger>
              <TabsTrigger value="transactions" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Transactions
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scanner">
              <QRScanner />
            </TabsContent>

            <TabsContent value="transactions">
              <CustomerTransactions />
            </TabsContent>

            <TabsContent value="analytics">
              <AIAnalytics merchant={user} userType="customer" />
            </TabsContent>
          </Tabs>
        ) : (
          // Merchant Interface
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-7 bg-white">
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
              <TabsTrigger value="billing" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Billing
              </TabsTrigger>
              <TabsTrigger value="revenue" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Revenue
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

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

            <TabsContent value="billing">
              <SubscriptionBilling merchant={user} />
            </TabsContent>

            <TabsContent value="revenue">
              <RevenueModel merchant={user} />
            </TabsContent>

            <TabsContent value="settings">
              <AccountSettings />
            </TabsContent>
          </Tabs>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Index;
