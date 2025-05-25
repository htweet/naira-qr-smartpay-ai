
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaymentGatewaySection from "../components/landing/PaymentGatewaySection";
import PricingPlans from "../components/PricingPlans";
import QRCodeGenerator from "../components/QRCodeGenerator";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentSubscription } from "@/utils/subscription";
import SubscriptionBilling from "@/components/subscription/SubscriptionBilling";
import AccountSettings from "@/components/settings/AccountSettings";
import QRScanner from "@/components/customer/QRScanner";

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState("merchant");
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      checkSubscription();
    }
  }, [isAuthenticated]);

  const checkSubscription = async () => {
    if (!isAuthenticated) return;
    setIsLoadingSubscription(true);
    try {
      const data = await getCurrentSubscription();
      setSubscriptionStatus(data);
    } catch (error) {
      console.error("Failed to check subscription:", error);
    } finally {
      setIsLoadingSubscription(false);
    }
  };

  // Landing page content (shown when not authenticated)
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 py-16 lg:py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Accept payments seamlessly with QR codes
                </h1>
                <p className="text-lg text-gray-600">
                  NairaQR helps Nigerian businesses accept payments from any banking app or mobile wallet using simple, customizable QR codes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="w-full sm:w-auto">Get Started</Button>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">Learn More</Button>
                </div>
              </div>
              <div className="flex justify-center">
                <img 
                  src="/placeholder.svg" 
                  alt="QR Code Payments" 
                  className="max-w-full rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Payment Gateways Section */}
        <PaymentGatewaySection />

        {/* Pricing Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
              <p className="text-gray-600">
                Choose a plan that works for your business needs.
                All plans include our core QR payment features.
              </p>
            </div>
            
            <PricingPlans />
          </div>
        </section>
      </div>
    );
  }

  // Merchant Dashboard (authenticated view)
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Tabs 
        defaultValue="merchant" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 w-full mb-8">
          <TabsTrigger value="merchant">Merchant Dashboard</TabsTrigger>
          <TabsTrigger value="customer">Customer Payment</TabsTrigger>
        </TabsList>

        <TabsContent value="merchant" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <QRCodeGenerator />
            </div>

            <div className="space-y-8">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-medium">Subscription Status</h3>
                  {isLoadingSubscription ? (
                    <p>Loading subscription...</p>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <span>Current Plan:</span>
                        <span className="font-medium">
                          {subscriptionStatus?.subscribed 
                            ? subscriptionStatus.subscription_tier || 'Active' 
                            : 'Free Trial'}
                        </span>
                      </div>
                      <Button variant="outline" className="w-full" onClick={() => setActiveTab("billing")}>
                        Manage Subscription
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-medium">Account Settings</h3>
                  <p className="text-gray-600">
                    Update your business profile and logo
                  </p>
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab("settings")}>
                    Account Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="customer">
          <QRScanner />
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-6">
            <Button variant="ghost" onClick={() => setActiveTab("merchant")} className="mb-4">
              ← Back to Dashboard
            </Button>
            <AccountSettings />
          </div>
        </TabsContent>

        <TabsContent value="billing">
          <div className="space-y-6">
            <Button variant="ghost" onClick={() => setActiveTab("merchant")} className="mb-4">
              ← Back to Dashboard
            </Button>
            <SubscriptionBilling merchant={{}} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
