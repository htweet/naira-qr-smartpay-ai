
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, CreditCard, Download, FileText } from "lucide-react";

interface SubscriptionBillingProps {
  merchant: any;
}

const SubscriptionBilling = ({ merchant }: SubscriptionBillingProps) => {
  const currentPlan = {
    name: "Premium",
    price: 15000,
    nextBilling: "2024-02-15",
    status: "active"
  };

  const invoices = [
    {
      id: "INV-001",
      date: "2024-01-15",
      amount: 15000,
      status: "paid",
      downloadUrl: "#"
    },
    {
      id: "INV-002", 
      date: "2023-12-15",
      amount: 15000,
      status: "paid",
      downloadUrl: "#"
    },
    {
      id: "INV-003",
      date: "2023-11-15", 
      amount: 10000,
      status: "paid",
      downloadUrl: "#"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Current Subscription
          </CardTitle>
          <CardDescription>
            Manage your subscription and billing information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-lg">{currentPlan.name} Plan</h3>
              <p className="text-gray-600">₦{currentPlan.price.toLocaleString()}/month</p>
            </div>
            <Badge variant="default">Active</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Next billing date</p>
                <p className="font-medium">{currentPlan.nextBilling}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Payment method</p>
                <p className="font-medium">•••• •••• •••• 4242</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline">Change Plan</Button>
            <Button variant="outline">Update Payment Method</Button>
            <Button variant="outline">Cancel Subscription</Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Billing History
          </CardTitle>
          <CardDescription>
            View and download your past invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">{invoice.id}</p>
                    <p className="text-sm text-gray-500">{invoice.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold">₦{invoice.amount.toLocaleString()}</p>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      {invoice.status}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionBilling;
