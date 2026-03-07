import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CreditCard, Search, Download, CheckCircle, Clock, XCircle, Store, FileText, Hash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

interface Transaction {
  id: string;
  amount: number;
  status: string;
  description: string | null;
  payment_method: string | null;
  reference: string | null;
  currency: string;
  created_at: string;
  merchant_id: string;
  merchant_name?: string;
}

const CustomerTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const fetchTransactions = async () => {
    if (!user) { setLoading(false); return; }
    try {
      // Get customer record(s) for this user
      const { data: customers } = await supabase
        .from("customers")
        .select("id")
        .eq("user_id", user.id);

      if (!customers?.length) { setLoading(false); return; }

      const customerIds = customers.map(c => c.id);

      const { data: txData, error } = await supabase
        .from("transactions")
        .select("*")
        .in("customer_id", customerIds)
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;

      // Fetch merchant names
      const merchantIds = [...new Set((txData || []).map(t => t.merchant_id))];
      let merchantMap: Record<string, string> = {};
      if (merchantIds.length) {
        const { data: merchants } = await supabase
          .from("merchants")
          .select("id, business_name")
          .in("id", merchantIds);
        merchantMap = Object.fromEntries((merchants || []).map(m => [m.id, m.business_name]));
      }

      setTransactions((txData || []).map(t => ({
        ...t,
        status: t.status || "pending",
        currency: t.currency || "NGN",
        merchant_name: merchantMap[t.merchant_id] || "Unknown Merchant",
      })));
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "pending": return <Clock className="h-4 w-4 text-amber-500" />;
      case "failed": return <XCircle className="h-4 w-4 text-destructive" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "completed": return "default";
      case "pending": return "secondary";
      case "failed": return "destructive";
      default: return "outline";
    }
  };

  const filtered = transactions.filter(t => {
    const matchSearch = (t.merchant_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.reference || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalSpent = filtered.filter(t => t.status === "completed").reduce((s, t) => s + t.amount, 0);

  if (loading) {
    return <div className="flex items-center justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Transaction History</h2>
        <p className="text-muted-foreground">View your recent payments and transaction details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Total Spent</p><p className="text-2xl font-bold">₦{totalSpent.toLocaleString()}</p></div><CreditCard className="h-8 w-8 text-primary" /></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Transactions</p><p className="text-2xl font-bold">{transactions.length}</p></div><CheckCircle className="h-8 w-8 text-emerald-500" /></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Pending</p><p className="text-2xl font-bold text-amber-600">{transactions.filter(t => t.status === "pending").length}</p></div><Clock className="h-8 w-8 text-amber-500" /></div></CardContent></Card>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedTx} onOpenChange={(o) => !o && setSelectedTx(null)}>
        <DialogContent className="max-w-lg">
          {selectedTx && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle>Transaction Details</DialogTitle>
                  <Badge variant={getStatusVariant(selectedTx.status)} className="capitalize">{selectedTx.status}</Badge>
                </div>
                <DialogDescription>{format(new Date(selectedTx.created_at), "PPP 'at' p")}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 bg-primary/5 rounded-lg text-center">
                  <p className="text-3xl font-bold">₦{selectedTx.amount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{selectedTx.currency}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Store className="h-3 w-3" /> Merchant</p>
                    <p className="font-medium">{selectedTx.merchant_name}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><CreditCard className="h-3 w-3" /> Method</p>
                    <p className="font-medium">{selectedTx.payment_method || "—"}</p>
                  </div>
                </div>
                {selectedTx.description && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><FileText className="h-3 w-3" /> Description</p>
                    <p className="text-sm">{selectedTx.description}</p>
                  </div>
                )}
                {selectedTx.reference && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Hash className="h-3 w-3" /> Reference</p>
                    <p className="text-sm font-mono">{selectedTx.reference}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Click any transaction for details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No transactions found</h3>
              <p className="text-muted-foreground">Scan a QR code to make your first payment</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setSelectedTx(tx)}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-medium">{tx.merchant_name}</h4>
                        {getStatusIcon(tx.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{tx.description || "Payment"}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(tx.created_at), "MMM d, yyyy")}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">₦{tx.amount.toLocaleString()}</p>
                    <Badge variant={getStatusVariant(tx.status)} className="capitalize">{tx.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerTransactions;
