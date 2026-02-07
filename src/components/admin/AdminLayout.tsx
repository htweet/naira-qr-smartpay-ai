import { Outlet } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { SidebarProvider } from "@/components/ui/sidebar";

const AdminLayout = () => {
  const { isAuthorized, isLoading, adminUser } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect via hook
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader adminUser={adminUser} />
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
