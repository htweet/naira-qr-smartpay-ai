import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, CreditCard, Users, Settings, Download, Plus } from "lucide-react";

interface QuickActionsProps {
  onNavigate?: (path: string) => void;
}

const QuickActions = ({ onNavigate }: QuickActionsProps) => {
  const actions = [
    {
      icon: QrCode,
      label: "Create QR Code",
      description: "Generate a new payment QR",
      action: () => onNavigate?.("/merchant/qr-codes"),
      variant: "default" as const,
    },
    {
      icon: CreditCard,
      label: "View Transactions",
      description: "See all payment history",
      action: () => onNavigate?.("/merchant/transactions"),
      variant: "outline" as const,
    },
    {
      icon: Users,
      label: "Manage Customers",
      description: "View customer analytics",
      action: () => onNavigate?.("/merchant/customers"),
      variant: "outline" as const,
    },
    {
      icon: Settings,
      label: "Settings",
      description: "Configure your account",
      action: () => onNavigate?.("/merchant/settings"),
      variant: "outline" as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Quick Actions
        </CardTitle>
        <CardDescription>Common tasks at your fingertips</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant}
              className="h-auto flex-col gap-2 py-4"
              onClick={action.action}
            >
              <action.icon className="h-5 w-5" />
              <div className="text-center">
                <p className="text-sm font-medium">{action.label}</p>
                <p className="text-xs text-muted-foreground hidden md:block">
                  {action.description}
                </p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
