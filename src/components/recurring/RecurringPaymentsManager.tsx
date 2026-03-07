import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, RefreshCw, Pause, Play, Trash2, Calendar, Eye, User } from "lucide-react";
import { useRecurringPayments, CreateRecurringPaymentData } from "@/hooks/useRecurringPayments";
import { useCurrencyRates } from "@/hooks/useCurrencyRates";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow, format } from "date-fns";

interface RecurringPaymentsManagerProps {
  merchantId: string | undefined;
}

const RecurringPaymentsManager = ({ merchantId }: RecurringPaymentsManagerProps) => {
  const { payments, loading, createRecurringPayment, pausePayment, resumePayment, cancelPayment, deletePayment } = useRecurringPayments(merchantId);
  const { formatCurrency, supportedCurrencies } = useCurrencyRates();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<typeof payments[0] | null>(null);
  const [customers, setCustomers] = useState<Array<{ id: string; full_name: string | null; email: string }>>([]);
  const [newPayment, setNewPayment] = useState<CreateRecurringPaymentData & { customer_name?: string; customer_email?: string }>({
    name: "", amount: 0, currency: "NGN", interval: "monthly",
  });

  useEffect(() => {
    if (!merchantId) return;
    supabase.from("customers").select("id, full_name, email").eq("merchant_id", merchantId).then(({ data }) => setCustomers(data || []));
  }, [merchantId]);

  const handleCreate = async () => {
    try {
      await createRecurringPayment(newPayment);
      setIsCreateOpen(false);
      setNewPayment({ name: "", amount: 0, currency: "NGN", interval: "monthly" });
    } catch (error) {
      console.error("Error creating recurring payment:", error);
    }
  };

  const handleCustomerSelect = (customerId: string) => {
    if (customerId === "manual") {
      setNewPayment(prev => ({ ...prev, customer_id: undefined }));
      return;
    }
    const c = customers.find(c => c.id === customerId);
    if (c) {
      setNewPayment(prev => ({ ...prev, customer_id: c.id, customer_name: c.full_name || "", customer_email: c.email }));
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = { active: "default", paused: "secondary", cancelled: "destructive", completed: "outline" };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const getIntervalLabel = (interval: string) => {
    const labels: Record<string, string> = { daily: "Daily", weekly: "Weekly", monthly: "Monthly", quarterly: "Quarterly", yearly: "Yearly" };
    return labels[interval] || interval;
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Recurring Payments</h2>
          <p className="text-muted-foreground">Manage subscription and recurring billing</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Create Recurring Payment</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Recurring Payment</DialogTitle>
              <DialogDescription>Set up a new recurring payment schedule</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Payment Name</Label>
                <Input placeholder="Monthly Subscription" value={newPayment.name} onChange={(e) => setNewPayment(prev => ({ ...prev, name: e.target.value }))} />
              </div>

              {/* Customer Selector */}
              <div className="p-3 border rounded-lg space-y-3 bg-muted/30">
                <Label className="text-sm font-semibold flex items-center gap-2"><User className="h-4 w-4" /> Customer</Label>
                {customers.length > 0 && (
                  <Select onValueChange={handleCustomerSelect}>
                    <SelectTrigger><SelectValue placeholder="Select customer or enter manually" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Enter manually</SelectItem>
                      {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.full_name || c.email}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Customer name" value={newPayment.customer_name || ""} onChange={(e) => setNewPayment(prev => ({ ...prev, customer_name: e.target.value }))} />
                  <Input placeholder="Customer email" value={newPayment.customer_email || ""} onChange={(e) => setNewPayment(prev => ({ ...prev, customer_email: e.target.value }))} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input type="number" placeholder="0.00" value={newPayment.amount || ""} onChange={(e) => setNewPayment(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))} />
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={newPayment.currency} onValueChange={(v) => setNewPayment(prev => ({ ...prev, currency: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{supportedCurrencies.map(c => <SelectItem key={c.code} value={c.code}>{c.symbol} {c.code}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Billing Interval</Label>
                <Select value={newPayment.interval} onValueChange={(v) => setNewPayment(prev => ({ ...prev, interval: v as any }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
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
                <div className="space-y-2"><Label>Start Date</Label><Input type="date" value={newPayment.start_date || ""} onChange={(e) => setNewPayment(prev => ({ ...prev, start_date: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Max Payments</Label><Input type="number" placeholder="Unlimited" value={newPayment.max_payments || ""} onChange={(e) => setNewPayment(prev => ({ ...prev, max_payments: parseInt(e.target.value) || undefined }))} /></div>
              </div>
              <Button className="w-full" onClick={handleCreate} disabled={!newPayment.name || !newPayment.amount}>Create Recurring Payment</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Detail View */}
      <Dialog open={!!selectedPayment} onOpenChange={(o) => !o && setSelectedPayment(null)}>
        <DialogContent className="max-w-lg">
          {selectedPayment && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between"><DialogTitle>{selectedPayment.name}</DialogTitle>{getStatusBadge(selectedPayment.status)}</div>
                <DialogDescription>Created {format(new Date(selectedPayment.created_at), "PPP")}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Amount</p><p className="text-xl font-bold">{formatCurrency(selectedPayment.amount, selectedPayment.currency)}</p></div>
                  <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Interval</p><p className="text-lg font-medium">{getIntervalLabel(selectedPayment.interval)}</p></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Next Payment</p><p className="text-sm font-medium">{format(new Date(selectedPayment.next_payment_date), "PPP")}</p></div>
                  <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Payments Made</p><p className="text-lg font-medium">{selectedPayment.total_payments}{selectedPayment.max_payments ? ` / ${selectedPayment.max_payments}` : ""}</p></div>
                </div>
                {(selectedPayment as any).customer_name && (
                  <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Customer</p><p className="text-sm font-medium">{(selectedPayment as any).customer_name} {(selectedPayment as any).customer_email && `(${(selectedPayment as any).customer_email})`}</p></div>
                )}
                <Separator />
                <div className="flex gap-2">
                  {selectedPayment.status === "active" && <Button variant="outline" onClick={() => { pausePayment(selectedPayment.id); setSelectedPayment(null); }}><Pause className="mr-2 h-4 w-4" />Pause</Button>}
                  {selectedPayment.status === "paused" && <Button variant="outline" onClick={() => { resumePayment(selectedPayment.id); setSelectedPayment(null); }}><Play className="mr-2 h-4 w-4" />Resume</Button>}
                  {["active", "paused"].includes(selectedPayment.status) && <Button variant="ghost" onClick={() => { cancelPayment(selectedPayment.id); setSelectedPayment(null); }}>Cancel</Button>}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {payments.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-12"><RefreshCw className="h-12 w-12 text-muted-foreground mb-4" /><p className="text-muted-foreground">No recurring payments yet</p></CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {payments.map(payment => (
            <Card key={payment.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedPayment(payment)}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-lg">{payment.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />{getIntervalLabel(payment.interval)} • Next: {format(new Date(payment.next_payment_date), "MMM d, yyyy")}
                        {(payment as any).customer_name && <span>• <User className="h-3 w-3 inline" /> {(payment as any).customer_name}</span>}
                      </CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(payment.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div><p className="text-2xl font-bold">{formatCurrency(payment.amount, payment.currency)}</p><p className="text-sm text-muted-foreground">{payment.total_payments} payments made</p></div>
                  <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedPayment(payment)}><Eye className="h-4 w-4" /></Button>
                    {payment.status === "active" && <Button variant="outline" size="sm" onClick={() => pausePayment(payment.id)}><Pause className="mr-2 h-4 w-4" />Pause</Button>}
                    {payment.status === "paused" && <Button variant="outline" size="sm" onClick={() => resumePayment(payment.id)}><Play className="mr-2 h-4 w-4" />Resume</Button>}
                    {payment.status === "cancelled" && <Button variant="ghost" size="sm" onClick={() => deletePayment(payment.id)}><Trash2 className="h-4 w-4" /></Button>}
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
