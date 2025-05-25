
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import CustomerQRScanner from "@/components/customer/CustomerQRScanner";
import AccountSettings from "@/components/account/AccountSettings";
import SubscriptionPlans from "@/components/subscription/SubscriptionPlans";
import SubscriptionBilling from "@/components/subscription/SubscriptionBilling";
import GatewayManager from "@/components/gateway/GatewayManager";
import { useProfile } from "@/hooks/useProfile";
import { usePaymentGateways } from "@/hooks/usePaymentGateways";
import HeroSection from "@/components/landing/HeroSection";
import FeatureSection from "@/components/landing/FeatureSection";
import PricingSection from "@/components/landing/PricingSection";
import TestimonialSection from "@/components/landing/TestimonialSection";
import FAQSection from "@/components/landing/FAQSection";
import PaymentGatewaySection from "@/components/landing/PaymentGatewaySection";
import Footer from "@/components/Footer";

const Index = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { gateways, toggleGateway, updateGatewaySettings } = usePaymentGateways();
  const [activeTab, setActiveTab] = useState("scanner");
  const [selectedGateway, setSelectedGateway] = useState("moniepoint");

  // Show customer scanner by default for all users
  useEffect(() => {
    if (user) {
      setActiveTab("scanner");
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <HeroSection />
        <FeatureSection />
        <PricingSection />
        <TestimonialSection />
        <PaymentGatewaySection />
        <FAQSection />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {profile?.business_name || 'User'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your payments and QR codes from your dashboard
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="scanner">QR Scanner</TabsTrigger>
            <TabsTrigger value="generator">Generate QR</TabsTrigger>
            <TabsTrigger value="gateways">Payment Gateways</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="plans">Subscription</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="scanner" className="space-y-6">
            <CustomerQRScanner />
          </TabsContent>

          <TabsContent value="generator" className="space-y-6">
            <QRCodeGenerator merchant={profile} />
          </TabsContent>

          <TabsContent value="gateways" className="space-y-6">
            <GatewayManager
              gateways={gateways}
              selectedGateway={selectedGateway}
              onToggleGateway={toggleGateway}
              onSelectGateway={setSelectedGateway}
              onUpdateSettings={updateGatewaySettings}
            />
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <SubscriptionBilling merchant={profile} />
          </TabsContent>

          <TabsContent value="plans" className="space-y-6">
            <SubscriptionPlans />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <AccountSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
