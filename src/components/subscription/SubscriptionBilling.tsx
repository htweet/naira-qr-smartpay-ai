import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CreditCard, Download, Eye, CheckCircle, Zap, Crown, Rocket } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { subscriptionPlans } from "@/utils/subscription";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface SubscriptionBillingProps {
  merchant: any;
}

const SubscriptionBilling = ({ merchant }: SubscriptionBillingProps) => {
  const { subscription, billingHistory, loading, usage, subscribe, cancelSubscription, getPlanLimits } = useSubscription();
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [subscribing, setSubscribing] = useState<string | null>(null);

  const currentPlan = subscriptionPlans.find(p => p.id === (subscription?.plan_id || "basic")) || subscriptionPlans[0];
  const limits = getPlanLimits(subscription?.plan_id || "basic");

  const handleSubscribe = async (planId: string) => {
    setSubscribing(planId);
    try {
      await subscribe(planId);
      setIsUpgradeOpen(false);
    } finally {
      setSubscribing(null);
    }
  };

  const getUsagePercent = (current: number, max: number) => {
    if (max === -1) return 5; // unlimited shows as minimal
    return Math.min((current / max) * 100, 100);
  };

  const planIcons: Record<string, React.ReactNode> = {
    basic: <Zap className="h-5 w-5" />,
    premium: <Crown className="h-5 w-5" />,
    enterprise: <Rocket className="h-5 w-5" />,
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card className="border-primary/20">
        <CardHeader className="bg-primary/5 rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            {planIcons[currentPlan.id] || <CreditCard className="h-5 w-5" />}
            Current Subscription
          </CardTitle>
          <CardDescription>Manage your subscription and billing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold">{currentPlan.name} Plan</h3>
                <Badge variant={subscription?.status === "active" ? "default" : subscription?.status === "cancelled" ? "destructive" : "secondary"}>
                  {subscription?.status || "Free"}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                ₦{currentPlan.price.toLocaleString()}/{currentPlan.interval}
                {subscription?.current_period_end && ` • Next billing: ${format(new Date(subscription.current_period_end), "MMM d, yyyy")}`}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {currentPlan.features.slice(0, 3).join(" • ")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">₦{currentPlan.price.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">/{currentPlan.interval}</p>
            </div>
          </div>

          <div className="pt-4 border-t flex gap-3">
            <Button onClick={() => setIsUpgradeOpen(true)}>
              {subscription?.status === "active" ? "Change Plan" : "Subscribe"}
            </Button>
            {subscription?.status === "active" && (
              <Button variant="outline" onClick={cancelSubscription}>
                Cancel Subscription
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Dialog */}
      <Dialog open={isUpgradeOpen} onOpenChange={setIsUpgradeOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Choose Your Plan</DialogTitle>
            <DialogDescription>Select a plan that fits your business needs</DialogDescription>
          </DialogHeader>
          <div className="grid md:grid-cols-3 gap-4">
            {subscriptionPlans.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.popular ? "border-primary shadow-lg" : ""} ${subscription?.plan_id === plan.id ? "bg-primary/5" : ""}`}>
                {plan.popular && (
                  <Badge className="absolute -top-2 right-4">Most Popular</Badge>
                )}
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    {planIcons[plan.id]}
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-bold">₦{plan.price.toLocaleString()}</span>
                    <span className="text-muted-foreground">/{plan.interval}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-1.5 text-sm">
                    {plan.features.slice(0, 5).map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={subscription?.plan_id === plan.id ? "outline" : plan.popular ? "default" : "outline"}
                    disabled={subscription?.plan_id === plan.id || subscribing === plan.id}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {subscribing === plan.id ? "Processing..." : subscription?.plan_id === plan.id ? "Current Plan" : "Subscribe"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="usage" className="space-y-4">
        <TabsList>
          <TabsTrigger value="usage">Usage & Limits</TabsTrigger>
          <TabsTrigger value="history">Billing History</TabsTrigger>
        </TabsList>

        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle>Usage & Limits</CardTitle>
              <CardDescription>Track your current usage against plan limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">QR Codes Generated</span>
                  <span className="text-sm text-muted-foreground">
                    {usage.qrCodes} / {limits.qrCodes === -1 ? "∞" : limits.qrCodes}
                  </span>
                </div>
                <Progress value={getUsagePercent(usage.qrCodes, limits.qrCodes)} />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Monthly Transactions</span>
                  <span className="text-sm text-muted-foreground">
                    {usage.transactions.toLocaleString()} / {limits.transactions === -1 ? "∞" : limits.transactions.toLocaleString()}
                  </span>
                </div>
                <Progress value={getUsagePercent(usage.transactions, limits.transactions)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View your payment history</CardDescription>
            </CardHeader>
            <CardContent>
              {billingHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CreditCard className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>No billing history yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {billingHistory.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{record.description || "Subscription Payment"}</p>
                          <p className="text-sm text-muted-foreground">
                            {record.paid_at ? format(new Date(record.paid_at), "MMM d, yyyy") : format(new Date(record.created_at), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₦{record.amount.toLocaleString()}</p>
                        <Badge variant={record.status === "paid" ? "default" : "secondary"}>{record.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubscriptionBilling;
