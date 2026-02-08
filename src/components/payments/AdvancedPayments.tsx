import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, RefreshCw, Shield, AlertTriangle, Globe, Split } from "lucide-react";
import InvoiceManager from "@/components/invoices/InvoiceManager";
import RecurringPaymentsManager from "@/components/recurring/RecurringPaymentsManager";
import EscrowManager from "@/components/escrow/EscrowManager";
import DisputesCenter from "@/components/disputes/DisputesCenter";
import CurrencyConverter from "@/components/currency/CurrencyConverter";
import SplitPaymentsManager from "@/components/splitpay/SplitPaymentsManager";

interface AdvancedPaymentsProps {
  merchantId: string | undefined;
}

const AdvancedPayments = ({ merchantId }: AdvancedPaymentsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Advanced Payments</h1>
        <p className="text-muted-foreground">
          Invoicing, recurring payments, escrow, and more
        </p>
      </div>

      <Tabs defaultValue="invoices" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Invoices</span>
          </TabsTrigger>
          <TabsTrigger value="recurring" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Recurring</span>
          </TabsTrigger>
          <TabsTrigger value="split" className="flex items-center gap-2">
            <Split className="h-4 w-4" />
            <span className="hidden sm:inline">Split Pay</span>
          </TabsTrigger>
          <TabsTrigger value="escrow" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Escrow</span>
          </TabsTrigger>
          <TabsTrigger value="disputes" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Disputes</span>
          </TabsTrigger>
          <TabsTrigger value="currency" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Currency</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="invoices">
          <InvoiceManager merchantId={merchantId} />
        </TabsContent>

        <TabsContent value="recurring">
          <RecurringPaymentsManager merchantId={merchantId} />
        </TabsContent>

        <TabsContent value="split">
          <SplitPaymentsManager merchantId={merchantId} />
        </TabsContent>

        <TabsContent value="escrow">
          <EscrowManager merchantId={merchantId} />
        </TabsContent>

        <TabsContent value="disputes">
          <DisputesCenter merchantId={merchantId} />
        </TabsContent>

        <TabsContent value="currency">
          <CurrencyConverter />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedPayments;
