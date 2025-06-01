
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading";
import MerchantDashboard from "@/components/MerchantDashboard";
import CustomerDashboard from "@/components/customer/CustomerDashboard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket } from "lucide-react";
import AdminPanel from "@/components/admin/AdminPanel";
import { supabase } from "@/integrations/supabase/client";
import HeroSection from "@/components/landing/HeroSection";
import FeatureSection from "@/components/landing/FeatureSection";
import PaymentGatewaySection from "@/components/landing/PaymentGatewaySection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import PricingSection from "@/components/landing/PricingSection";
import TestimonialSection from "@/components/landing/TestimonialSection";
import FAQSection from "@/components/landing/FAQSection";

const Index = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const [merchant, setMerchant] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      const userType = user.user_metadata?.user_type || 'customer';
      const isAdminUser = user.email === 'htweet@gmail.com';
      
      if (isAdminUser) {
        setIsAdmin(true);
        createSuperAdminIfNeeded();
      }

      if (userType === 'merchant') {
        setMerchant({
          id: user.id,
          business_name: user.user_metadata?.business_name || 'My Business',
          email: user.email,
          created_at: user.created_at,
        });
      }
    }
  }, [user]);

  const createSuperAdminIfNeeded = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (!data && !error) {
        await supabase
          .from('admin_users')
          .insert({
            user_id: user?.id,
            role: 'super_admin',
            permissions: {
              full_access: true,
              manage_users: true,
              manage_system: true,
              manage_payments: true
            }
          });
      }
    } catch (error) {
      console.error('Error creating super admin:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // Admin Panel Route
  if (isAuthenticated && isAdmin) {
    return <AdminPanel />;
  }

  // Merchant Dashboard
  if (isAuthenticated && merchant) {
    return <MerchantDashboard merchant={merchant} />;
  }

  // Customer Dashboard  
  if (isAuthenticated && user?.user_metadata?.user_type === 'customer') {
    return <CustomerDashboard user={user} />;
  }

  // Landing Page for non-authenticated users
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <FeatureSection />
      <PaymentGatewaySection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialSection />
      <FAQSection />
    </div>
  );
};

export default Index;
