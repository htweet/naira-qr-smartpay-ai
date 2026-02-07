import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DataTable from "@/components/admin/DataTable";
import StatsCard from "@/components/admin/StatsCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CreditCard, TrendingUp, Clock, AlertTriangle, CheckCircle } from "lucide-react";

interface Transaction {
  id: string;
  amount: number;
  status: string | null;
  merchant_id: string;
  customer_id: string | null;
  description: string | null;
  payment_method: string | null;
  reference: string | null;
  currency: string | null;
  created_at: string;
}

const TransactionMonitor = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    failed: 0,
    totalAmount: 0,
  });

  const fetchTransactions = async () => {
    try {
      let query = supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      const txList = data || [];
      setTransactions(txList);

      // Calculate stats
      const completed = txList.filter((tx) => tx.status === "completed");
      const pending = txList.filter((tx) => tx.status === "pending");
      const failed = txList.filter((tx) => tx.status === "failed");

      setStats({
        total: txList.length,
        completed: completed.length,
        pending: pending.length,
        failed: failed.length,
        totalAmount: completed.reduce((sum, tx) => sum + Number(tx.amount), 0),
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [statusFilter]);

  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("admin-transactions")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "transactions",
        },
        (payload) => {
          console.log("Transaction update:", payload);
          fetchTransactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [statusFilter]);

  const handleUpdateStatus = async (transactionId: string, newStatus: string) => {
    try {
      // Note: This would need an admin policy to work
      toast({
        title: "Status Update",
        description: `Transaction status update to ${newStatus} requires backend implementation`,
      });
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const columns = [
    {
      key: "id",
      label: "Transaction ID",
      render: (value: unknown) => (
        <span className="font-mono text-sm">{String(value).slice(0, 8)}...</span>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (value: unknown, row: Record<string, unknown>) => (
        <span className="font-semibold">
          {String(row.currency || "₦")}{Number(value).toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: unknown) => (
        <Badge
          variant={
            value === "completed"
              ? "default"
              : value === "pending"
              ? "secondary"
              : "destructive"
          }
        >
          {String(value)}
        </Badge>
      ),
    },
    {
      key: "payment_method",
      label: "Method",
      render: (value: unknown) => String(value || "N/A"),
    },
    {
      key: "description",
      label: "Description",
      render: (value: unknown) => (
        <span className="truncate max-w-xs block">{String(value || "-")}</span>
      ),
    },
    {
      key: "created_at",
      label: "Date",
      render: (value: unknown) => {
        const date = new Date(String(value));
        return (
          <div className="text-sm">
            <div>{date.toLocaleDateString()}</div>
            <div className="text-muted-foreground">{date.toLocaleTimeString()}</div>
          </div>
        );
      },
    },
  ];

  const actions = [
    {
      label: "View Details",
      onClick: (row: Record<string, unknown>) => {
        toast({
          title: "Transaction Details",
          description: `ID: ${row.id}\nAmount: ₦${Number(row.amount).toLocaleString()}\nStatus: ${row.status}`,
        });
      },
    },
    {
      label: "Mark as Completed",
      onClick: (row: Record<string, unknown>) =>
        handleUpdateStatus(String(row.id), "completed"),
    },
    {
      label: "Mark as Failed",
      onClick: (row: Record<string, unknown>) =>
        handleUpdateStatus(String(row.id), "failed"),
      variant: "destructive" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transaction Monitor</h1>
          <p className="text-muted-foreground">
            Monitor all platform transactions in real-time
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => fetchTransactions()}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Total Transactions"
          value={stats.total}
          icon={CreditCard}
          iconColor="text-blue-600"
          bgColor="bg-blue-100"
        />
        <StatsCard
          title="Total Amount"
          value={`₦${stats.totalAmount.toLocaleString()}`}
          icon={TrendingUp}
          iconColor="text-emerald-600"
          bgColor="bg-emerald-100"
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle}
          iconColor="text-emerald-600"
          bgColor="bg-emerald-100"
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          iconColor="text-amber-600"
          bgColor="bg-amber-100"
        />
        <StatsCard
          title="Failed"
          value={stats.failed}
          icon={AlertTriangle}
          iconColor="text-red-600"
          bgColor="bg-red-100"
        />
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            All Transactions
          </CardTitle>
          <CardDescription>
            Real-time transaction monitoring with filtering
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={transactions as unknown as Record<string, unknown>[]}
            actions={actions}
            loading={loading}
            searchPlaceholder="Search transactions..."
            pageSize={15}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionMonitor;
