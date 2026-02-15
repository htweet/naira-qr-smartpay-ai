import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, AlertTriangle, Clock, CheckCircle, XCircle, MessageSquare, Eye, Send
} from "lucide-react";
import { useDisputes, Dispute, CreateDisputeData } from "@/hooks/useDisputes";
import { useCurrencyRates } from "@/hooks/useCurrencyRates";
import { formatDistanceToNow, format } from "date-fns";

interface DisputesCenterProps {
  merchantId: string | undefined;
  isAdmin?: boolean;
}

const DisputesCenter = ({ merchantId, isAdmin = false }: DisputesCenterProps) => {
  const {
    disputes, loading, createDispute, updateDisputeStatus, respondToDispute, getDisputeStats,
  } = useDisputes(merchantId, isAdmin);
  const { formatCurrency } = useCurrencyRates();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [newDispute, setNewDispute] = useState<CreateDisputeData>({
    reason: "not_received", description: "", amount: 0,
  });
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [merchantResponseText, setMerchantResponseText] = useState("");

  const stats = getDisputeStats();

  const handleCreate = async () => {
    try {
      await createDispute(newDispute);
      setIsCreateOpen(false);
      setNewDispute({ reason: "not_received", description: "", amount: 0 });
    } catch (error) {
      console.error("Error creating dispute:", error);
    }
  };

  const handleResolve = async (id: string, resolution: Dispute["status"]) => {
    try {
      await updateDisputeStatus(id, resolution, resolutionNotes);
      setSelectedDispute(null);
      setResolutionNotes("");
    } catch (error) {
      console.error("Error resolving dispute:", error);
    }
  };

  const handleMerchantResponse = async () => {
    if (!selectedDispute || !merchantResponseText.trim()) return;
    try {
      await respondToDispute(selectedDispute.id, merchantResponseText);
      setMerchantResponseText("");
      setSelectedDispute({ ...selectedDispute, merchant_response: merchantResponseText, merchant_response_at: new Date().toISOString() });
    } catch (error) {
      console.error("Error responding to dispute:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
      open: { variant: "destructive", icon: <AlertTriangle className="h-3 w-3" /> },
      under_review: { variant: "secondary", icon: <Clock className="h-3 w-3" /> },
      resolved_merchant: { variant: "default", icon: <CheckCircle className="h-3 w-3" /> },
      resolved_customer: { variant: "default", icon: <CheckCircle className="h-3 w-3" /> },
      closed: { variant: "outline", icon: <XCircle className="h-3 w-3" /> },
    };
    const { variant, icon } = config[status] || { variant: "outline" as const, icon: null };
    return <Badge variant={variant} className="flex items-center gap-1">{icon}{status.replace("_", " ")}</Badge>;
  };

  const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      fraud: "Suspected Fraud", not_received: "Item Not Received",
      not_as_described: "Not as Described", duplicate: "Duplicate Charge", other: "Other",
    };
    return labels[reason] || reason;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" /></div>;
  }

  const renderDisputeCard = (dispute: Dispute) => (
    <Card key={dispute.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedDispute(dispute)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">{getReasonLabel(dispute.reason)}</CardTitle>
            <CardDescription>Filed {formatDistanceToNow(new Date(dispute.created_at), { addSuffix: true })}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {dispute.merchant_response && <Badge variant="outline" className="text-xs"><MessageSquare className="h-3 w-3 mr-1" />Responded</Badge>}
            {getStatusBadge(dispute.status)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-2xl font-bold">{formatCurrency(dispute.amount, "NGN")}</p>
            {dispute.description && <p className="text-sm text-muted-foreground line-clamp-2">{dispute.description}</p>}
          </div>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedDispute(dispute); }}>
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dispute Resolution Center</h2>
          <p className="text-muted-foreground">Manage and resolve payment disputes</p>
        </div>
        {!isAdmin && (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" />File Dispute</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>File a Dispute</DialogTitle>
                <DialogDescription>Provide details about the disputed transaction</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Select value={newDispute.reason} onValueChange={(value) => setNewDispute((prev) => ({ ...prev, reason: value as Dispute["reason"] }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fraud">Suspected Fraud</SelectItem>
                      <SelectItem value="not_received">Item Not Received</SelectItem>
                      <SelectItem value="not_as_described">Not as Described</SelectItem>
                      <SelectItem value="duplicate">Duplicate Charge</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Transaction ID (Optional)</Label>
                  <Input placeholder="TXN-..." value={newDispute.transaction_id || ""} onChange={(e) => setNewDispute((prev) => ({ ...prev, transaction_id: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Disputed Amount</Label>
                  <Input type="number" placeholder="0.00" value={newDispute.amount || ""} onChange={(e) => setNewDispute((prev) => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))} />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Describe the issue in detail..." value={newDispute.description} onChange={(e) => setNewDispute((prev) => ({ ...prev, description: e.target.value }))} />
                </div>
                <Button className="w-full" onClick={handleCreate} disabled={!newDispute.amount || !newDispute.description}>Submit Dispute</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Detail View Dialog */}
      <Dialog open={!!selectedDispute} onOpenChange={(open) => { if (!open) { setSelectedDispute(null); setMerchantResponseText(""); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedDispute && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl">{getReasonLabel(selectedDispute.reason)}</DialogTitle>
                  {getStatusBadge(selectedDispute.status)}
                </div>
                <DialogDescription>Filed {format(new Date(selectedDispute.created_at), "PPP 'at' p")}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="text-xl font-bold">{formatCurrency(selectedDispute.amount, "NGN")}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Dispute ID</p>
                    <p className="text-sm font-mono">{selectedDispute.id.slice(0, 12)}...</p>
                  </div>
                </div>

                {selectedDispute.description && (
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm font-medium mb-1">Description</p>
                    <p className="text-sm text-muted-foreground">{selectedDispute.description}</p>
                  </div>
                )}

                <Separator />

                {/* Merchant Response Section */}
                {selectedDispute.merchant_response ? (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" /> Merchant Response
                    </p>
                    <p className="text-sm text-blue-800 mt-1">{selectedDispute.merchant_response}</p>
                    {selectedDispute.merchant_response_at && (
                      <p className="text-xs text-blue-600 mt-2">{format(new Date(selectedDispute.merchant_response_at), "PPP 'at' p")}</p>
                    )}
                  </div>
                ) : !isAdmin && selectedDispute.status !== "closed" && !selectedDispute.status.startsWith("resolved") ? (
                  <div className="p-4 border rounded-lg space-y-3">
                    <Label className="flex items-center gap-2"><Send className="h-4 w-4" /> Submit Your Response</Label>
                    <Textarea
                      placeholder="Provide your response, evidence, or explanation..."
                      value={merchantResponseText}
                      onChange={(e) => setMerchantResponseText(e.target.value)}
                      rows={4}
                    />
                    <Button onClick={handleMerchantResponse} disabled={!merchantResponseText.trim()} className="w-full">
                      <Send className="mr-2 h-4 w-4" /> Submit Response
                    </Button>
                  </div>
                ) : null}

                {selectedDispute.resolution_notes && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <p className="text-sm font-medium text-emerald-900">Resolution Notes</p>
                    <p className="text-sm text-emerald-800 mt-1">{selectedDispute.resolution_notes}</p>
                  </div>
                )}

                {/* Admin Actions */}
                {isAdmin && selectedDispute.status === "open" && (
                  <Button variant="outline" onClick={() => { updateDisputeStatus(selectedDispute.id, "under_review"); setSelectedDispute(null); }}>
                    Start Review
                  </Button>
                )}
                {isAdmin && selectedDispute.status === "under_review" && (
                  <div className="space-y-3">
                    <Textarea placeholder="Add resolution notes..." value={resolutionNotes} onChange={(e) => setResolutionNotes(e.target.value)} />
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" onClick={() => handleResolve(selectedDispute.id, "resolved_merchant")}>Favor Merchant</Button>
                      <Button onClick={() => handleResolve(selectedDispute.id, "resolved_customer")}>Favor Customer</Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-red-50 border-red-200"><CardContent className="p-4"><div className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-red-600" /><div><p className="text-sm text-red-600">Open</p><p className="text-2xl font-bold text-red-900">{stats.open}</p></div></div></CardContent></Card>
        <Card className="bg-amber-50 border-amber-200"><CardContent className="p-4"><div className="flex items-center gap-2"><Clock className="h-5 w-5 text-amber-600" /><div><p className="text-sm text-amber-600">Under Review</p><p className="text-2xl font-bold text-amber-900">{stats.underReview}</p></div></div></CardContent></Card>
        <Card className="bg-emerald-50 border-emerald-200"><CardContent className="p-4"><div className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-emerald-600" /><div><p className="text-sm text-emerald-600">Resolved</p><p className="text-2xl font-bold text-emerald-900">{stats.resolved}</p></div></div></CardContent></Card>
        <Card className="bg-blue-50 border-blue-200"><CardContent className="p-4"><div><p className="text-sm text-blue-600">Total Amount</p><p className="text-2xl font-bold text-blue-900">{formatCurrency(stats.totalAmount, "NGN")}</p></div></CardContent></Card>
      </div>

      {/* Disputes List */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="open">Open ({stats.open})</TabsTrigger>
          <TabsTrigger value="under_review">Under Review ({stats.underReview})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({stats.resolved})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-4">
          {disputes.length === 0 ? (
            <Card><CardContent className="flex flex-col items-center justify-center py-12"><MessageSquare className="h-12 w-12 text-muted-foreground mb-4" /><p className="text-muted-foreground">No disputes filed</p></CardContent></Card>
          ) : disputes.map(renderDisputeCard)}
        </TabsContent>

        {["open", "under_review", "resolved"].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4 mt-4">
            {disputes
              .filter((d) => status === "resolved" ? ["resolved_merchant", "resolved_customer", "closed"].includes(d.status) : d.status === status)
              .map(renderDisputeCard)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default DisputesCenter;
