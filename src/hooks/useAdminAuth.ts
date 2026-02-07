import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface AdminUser {
  id: string;
  email: string;
  role: string;
}

export const useAdminAuth = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          console.log("No session found");
          setIsAuthorized(false);
          setIsLoading(false);
          navigate("/signin");
          return;
        }

        const { data, error } = await supabase.functions.invoke("verify-admin", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (error || !data?.authorized) {
          console.log("Admin verification failed:", error || data?.error);
          setIsAuthorized(false);
          toast({
            title: "Access Denied",
            description: "You do not have admin privileges.",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        console.log("Admin verified successfully");
        setIsAuthorized(true);
        setAdminUser(data.user);
      } catch (error) {
        console.error("Error verifying admin:", error);
        setIsAuthorized(false);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    verifyAdmin();
  }, [navigate]);

  return { isAuthorized, isLoading, adminUser };
};
