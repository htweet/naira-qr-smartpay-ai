import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, RefreshCw, Pause, Play, Trash2, Calendar } from "lucide-react";
import { useRecurringPayments, CreateRecurringPaymentData } from "@/hooks/useRecurringPayments";
import { useCurrencyRates } from "@/hooks/useCurrencyRates";
import { formatDistanceToNow, format } from "date-fns";

interface RecurringPaymentsManagerProps {
  merchantId: string | undefined;
}

const RecurringPaymentsManager = ({ merchantId }: RecurringPaymentsManagerProps) => {
  const {
    payments,
    loading,
    createRecurringPayment,
    pausePayment,
    resumePayment,
    cancelPayment,
    deletePayment,
  } = useRecurringPayments(merchantId);
  const { formatCurrency, supportedCurrencies } = useCurrencyRates();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newPayment, setNewPayment] = useState<CreateRecurringPaymentData>({
    name: "",
    amount: 0,
    currency: "NGN",
    interval: "monthly",
  });

  const handleCreate = async () => {
    try {
      await createRecurringPayment(newPayment);
      setIsCreateOpen(false);
      setNewPayment({
        name: "",
        amount: 0,
        currency: "NGN",
        interval: "monthly",
      });
    } catch (error) {
      console.error("Error creating recurring payment:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      paused: "secondary",
      cancelled: "destructive",
      completed: "outline",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const getIntervalLabel = (interval: string) => {
    const labels: Record<string, string> = {
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
      quarterly: "Quarterly",
      yearly: "Yearly",
    };
    return labels[interval] || interval;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Recurring Payments</h2>
          <p className="text-muted-foreground">Manage subscription and recurring billing</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Recurring Payment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Recurring Payment</DialogTitle>
              <DialogDescription>
                Set up a new recurring payment schedule
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Payment Name</Label>
                <Input
                  placeholder="Monthly Subscription"
                  value={newPayment.name}
                  onChange={(e) => setNewPayment((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={newPayment.amount || ""}
                    onChange={(e) => setNewPayment((prev) => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select
                    value={newPayment.currency}
                    onValueChange={(value) => setNewPayment((prev) => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {supportedCurrencies.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.symbol} {c.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Billing Interval</Label>
                <Select
                  value={newPayment.interval}
                  onValueChange={(value) => setNewPayment((prev) => ({ ...prev, interval: value as CreateRecurringPaymentData["interval"] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date (Optional)</Label>
                  <Input
                    type="date"
                    value={newPayment.start_date || ""}
                    onChange={(e) => setNewPayment((prev) => ({ ...prev, start_date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Payments (Optional)</Label>
                  <Input
                    type="number"
                    placeholder="Unlimited"
                    value={newPayment.max_payments || ""}
                    onChange={(e) => setNewPayment((prev) => ({ ...prev, max_payments: parseInt(e.target.value) || undefined }))}
                  />
                </div>
              </div>

              <Button className="w-full" onClick={handleCreate} disabled={!newPayment.name || !newPayment.amount}>
                Create Recurring Payment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {payments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <RefreshCw className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No recurring payments yet</p>
            <p className="text-sm text-muted-foreground">Set up your first recurring payment schedule</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {payments.map((payment) => (
            <Card key={payment.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-lg">{payment.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {getIntervalLabel(payment.interval)} • Next: {format(new Date(payment.next_payment_date), "MMM d, yyyy")}
                      </CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(payment.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">
                      {formatCurrency(payment.amount, payment.currency)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {payment.total_payments} payment{payment.total_payments !== 1 ? "s" : ""} made
                      {payment.max_payments && ` of ${payment.max_payments}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {payment.status === "active" && (
                      <Button variant="outline" size="sm" onClick={() => pausePayment(payment.id)}>
                        <Pause className="mr-2 h-4 w-4" />
                        Pause
                      </Button>
                    )}
                    {payment.status === "paused" && (
                      <Button variant="outline" size="sm" onClick={() => resumePayment(payment.id)}>
                        <Play className="mr-2 h-4 w-4" />
                        Resume
                      </Button>
                    )}
                    {["active", "paused"].includes(payment.status) && (
                      <Button variant="ghost" size="sm" onClick={() => cancelPayment(payment.id)}>
                        Cancel
                      </Button>
                    )}
                    {payment.status === "cancelled" && (
                      <Button variant="ghost" size="sm" onClick={() => deletePayment(payment.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecurringPaymentsManager;
