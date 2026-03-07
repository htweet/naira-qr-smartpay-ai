

## Implementation Plan: Remaining Features

This plan covers all outstanding items in parallel: billing with Flutterwave, payment sync between customers/merchants, transaction detail views, QR code detail views, customer-merchant relationship in advanced payments, and QR scanner production readiness.

---

### 1. Database Migration

Add tables/columns needed:

- **`subscriptions` table**: `id`, `user_id`, `merchant_id`, `plan_id` (text: basic/premium/enterprise), `status` (active/cancelled/past_due), `amount`, `currency`, `interval`, `current_period_start`, `current_period_end`, `flutterwave_tx_ref`, `created_at`, `updated_at`. RLS: users see own, admins see all.
- **`billing_history` table**: `id`, `subscription_id`, `user_id`, `amount`, `currency`, `status`, `description`, `payment_reference`, `paid_at`, `created_at`. RLS: users see own, admins see all.
- Add `customer_name` and `customer_email` columns to `recurring_payments`, `split_payments`, and `escrow` tables so merchants can tag which customer each item is for.
- Enable realtime on `transactions` table (already done) and `subscriptions`.

### 2. Subscription Billing with Flutterwave (`SubscriptionBilling.tsx`)

Replace hardcoded billing data with real database-backed subscriptions:

- Fetch current subscription from `subscriptions` table for the logged-in merchant.
- Fetch billing history from `billing_history` table.
- "Subscribe" / "Upgrade" buttons invoke the existing `flutterwave-nqr` edge function or a new `create-subscription-payment` edge function that initiates a Flutterwave Standard payment with the plan amount.
- On payment callback/verification, insert into `subscriptions` and `billing_history`.
- Show real usage stats by querying QR codes count, transactions count, etc.

### 3. Customer Transaction Detail View (`CustomerTransactions.tsx`)

Replace mock data with real database queries:

- Fetch transactions where `customer_id` matches the authenticated user's customer records.
- Add a clickable detail dialog showing: amount, status, merchant name (join via `merchant_id`), payment method, reference, timestamp, and description.
- Include merchant name resolution by joining `transactions.merchant_id` → `merchants.business_name`.

### 4. QR Code Detail View for Merchants (`QRList.tsx`)

Add a detail dialog when clicking a QR code in the list:

- Show: QR code ID, type, amount, description, gateway, colors, creation date, scan/payment/revenue stats.
- Render an actual QR code preview using the stored config (primary_color, pattern, etc.).
- Include action buttons: copy link, download, edit (opens edit dialog), delete, toggle active/inactive status.

### 5. Customer-Merchant Relationship in Advanced Payments

Update `InvoiceManager`, `RecurringPaymentsManager`, `SplitPaymentsManager`, `EscrowManager`, and `DisputesCenter`:

- Add a customer selector/input in each create form. Fetch the merchant's customers from the `customers` table and show a dropdown + manual entry option.
- For invoices: already has `recipient_name`/`recipient_email` — also link to `customer_id` via dropdown.
- For recurring: add `customer_name`/`customer_email` fields to the form and persist to the new columns.
- For split pay: add customer name field to each recipient row.
- For escrow: add customer selector to the create form.
- For disputes: show the customer name in the detail view.
- In each list view, display the customer name alongside the item.

### 6. Payment Sync Flow (Customer ↔ Merchant)

Create a real payment flow linking QR scan → transaction → merchant notification:

- When a customer scans a QR code and pays (via NQR), create a `transaction` record with both `merchant_id` (from QR code) and `customer_id` (from logged-in customer).
- Update the merchant's `total_revenue` and `total_transactions` via a database trigger or in the edge function.
- Update the customer's `total_spent` and `total_transactions` similarly.
- Both merchant and customer dashboards already use realtime subscriptions on `transactions`, so new payments appear live.

### 7. QR Scanner Production Readiness

Enhance `QRScanner.tsx`:

- Add camera-based scanning using the browser's `MediaDevices` API + a lightweight JS QR decoder (implement inline without new dependency — use canvas-based decoding or the existing `BarcodeDetector` API where available).
- Add scan animation overlay when camera is active.
- Improve the payment flow: after scanning, if the QR code has a fixed amount, proceed directly; if variable, show amount input.
- After payment initiation, create a real transaction record linking the customer to the merchant.
- Show payment confirmation with receipt details.

### 8. Admin Panel Sync

Ensure admin views reflect all new data:

- `MerchantManagement`: show subscription status per merchant.
- `CustomerManagement`: show total_spent, recent transactions.
- `TransactionMonitor`: already fetches all transactions with admin RLS.
- `SystemSettings`: already persists. Add subscription plan configuration section.

### 9. Files to Create/Modify

**New files:**
- `supabase/functions/create-subscription-payment/index.ts` — Flutterwave payment initiation for subscriptions

**Migration SQL:**
- Create `subscriptions` and `billing_history` tables with RLS
- Add `customer_name`, `customer_email` to `recurring_payments`, `split_payments`, `escrow`

**Modified files:**
- `src/components/subscription/SubscriptionBilling.tsx` — real data, Flutterwave checkout
- `src/components/customer/CustomerTransactions.tsx` — real DB queries + detail dialog
- `src/components/qr/QRList.tsx` — detail dialog for QR codes
- `src/components/qr/QRHistory.tsx` — pass full QR data
- `src/components/invoices/InvoiceManager.tsx` — customer dropdown selector
- `src/components/recurring/RecurringPaymentsManager.tsx` — customer fields
- `src/components/splitpay/SplitPaymentsManager.tsx` — customer fields
- `src/components/escrow/EscrowManager.tsx` — customer selector
- `src/components/disputes/DisputesCenter.tsx` — show customer info
- `src/components/customer/QRScanner.tsx` — camera scanning + real transaction creation
- `src/components/payments/AdvancedPayments.tsx` — no structural changes needed
- `src/pages/admin/MerchantManagement.tsx` — subscription column
- `src/hooks/useSplitPayments.ts` — include customer fields
- `src/hooks/useRecurringPayments.ts` — include customer fields
- `src/hooks/useEscrow.ts` — include customer fields

