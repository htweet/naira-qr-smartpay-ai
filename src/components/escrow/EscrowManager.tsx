import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock, Unlock, AlertTriangle, RefreshCcw, Shield, Eye, User } from "lucide-react";
import { useEscrow, CreateEscrowData } from "@/hooks/useEscrow";
import { useCurrencyRates } from "@/hooks/useCurrencyRates";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow, format } from "date-fns";

interface EscrowManagerProps {
  merchantId: string | undefined;
}

const EscrowManager = ({ merchantId }: EscrowManagerProps) => {
  const { escrows, loading, createEscrow, releaseEscrow, refundEscrow, disputeEscrow, getEscrowStats } = useEscrow(merchantId);
  const { formatCurrency, supportedCurrencies } = useCurrencyRates();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedEscrow, setSelectedEscrow] = useState<typeof escrows[0] | null>(null);
  const [disputeReason, setDisputeReason] = useState("");
  const [customers, setCustomers] = useState<Array<{ id: string; full_name: string | null; email: string }>>([]);
  const [newEscrow, setNewEscrow] = useState<CreateEscrowData & { customer_name?: string; customer_email?: string }>({
    amount: 0, currency: "NGN", release_conditions: "",
  });

  const stats = getEscrowStats();

  useEffect(() => {
    if (!merchantId) return;
    supabase.from("customers").select("id, full_name, email").eq("merchant_id", merchantId).then(({ data }) => setCustomers(data || []));
  }, [merchantId]);

  const handleCustomerSelect = (customerId: string) => {
    if (customerId === "manual") { setNewEscrow(prev => ({ ...prev, customer_id: undefined })); return; }
    const c = customers.find(x => x.id === customerId);
    if (c) setNewEscrow(prev => ({ ...prev, customer_id: c.id, customer_name: c.full_name || "", customer_email: c.email }));
  };

  const handleCreate = async () => {
    try {
      await createEscrow(newEscrow);
      setIsCreateOpen(false);
      setNewEscrow({ amount: 0, currency: "NGN", release_conditions: "" });
    } catch (error) { console.error("Error creating escrow:", error); }
  };

  const handleDispute = async (id: string) => {
    try { await disputeEscrow(id, disputeReason); setDisputeReason(""); setSelectedEscrow(null); } catch {}
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
      held: { variant: "secondary", icon: <Lock className="h-3 w-3" /> },
      released: { variant: "default", icon: <Unlock className="h-3 w-3" /> },
      disputed: { variant: "destructive", icon: <AlertTriangle className="h-3 w-3" /> },
      refunded: { variant: "outline", icon: <RefreshCcw className="h-3 w-3" /> },
    };
    const { variant, icon } = config[status] || { variant: "outline" as const, icon: null };
    return <Badge variant={variant} className="flex items-center gap-1">{icon}{status}</Badge>;
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold">Escrow Services</h2><p className="text-muted-foreground">Secure payment holding for transactions</p></div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild><Button><Lock className="mr-2 h-4 w-4" />Create Escrow</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Escrow</DialogTitle><DialogDescription>Hold funds securely until conditions are met</DialogDescription></DialogHeader>
            <div className="space-y-4">
              {/* Customer Selector */}
              <div className="p-3 border rounded-lg space-y-2 bg-muted/30">
                <Label className="text-sm font-semibold flex items-center gap-2"><User className="h-4 w-4" /> Customer</Label>
                {customers.length > 0 && (
                  <Select onValueChange={handleCustomerSelect}>
                    <SelectTrigger><SelectValue placeholder="Select customer (optional)" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Enter manually</SelectItem>
                      {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.full_name || c.email}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Customer name" value={newEscrow.customer_name || ""} onChange={(e) => setNewEscrow(prev => ({ ...prev, customer_name: e.target.value }))} />
                  <Input placeholder="Customer email" value={newEscrow.customer_email || ""} onChange={(e) => setNewEscrow(prev => ({ ...prev, customer_email: e.target.value }))} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Amount</Label><Input type="number" placeholder="0.00" value={newEscrow.amount || ""} onChange={(e) => setNewEscrow(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))} /></div>
                <div className="space-y-2"><Label>Currency</Label>
                  <Select value={newEscrow.currency || "NGN"} onValueChange={(v) => setNewEscrow(prev => ({ ...prev, currency: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{supportedCurrencies.map(c => <SelectItem key={c.code} value={c.code}>{c.symbol} {c.code}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2"><Label>Release Conditions</Label><Textarea placeholder="Describe the conditions..." value={newEscrow.release_conditions} onChange={(e) => setNewEscrow(prev => ({ ...prev, release_conditions: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Release Date (Optional)</Label><Input type="date" value={newEscrow.release_date || ""} onChange={(e) => setNewEscrow(prev => ({ ...prev, release_date: e.target.value }))} /></div>
              <Button className="w-full" onClick={handleCreate} disabled={!newEscrow.amount}>Create Escrow</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Detail View */}
      <Dialog open={!!selectedEscrow} onOpenChange={(o) => { if (!o) { setSelectedEscrow(null); setDisputeReason(""); } }}>
        <DialogContent className="max-w-lg">
          {selectedEscrow && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between"><DialogTitle>Escrow #{selectedEscrow.id.slice(0, 8)}</DialogTitle>{getStatusBadge(selectedEscrow.status)}</div>
                <DialogDescription>Created {format(new Date(selectedEscrow.created_at), "PPP")}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Amount</p><p className="text-xl font-bold">{formatCurrency(selectedEscrow.amount, selectedEscrow.currency)}</p></div>
                  <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Currency</p><p className="text-lg font-medium">{selectedEscrow.currency}</p></div>
                </div>
                {(selectedEscrow as any).customer_name && (
                  <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Customer</p><p className="text-sm font-medium">{(selectedEscrow as any).customer_name} {(selectedEscrow as any).customer_email && `(${(selectedEscrow as any).customer_email})`}</p></div>
                )}
                {selectedEscrow.release_conditions && <div className="p-3 border rounded-lg"><p className="text-sm font-medium">Release Conditions</p><p className="text-sm text-muted-foreground">{selectedEscrow.release_conditions}</p></div>}
                {selectedEscrow.release_date && <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Scheduled Release</p><p className="text-sm font-medium">{format(new Date(selectedEscrow.release_date), "PPP")}</p></div>}
                {selectedEscrow.released_at && <div className="p-3 bg-emerald-50 border-emerald-200 border rounded-lg"><p className="text-sm text-emerald-700">{selectedEscrow.status === "refunded" ? "Refunded" : "Released"} on {format(new Date(selectedEscrow.released_at), "PPP")}</p></div>}
                {selectedEscrow.dispute_reason && <div className="p-3 bg-red-50 border-red-200 border rounded-lg"><p className="text-sm font-medium text-red-900">Dispute Reason</p><p className="text-sm text-red-800">{selectedEscrow.dispute_reason}</p></div>}
                <Separator />
                {selectedEscrow.status === "held" && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Button onClick={() => { releaseEscrow(selectedEscrow.id); setSelectedEscrow(null); }}><Unlock className="mr-2 h-4 w-4" />Release</Button>
                      <Button variant="outline" onClick={() => { refundEscrow(selectedEscrow.id); setSelectedEscrow(null); }}><RefreshCcw className="mr-2 h-4 w-4" />Refund</Button>
                    </div>
                    <div className="space-y-2">
                      <Label>File Dispute</Label>
                      <Textarea placeholder="Describe the dispute reason..." value={disputeReason} onChange={(e) => setDisputeReason(e.target.value)} />
                      <Button variant="destructive" className="w-full" onClick={() => handleDispute(selectedEscrow.id)} disabled={!disputeReason}>
                        <AlertTriangle className="mr-2 h-4 w-4" />Submit Dispute
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-amber-50 border-amber-200"><CardContent className="p-4"><div className="flex items-center gap-2"><Lock className="h-5 w-5 text-amber-600" /><div><p className="text-sm text-amber-600">Held</p><p className="text-2xl font-bold text-amber-900">{stats.held}</p><p className="text-sm text-amber-600">{formatCurrency(stats.heldAmount, "NGN")}</p></div></div></CardContent></Card>
        <Card className="bg-emerald-50 border-emerald-200"><CardContent className="p-4"><div className="flex items-center gap-2"><Unlock className="h-5 w-5 text-emerald-600" /><div><p className="text-sm text-emerald-600">Released</p><p className="text-2xl font-bold text-emerald-900">{stats.released}</p><p className="text-sm text-emerald-600">{formatCurrency(stats.releasedAmount, "NGN")}</p></div></div></CardContent></Card>
        <Card className="bg-red-50 border-red-200"><CardContent className="p-4"><div className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-red-600" /><div><p className="text-sm text-red-600">Disputed</p><p className="text-2xl font-bold text-red-900">{stats.disputed}</p></div></div></CardContent></Card>
        <Card className="bg-blue-50 border-blue-200"><CardContent className="p-4"><div className="flex items-center gap-2"><RefreshCcw className="h-5 w-5 text-blue-600" /><div><p className="text-sm text-blue-600">Refunded</p><p className="text-2xl font-bold text-blue-900">{stats.refunded}</p></div></div></CardContent></Card>
      </div>

      {escrows.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-12"><Shield className="h-12 w-12 text-muted-foreground mb-4" /><p className="text-muted-foreground">No escrow transactions</p></CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {escrows.map(escrow => (
            <Card key={escrow.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedEscrow(escrow)}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2"><Shield className="h-5 w-5" />Escrow #{escrow.id.slice(0, 8)}</CardTitle>
                    <CardDescription>
                      Created {formatDistanceToNow(new Date(escrow.created_at), { addSuffix: true })}
                      {(escrow as any).customer_name && ` • ${(escrow as any).customer_name}`}
                    </CardDescription>
                  </div>
                  {getStatusBadge(escrow.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div><p className="text-2xl font-bold">{formatCurrency(escrow.amount, escrow.currency)}</p>{escrow.release_conditions && <p className="text-sm text-muted-foreground line-clamp-1">Conditions: {escrow.release_conditions}</p>}</div>
                  <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); setSelectedEscrow(escrow); }}><Eye className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EscrowManager;
