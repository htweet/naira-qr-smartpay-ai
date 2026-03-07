import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Split, Users, Clock, CheckCircle, XCircle, Eye, User } from "lucide-react";
import { useSplitPayments, SplitRecipient, CreateSplitPaymentData } from "@/hooks/useSplitPayments";
import { useCurrencyRates } from "@/hooks/useCurrencyRates";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow, format } from "date-fns";

interface SplitPaymentsManagerProps {
  merchantId: string | undefined;
}

const SplitPaymentsManager = ({ merchantId }: SplitPaymentsManagerProps) => {
  const { splits, loading, createSplitPayment, processSplit, getSplitStats } = useSplitPayments(merchantId);
  const { formatCurrency } = useCurrencyRates();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedSplit, setSelectedSplit] = useState<typeof splits[0] | null>(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [customers, setCustomers] = useState<Array<{ id: string; full_name: string | null; email: string }>>([]);
  const [recipients, setRecipients] = useState<SplitRecipient[]>([
    { recipient_account: "", recipient_bank: "", percentage: 50 },
  ]);

  const stats = getSplitStats();

  useEffect(() => {
    if (!merchantId) return;
    supabase.from("customers").select("id, full_name, email").eq("merchant_id", merchantId).then(({ data }) => setCustomers(data || []));
  }, [merchantId]);

  const handleAddRecipient = () => setRecipients(prev => [...prev, { recipient_account: "", recipient_bank: "", percentage: 0 }]);
  const handleRemoveRecipient = (i: number) => setRecipients(prev => prev.filter((_, idx) => idx !== i));
  const handleRecipientChange = (i: number, field: keyof SplitRecipient, value: string | number) => {
    setRecipients(prev => { const u = [...prev]; u[i] = { ...u[i], [field]: value }; return u; });
  };

  const handleCreate = async () => {
    try {
      const data: CreateSplitPaymentData = {
        total_amount: totalAmount,
        recipients: recipients.filter(r => r.recipient_account && r.percentage),
      };
      await createSplitPayment(data);
      setIsCreateOpen(false);
      setTotalAmount(0);
      setCustomerName("");
      setRecipients([{ recipient_account: "", recipient_bank: "", percentage: 50 }]);
    } catch (error) {
      console.error("Error creating split payment:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
      pending: { variant: "secondary", icon: <Clock className="h-3 w-3" /> },
      processing: { variant: "outline", icon: <Clock className="h-3 w-3 animate-spin" /> },
      completed: { variant: "default", icon: <CheckCircle className="h-3 w-3" /> },
      failed: { variant: "destructive", icon: <XCircle className="h-3 w-3" /> },
    };
    const { variant, icon } = config[status] || { variant: "outline" as const, icon: null };
    return <Badge variant={variant} className="flex items-center gap-1">{icon}{status}</Badge>;
  };

  const totalPercentage = recipients.reduce((s, r) => s + (r.percentage || 0), 0);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold">Split Payments</h2><p className="text-muted-foreground">Distribute payments to multiple recipients</p></div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Create Split</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Create Split Payment</DialogTitle><DialogDescription>Define how to split the payment among recipients</DialogDescription></DialogHeader>
            <div className="space-y-4">
              {/* Customer */}
              <div className="p-3 border rounded-lg space-y-2 bg-muted/30">
                <Label className="text-sm font-semibold flex items-center gap-2"><User className="h-4 w-4" /> Customer</Label>
                {customers.length > 0 && (
                  <Select onValueChange={(v) => { const c = customers.find(x => x.id === v); setCustomerName(c?.full_name || c?.email || ""); }}>
                    <SelectTrigger><SelectValue placeholder="Select customer (optional)" /></SelectTrigger>
                    <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.full_name || c.email}</SelectItem>)}</SelectContent>
                  </Select>
                )}
                <Input placeholder="Customer name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Total Amount</Label>
                <Input type="number" placeholder="0.00" value={totalAmount || ""} onChange={(e) => setTotalAmount(parseFloat(e.target.value) || 0)} />
              </div>
              <div className="space-y-3">
                <Label className="flex items-center justify-between">
                  <span>Recipients</span>
                  <span className={`text-sm ${totalPercentage === 100 ? "text-emerald-600" : "text-amber-600"}`}>{totalPercentage}% allocated</span>
                </Label>
                {recipients.map((r, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-4"><Input placeholder="Account No." value={r.recipient_account || ""} onChange={(e) => handleRecipientChange(i, "recipient_account", e.target.value)} /></div>
                    <div className="col-span-4"><Input placeholder="Bank Name" value={r.recipient_bank || ""} onChange={(e) => handleRecipientChange(i, "recipient_bank", e.target.value)} /></div>
                    <div className="col-span-3"><div className="relative"><Input type="number" placeholder="%" value={r.percentage || ""} onChange={(e) => handleRecipientChange(i, "percentage", parseFloat(e.target.value) || 0)} /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span></div></div>
                    <div className="col-span-1">{recipients.length > 1 && <Button variant="ghost" size="icon" onClick={() => handleRemoveRecipient(i)}><XCircle className="h-4 w-4" /></Button>}</div>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={handleAddRecipient}><Plus className="mr-2 h-4 w-4" />Add Recipient</Button>
              </div>
              {totalAmount > 0 && totalPercentage === 100 && (
                <div className="bg-muted p-3 rounded-lg space-y-1">
                  <p className="text-sm font-medium">Split Preview</p>
                  {recipients.map((r, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>{r.recipient_account || `Recipient ${i + 1}`}</span>
                      <span className="font-medium">{formatCurrency(totalAmount * ((r.percentage || 0) / 100), "NGN")}</span>
                    </div>
                  ))}
                </div>
              )}
              <Button className="w-full" onClick={handleCreate} disabled={!totalAmount || totalPercentage !== 100}>Create Split Payment</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Detail View */}
      <Dialog open={!!selectedSplit} onOpenChange={(o) => !o && setSelectedSplit(null)}>
        <DialogContent className="max-w-lg">
          {selectedSplit && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between"><DialogTitle>Split #{selectedSplit.id.slice(0, 8)}</DialogTitle>{getStatusBadge(selectedSplit.status)}</div>
                <DialogDescription>Created {format(new Date(selectedSplit.created_at), "PPP")}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Amount</p><p className="text-xl font-bold">{formatCurrency(selectedSplit.amount, "NGN")}</p>{selectedSplit.percentage && <p className="text-sm text-muted-foreground">{selectedSplit.percentage}% of total</p>}</div>
                {(selectedSplit as any).customer_name && (
                  <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Customer</p><p className="text-sm font-medium">{(selectedSplit as any).customer_name}</p></div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  {selectedSplit.recipient_bank && <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Bank</p><p className="text-sm font-medium">{selectedSplit.recipient_bank}</p></div>}
                  {selectedSplit.recipient_account && <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Account</p><p className="text-sm font-mono">{selectedSplit.recipient_account}</p></div>}
                </div>
                {selectedSplit.processed_at && <div className="p-3 bg-emerald-50 border-emerald-200 border rounded-lg"><p className="text-sm text-emerald-700">Processed on {format(new Date(selectedSplit.processed_at), "PPP 'at' p")}</p></div>}
                <Separator />
                {selectedSplit.status === "pending" && <Button onClick={() => { processSplit(selectedSplit.id); setSelectedSplit(null); }} className="w-full">Process Now</Button>}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-amber-50 border-amber-200"><CardContent className="p-4"><div className="flex items-center gap-2"><Clock className="h-5 w-5 text-amber-600" /><div><p className="text-sm text-amber-600">Pending</p><p className="text-2xl font-bold text-amber-900">{stats.pending}</p><p className="text-sm text-amber-600">{formatCurrency(stats.pendingAmount, "NGN")}</p></div></div></CardContent></Card>
        <Card className="bg-emerald-50 border-emerald-200"><CardContent className="p-4"><div className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-emerald-600" /><div><p className="text-sm text-emerald-600">Completed</p><p className="text-2xl font-bold text-emerald-900">{stats.completed}</p><p className="text-sm text-emerald-600">{formatCurrency(stats.completedAmount, "NGN")}</p></div></div></CardContent></Card>
        <Card className="bg-red-50 border-red-200"><CardContent className="p-4"><div className="flex items-center gap-2"><XCircle className="h-5 w-5 text-red-600" /><div><p className="text-sm text-red-600">Failed</p><p className="text-2xl font-bold text-red-900">{stats.failed}</p></div></div></CardContent></Card>
        <Card className="bg-blue-50 border-blue-200"><CardContent className="p-4"><div className="flex items-center gap-2"><Users className="h-5 w-5 text-blue-600" /><div><p className="text-sm text-blue-600">Total</p><p className="text-2xl font-bold text-blue-900">{stats.total}</p></div></div></CardContent></Card>
      </div>

      {splits.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-12"><Split className="h-12 w-12 text-muted-foreground mb-4" /><p className="text-muted-foreground">No split payments yet</p></CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {splits.map(split => (
            <Card key={split.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedSplit(split)}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2"><Split className="h-5 w-5" />Split #{split.id.slice(0, 8)}</CardTitle>
                    <CardDescription>
                      Created {formatDistanceToNow(new Date(split.created_at), { addSuffix: true })}
                      {(split as any).customer_name && ` • ${(split as any).customer_name}`}
                    </CardDescription>
                  </div>
                  {getStatusBadge(split.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div><p className="text-2xl font-bold">{formatCurrency(split.amount, "NGN")}</p><p className="text-sm text-muted-foreground">{split.recipient_bank ? `To: ${split.recipient_bank} - ${split.recipient_account}` : "Multiple recipients"}</p></div>
                  <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedSplit(split)}><Eye className="h-4 w-4" /></Button>
                    {split.status === "pending" && <Button size="sm" onClick={() => processSplit(split.id)}>Process</Button>}
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

export default SplitPaymentsManager;
