import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Plus, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle,
  MessageSquare 
} from "lucide-react";
import { useDisputes, Dispute, CreateDisputeData } from "@/hooks/useDisputes";
import { useCurrencyRates } from "@/hooks/useCurrencyRates";
import { formatDistanceToNow } from "date-fns";

interface DisputesCenterProps {
  merchantId: string | undefined;
  isAdmin?: boolean;
}

const DisputesCenter = ({ merchantId, isAdmin = false }: DisputesCenterProps) => {
  const {
    disputes,
    loading,
    createDispute,
    updateDisputeStatus,
    getDisputeStats,
  } = useDisputes(merchantId, isAdmin);
  const { formatCurrency } = useCurrencyRates();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [newDispute, setNewDispute] = useState<CreateDisputeData>({
    reason: "not_received",
    description: "",
    amount: 0,
  });
  const [resolutionNotes, setResolutionNotes] = useState("");

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

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
      open: { variant: "destructive", icon: <AlertTriangle className="h-3 w-3" /> },
      under_review: { variant: "secondary", icon: <Clock className="h-3 w-3" /> },
      resolved_merchant: { variant: "default", icon: <CheckCircle className="h-3 w-3" /> },
      resolved_customer: { variant: "default", icon: <CheckCircle className="h-3 w-3" /> },
      closed: { variant: "outline", icon: <XCircle className="h-3 w-3" /> },
    };
    const { variant, icon } = config[status] || { variant: "outline", icon: null };
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        {icon}
        {status.replace("_", " ")}
      </Badge>
    );
  };

  const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      fraud: "Suspected Fraud",
      not_received: "Item Not Received",
      not_as_described: "Not as Described",
      duplicate: "Duplicate Charge",
      other: "Other",
    };
    return labels[reason] || reason;
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
          <h2 className="text-2xl font-bold">Dispute Resolution Center</h2>
          <p className="text-muted-foreground">Manage and resolve payment disputes</p>
        </div>
        {!isAdmin && (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                File Dispute
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>File a Dispute</DialogTitle>
                <DialogDescription>
                  Provide details about the disputed transaction
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Select
                    value={newDispute.reason}
                    onValueChange={(value) => setNewDispute((prev) => ({ ...prev, reason: value as Dispute["reason"] }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
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
                  <Label>Disputed Amount</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={newDispute.amount || ""}
                    onChange={(e) => setNewDispute((prev) => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe the issue in detail..."
                    value={newDispute.description}
                    onChange={(e) => setNewDispute((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <Button className="w-full" onClick={handleCreate} disabled={!newDispute.amount}>
                  Submit Dispute
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-red-600">Open</p>
                <p className="text-2xl font-bold text-red-900">{stats.open}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-sm text-amber-600">Under Review</p>
                <p className="text-2xl font-bold text-amber-900">{stats.underReview}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm text-emerald-600">Resolved</p>
                <p className="text-2xl font-bold text-emerald-900">{stats.resolved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-blue-600">Total Amount</p>
              <p className="text-2xl font-bold text-blue-900">
                {formatCurrency(stats.totalAmount, "NGN")}
              </p>
            </div>
          </CardContent>
        </Card>
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
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No disputes filed</p>
              </CardContent>
            </Card>
          ) : (
            disputes.map((dispute) => (
              <Card key={dispute.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getReasonLabel(dispute.reason)}
                      </CardTitle>
                      <CardDescription>
                        Filed {formatDistanceToNow(new Date(dispute.created_at), { addSuffix: true })}
                      </CardDescription>
                    </div>
                    {getStatusBadge(dispute.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">
                        {formatCurrency(dispute.amount, "NGN")}
                      </p>
                      {dispute.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {dispute.description}
                        </p>
                      )}
                    </div>
                    {isAdmin && dispute.status === "open" && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateDisputeStatus(dispute.id, "under_review")}
                        >
                          Start Review
                        </Button>
                      </div>
                    )}
                    {isAdmin && dispute.status === "under_review" && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" onClick={() => setSelectedDispute(dispute)}>
                            Resolve
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Resolve Dispute</DialogTitle>
                            <DialogDescription>
                              Choose a resolution for this dispute
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Resolution Notes</Label>
                              <Textarea
                                placeholder="Add notes about the resolution..."
                                value={resolutionNotes}
                                onChange={(e) => setResolutionNotes(e.target.value)}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                variant="outline"
                                onClick={() => handleResolve(dispute.id, "resolved_merchant")}
                              >
                                Favor Merchant
                              </Button>
                              <Button
                                onClick={() => handleResolve(dispute.id, "resolved_customer")}
                              >
                                Favor Customer
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  {dispute.resolution_notes && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium">Resolution Notes:</p>
                      <p className="text-sm text-muted-foreground">{dispute.resolution_notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {["open", "under_review", "resolved"].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4 mt-4">
            {disputes
              .filter((d) => 
                status === "resolved" 
                  ? ["resolved_merchant", "resolved_customer", "closed"].includes(d.status)
                  : d.status === status
              )
              .map((dispute) => (
                <Card key={dispute.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{getReasonLabel(dispute.reason)}</CardTitle>
                      {getStatusBadge(dispute.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{formatCurrency(dispute.amount, "NGN")}</p>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default DisputesCenter;
