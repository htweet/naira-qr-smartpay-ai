
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading";
import MerchantDashboard from "@/components/MerchantDashboard";
import CustomerDashboard from "@/components/customer/CustomerDashboard";
import AdminPanel from "@/components/admin/AdminPanel";
import { supabase } from "@/integrations/supabase/client";
import HeroSection from "@/components/landing/HeroSection";
import FeatureSection from "@/components/landing/FeatureSection";
import PaymentGatewaySection from "@/components/landing/PaymentGatewaySection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import PricingSection from "@/components/landing/PricingSection";
import TestimonialSection from "@/components/landing/TestimonialSection";
import FAQSection from "@/components/landing/FAQSection";
import Header from "@/components/Header";

const Index = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const [merchant, setMerchant] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check URL parameters for view switching
  const urlParams = new URLSearchParams(window.location.search);
  const forceAdmin = urlParams.get('admin') === 'true';
  const forceMerchant = urlParams.get('merchant') === 'true';

  useEffect(() => {
    if (user) {
      const userType = user.user_metadata?.user_type || 'customer';
      const isAdminUser = user.email === 'htweet@gmail.com';
      
      if (isAdminUser) {
        setIsAdmin(true);
        createSuperAdminIfNeeded();
      }

      if (userType === 'merchant' || forceMerchant) {
        setMerchant({
          id: user.id,
          business_name: user.user_metadata?.business_name || 'My Business',
          email: user.email,
          created_at: user.created_at,
        });
      }
    }
  }, [user, forceMerchant]);

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

  // Landing Page for non-authenticated users
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <HeroSection />
        <FeatureSection />
        <PaymentGatewaySection />
        <HowItWorksSection />
        <PricingSection />
        <TestimonialSection />
        <FAQSection />
      </div>
    );
  }

  // Admin Panel Route (force admin or admin user)
  if (isAuthenticated && (forceAdmin || (isAdmin && !forceMerchant))) {
    return (
      <div>
        <Header />
        <AdminPanel />
      </div>
    );
  }

  // Merchant Dashboard
  if (isAuthenticated && (merchant || forceMerchant)) {
    return (
      <div>
        <Header />
        <MerchantDashboard merchant={merchant} />
      </div>
    );
  }

  // Customer Dashboard  
  if (isAuthenticated && user?.user_metadata?.user_type === 'customer') {
    return (
      <div>
        <Header />
        <CustomerDashboard user={user} />
      </div>
    );
  }

  // Default to customer view for authenticated users
  return (
    <div>
      <Header />
      <CustomerDashboard user={user} />
    </div>
  );
};

export default Index;
