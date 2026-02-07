import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertTriangle, Activity } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Transaction {
  id: string;
  amount: number;
  status: string | null;
  customer_id: string | null;
  description: string | null;
  payment_method: string | null;
  created_at: string;
  reference: string | null;
}

interface RecentTransactionsListProps {
  transactions: Transaction[];
  isConnected?: boolean;
}

const RecentTransactionsList = ({
  transactions,
  isConnected = false,
}: RecentTransactionsListProps) => {
  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string | null) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: "default",
      pending: "secondary",
      failed: "destructive",
    };
    return (
      <Badge variant={variants[status || ""] || "outline"}>
        {status || "unknown"}
      </Badge>
    );
  };

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Activity className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No transactions yet</p>
        <p className="text-sm text-muted-foreground">
          Transactions will appear here when customers pay
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {isConnected && (
        <div className="flex items-center gap-2 text-xs text-emerald-600">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          Live updates enabled
        </div>
      )}
      
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
        >
          <div className="flex items-center gap-3">
            {getStatusIcon(transaction.status)}
            <div>
              <p className="font-medium">
                {transaction.description || "Payment"}
              </p>
              <p className="text-sm text-muted-foreground">
                {transaction.reference?.slice(0, 12) || transaction.id.slice(0, 8)} •{" "}
                {formatDistanceToNow(new Date(transaction.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold">
              ₦{transaction.amount.toLocaleString()}
            </p>
            <div className="flex items-center gap-2 justify-end">
              {getStatusBadge(transaction.status)}
              {transaction.payment_method && (
                <Badge variant="outline" className="text-xs">
                  {transaction.payment_method}
                </Badge>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentTransactionsList;
