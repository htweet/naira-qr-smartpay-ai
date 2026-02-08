import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Lock, Unlock, AlertTriangle, RefreshCcw, Shield } from "lucide-react";
import { useEscrow, CreateEscrowData } from "@/hooks/useEscrow";
import { useCurrencyRates } from "@/hooks/useCurrencyRates";
import { formatDistanceToNow } from "date-fns";

interface EscrowManagerProps {
  merchantId: string | undefined;
}

const EscrowManager = ({ merchantId }: EscrowManagerProps) => {
  const {
    escrows,
    loading,
    createEscrow,
    releaseEscrow,
    refundEscrow,
    disputeEscrow,
    getEscrowStats,
  } = useEscrow(merchantId);
  const { formatCurrency, supportedCurrencies } = useCurrencyRates();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [disputingId, setDisputingId] = useState<string | null>(null);
  const [newEscrow, setNewEscrow] = useState<CreateEscrowData>({
    amount: 0,
    currency: "NGN",
    release_conditions: "",
  });

  const stats = getEscrowStats();

  const handleCreate = async () => {
    try {
      await createEscrow(newEscrow);
      setIsCreateOpen(false);
      setNewEscrow({ amount: 0, currency: "NGN", release_conditions: "" });
    } catch (error) {
      console.error("Error creating escrow:", error);
    }
  };

  const handleDispute = async (id: string) => {
    try {
      await disputeEscrow(id, disputeReason);
      setDisputingId(null);
      setDisputeReason("");
    } catch (error) {
      console.error("Error disputing escrow:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
      held: { variant: "secondary", icon: <Lock className="h-3 w-3" /> },
      released: { variant: "default", icon: <Unlock className="h-3 w-3" /> },
      disputed: { variant: "destructive", icon: <AlertTriangle className="h-3 w-3" /> },
      refunded: { variant: "outline", icon: <RefreshCcw className="h-3 w-3" /> },
    };
    const { variant, icon } = config[status] || { variant: "outline", icon: null };
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        {icon}
        {status}
      </Badge>
    );
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
          <h2 className="text-2xl font-bold">Escrow Services</h2>
          <p className="text-muted-foreground">Secure payment holding for transactions</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Lock className="mr-2 h-4 w-4" />
              Create Escrow
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Escrow</DialogTitle>
              <DialogDescription>
                Hold funds securely until conditions are met
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={newEscrow.amount || ""}
                  onChange={(e) => setNewEscrow((prev) => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Release Conditions</Label>
                <Textarea
                  placeholder="Describe the conditions for releasing funds..."
                  value={newEscrow.release_conditions}
                  onChange={(e) => setNewEscrow((prev) => ({ ...prev, release_conditions: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Release Date (Optional)</Label>
                <Input
                  type="date"
                  value={newEscrow.release_date || ""}
                  onChange={(e) => setNewEscrow((prev) => ({ ...prev, release_date: e.target.value }))}
                />
              </div>

              <Button className="w-full" onClick={handleCreate} disabled={!newEscrow.amount}>
                Create Escrow
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-sm text-amber-600">Held</p>
                <p className="text-2xl font-bold text-amber-900">{stats.held}</p>
                <p className="text-sm text-amber-600">{formatCurrency(stats.heldAmount, "NGN")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Unlock className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm text-emerald-600">Released</p>
                <p className="text-2xl font-bold text-emerald-900">{stats.released}</p>
                <p className="text-sm text-emerald-600">{formatCurrency(stats.releasedAmount, "NGN")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-red-600">Disputed</p>
                <p className="text-2xl font-bold text-red-900">{stats.disputed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <RefreshCcw className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-blue-600">Refunded</p>
                <p className="text-2xl font-bold text-blue-900">{stats.refunded}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Escrow List */}
      {escrows.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No escrow transactions</p>
            <p className="text-sm text-muted-foreground">Create an escrow to hold funds securely</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {escrows.map((escrow) => (
            <Card key={escrow.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Escrow #{escrow.id.slice(0, 8)}
                    </CardTitle>
                    <CardDescription>
                      Created {formatDistanceToNow(new Date(escrow.created_at), { addSuffix: true })}
                    </CardDescription>
                  </div>
                  {getStatusBadge(escrow.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">
                      {formatCurrency(escrow.amount, escrow.currency)}
                    </p>
                    {escrow.release_conditions && (
                      <p className="text-sm text-muted-foreground">
                        Conditions: {escrow.release_conditions}
                      </p>
                    )}
                    {escrow.dispute_reason && (
                      <p className="text-sm text-red-600">
                        Dispute: {escrow.dispute_reason}
                      </p>
                    )}
                  </div>
                  {escrow.status === "held" && (
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => releaseEscrow(escrow.id)}
                      >
                        <Unlock className="mr-2 h-4 w-4" />
                        Release
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refundEscrow(escrow.id)}
                      >
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Refund
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDisputingId(escrow.id)}
                          >
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Dispute
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>File Dispute</DialogTitle>
                            <DialogDescription>
                              Explain why you're disputing this escrow
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Reason</Label>
                              <Textarea
                                placeholder="Describe the dispute reason..."
                                value={disputeReason}
                                onChange={(e) => setDisputeReason(e.target.value)}
                              />
                            </div>
                            <Button
                              className="w-full"
                              variant="destructive"
                              onClick={() => handleDispute(escrow.id)}
                              disabled={!disputeReason}
                            >
                              Submit Dispute
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
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
