
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

const Index = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const [merchant, setMerchant] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      const userType = user.user_metadata?.user_type || 'customer';
      const isAdminUser = user.email === 'htweet@gmail.com'; // Check for super admin
      
      if (isAdminUser) {
        setIsAdmin(true);
        // Auto-create super admin entry
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
        // Create super admin entry
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto py-20 text-center">
        <Card className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
              <Rocket className="h-6 w-6 text-blue-500" />
              QR Payment Platform
            </CardTitle>
            <CardDescription className="text-gray-700">
              Seamlessly accept payments with customized QR codes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-gray-800">
              Join our platform to revolutionize your payment process.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link to="/signin">Sign In</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
