import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, FileText, Send, Check, Trash2, Eye, Mail, User } from "lucide-react";
import { useInvoices, InvoiceItem, CreateInvoiceData } from "@/hooks/useInvoices";
import { useCurrencyRates } from "@/hooks/useCurrencyRates";
import { formatDistanceToNow, format } from "date-fns";

interface InvoiceManagerProps {
  merchantId: string | undefined;
}

const InvoiceManager = ({ merchantId }: InvoiceManagerProps) => {
  const { invoices, loading, createInvoice, sendInvoice, markAsPaid, deleteInvoice } = useInvoices(merchantId);
  const { formatCurrency, supportedCurrencies } = useCurrencyRates();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<typeof invoices[0] | null>(null);
  const [newInvoice, setNewInvoice] = useState<CreateInvoiceData & { recipient_name?: string; recipient_email?: string }>({
    items: [{ description: "", quantity: 1, unit_price: 0, amount: 0 }],
    tax_rate: 0,
    discount_amount: 0,
    currency: "NGN",
    notes: "",
    recipient_name: "",
    recipient_email: "",
  });

  const handleAddItem = () => {
    setNewInvoice((prev) => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: 1, unit_price: 0, amount: 0 }],
    }));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    setNewInvoice((prev) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      if (field === "quantity" || field === "unit_price") {
        const qty = field === "quantity" ? Number(value) : newItems[index].quantity;
        const price = field === "unit_price" ? Number(value) : newItems[index].unit_price;
        newItems[index].amount = qty * price;
      }
      return { ...prev, items: newItems };
    });
  };

  const handleRemoveItem = (index: number) => {
    setNewInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleCreate = async () => {
    try {
      await createInvoice(newInvoice);
      setIsCreateOpen(false);
      setNewInvoice({
        items: [{ description: "", quantity: 1, unit_price: 0, amount: 0 }],
        tax_rate: 0,
        discount_amount: 0,
        currency: "NGN",
        notes: "",
        recipient_name: "",
        recipient_email: "",
      });
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      draft: "secondary",
      sent: "outline",
      paid: "default",
      overdue: "destructive",
      cancelled: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const subtotal = newInvoice.items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = subtotal * ((newInvoice.tax_rate || 0) / 100);
  const total = subtotal + taxAmount - (newInvoice.discount_amount || 0);

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
          <h2 className="text-2xl font-bold">Invoices</h2>
          <p className="text-muted-foreground">Create and manage invoices</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
              <DialogDescription>Add items and recipient details for the invoice</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Recipient Section */}
              <div className="p-4 border rounded-lg space-y-3 bg-muted/30">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" /> Invoice Recipient
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Recipient Name</Label>
                    <Input
                      placeholder="John Doe"
                      value={newInvoice.recipient_name || ""}
                      onChange={(e) => setNewInvoice((prev) => ({ ...prev, recipient_name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Recipient Email</Label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={newInvoice.recipient_email || ""}
                      onChange={(e) => setNewInvoice((prev) => ({ ...prev, recipient_email: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3">
                <Label>Items</Label>
                {newInvoice.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-5">
                      <Input placeholder="Description" value={item.description} onChange={(e) => handleItemChange(index, "description", e.target.value)} />
                    </div>
                    <div className="col-span-2">
                      <Input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value) || 0)} />
                    </div>
                    <div className="col-span-2">
                      <Input type="number" placeholder="Price" value={item.unit_price} onChange={(e) => handleItemChange(index, "unit_price", parseFloat(e.target.value) || 0)} />
                    </div>
                    <div className="col-span-2">
                      <Input type="number" value={item.amount} readOnly className="bg-muted" />
                    </div>
                    <div className="col-span-1">
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index)} disabled={newInvoice.items.length === 1}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={handleAddItem}>
                  <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={newInvoice.currency} onValueChange={(value) => setNewInvoice((prev) => ({ ...prev, currency: value }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {supportedCurrencies.map((c) => (
                        <SelectItem key={c.code} value={c.code}>{c.symbol} {c.code} - {c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input type="date" value={newInvoice.due_date || ""} onChange={(e) => setNewInvoice((prev) => ({ ...prev, due_date: e.target.value }))} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tax Rate (%)</Label>
                  <Input type="number" value={newInvoice.tax_rate} onChange={(e) => setNewInvoice((prev) => ({ ...prev, tax_rate: parseFloat(e.target.value) || 0 }))} />
                </div>
                <div className="space-y-2">
                  <Label>Discount Amount</Label>
                  <Input type="number" value={newInvoice.discount_amount} onChange={(e) => setNewInvoice((prev) => ({ ...prev, discount_amount: parseFloat(e.target.value) || 0 }))} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea placeholder="Additional notes..." value={newInvoice.notes} onChange={(e) => setNewInvoice((prev) => ({ ...prev, notes: e.target.value }))} />
              </div>

              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between"><span>Subtotal:</span><span>{formatCurrency(subtotal, newInvoice.currency || "NGN")}</span></div>
                <div className="flex justify-between"><span>Tax ({newInvoice.tax_rate}%):</span><span>{formatCurrency(taxAmount, newInvoice.currency || "NGN")}</span></div>
                <div className="flex justify-between"><span>Discount:</span><span>-{formatCurrency(newInvoice.discount_amount || 0, newInvoice.currency || "NGN")}</span></div>
                <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total:</span><span>{formatCurrency(total, newInvoice.currency || "NGN")}</span></div>
              </div>

              <Button className="w-full" onClick={handleCreate}>Create Invoice</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Detail View Dialog */}
      <Dialog open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedInvoice && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl">{selectedInvoice.invoice_number}</DialogTitle>
                  {getStatusBadge(selectedInvoice.status)}
                </div>
                <DialogDescription>
                  Created {format(new Date(selectedInvoice.created_at), "PPP")}
                  {selectedInvoice.due_date && ` • Due ${format(new Date(selectedInvoice.due_date), "PPP")}`}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {/* Recipient info */}
                {((selectedInvoice as any).recipient_name || (selectedInvoice as any).recipient_email) && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium flex items-center gap-2"><Mail className="h-4 w-4" /> Recipient</p>
                    <p className="text-sm">{(selectedInvoice as any).recipient_name}</p>
                    <p className="text-sm text-muted-foreground">{(selectedInvoice as any).recipient_email}</p>
                  </div>
                )}

                {/* Items Table */}
                <div>
                  <Label className="text-sm font-semibold">Line Items</Label>
                  <div className="mt-2 border rounded-lg overflow-hidden">
                    <div className="grid grid-cols-12 gap-2 p-3 bg-muted/50 text-xs font-medium">
                      <div className="col-span-5">Description</div>
                      <div className="col-span-2 text-right">Qty</div>
                      <div className="col-span-2 text-right">Unit Price</div>
                      <div className="col-span-3 text-right">Amount</div>
                    </div>
                    {selectedInvoice.items.map((item, i) => (
                      <div key={i} className="grid grid-cols-12 gap-2 p-3 border-t text-sm">
                        <div className="col-span-5">{item.description || "—"}</div>
                        <div className="col-span-2 text-right">{item.quantity}</div>
                        <div className="col-span-2 text-right">{formatCurrency(item.unit_price, selectedInvoice.currency)}</div>
                        <div className="col-span-3 text-right font-medium">{formatCurrency(item.amount, selectedInvoice.currency)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(selectedInvoice.subtotal, selectedInvoice.currency)}</span></div>
                  {selectedInvoice.tax_amount > 0 && <div className="flex justify-between"><span>Tax ({selectedInvoice.tax_rate}%)</span><span>{formatCurrency(selectedInvoice.tax_amount, selectedInvoice.currency)}</span></div>}
                  {selectedInvoice.discount_amount > 0 && <div className="flex justify-between"><span>Discount</span><span>-{formatCurrency(selectedInvoice.discount_amount, selectedInvoice.currency)}</span></div>}
                  <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total</span><span>{formatCurrency(selectedInvoice.total, selectedInvoice.currency)}</span></div>
                </div>

                {selectedInvoice.notes && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium">Notes</p>
                    <p className="text-sm text-muted-foreground">{selectedInvoice.notes}</p>
                  </div>
                )}

                {selectedInvoice.paid_at && (
                  <div className="p-3 bg-emerald-50 border-emerald-200 border rounded-lg">
                    <p className="text-sm font-medium text-emerald-700">Paid on {format(new Date(selectedInvoice.paid_at), "PPP")}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  {selectedInvoice.status === "draft" && (
                    <Button variant="outline" onClick={() => { sendInvoice(selectedInvoice.id); setSelectedInvoice(null); }}>
                      <Send className="mr-2 h-4 w-4" /> Send
                    </Button>
                  )}
                  {selectedInvoice.status === "sent" && (
                    <Button onClick={() => { markAsPaid(selectedInvoice.id); setSelectedInvoice(null); }}>
                      <Check className="mr-2 h-4 w-4" /> Mark Paid
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {invoices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No invoices yet</p>
            <p className="text-sm text-muted-foreground">Create your first invoice to get started</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {invoices.map((invoice) => (
            <Card key={invoice.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedInvoice(invoice)}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-lg">{invoice.invoice_number}</CardTitle>
                      <CardDescription>
                        Created {formatDistanceToNow(new Date(invoice.created_at), { addSuffix: true })}
                      </CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(invoice.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">{formatCurrency(invoice.total, invoice.currency)}</p>
                    <p className="text-sm text-muted-foreground">{invoice.items.length} item{invoice.items.length !== 1 ? "s" : ""}</p>
                  </div>
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedInvoice(invoice)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {invoice.status === "draft" && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => sendInvoice(invoice.id)}>
                          <Send className="mr-2 h-4 w-4" /> Send
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteInvoice(invoice.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {invoice.status === "sent" && (
                      <Button variant="outline" size="sm" onClick={() => markAsPaid(invoice.id)}>
                        <Check className="mr-2 h-4 w-4" /> Mark Paid
                      </Button>
                    )}
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

export default InvoiceManager;
