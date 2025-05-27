
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePaymentGateways } from "@/hooks/usePaymentGateways";

interface QRBasicSettingsProps {
  qrConfig: any;
  setQrConfig: (config: any) => void;
}

const QRBasicSettings = ({ qrConfig, setQrConfig }: QRBasicSettingsProps) => {
  const { gateways } = usePaymentGateways();

  // Filter enabled gateways only
  const enabledGateways = gateways.filter(gateway => gateway.enabled);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="qr-type">QR Code Type</Label>
        <Select 
          value={qrConfig.type} 
          onValueChange={(value) => setQrConfig({...qrConfig, type: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select QR type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dynamic">
              Dynamic - Specific Amount
            </SelectItem>
            <SelectItem value="static">
              Static - Customer Enters Amount
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {qrConfig.type === "dynamic" && (
        <div>
          <Label htmlFor="amount">Amount (₦)</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Enter amount"
            value={qrConfig.amount}
            onChange={(e) => setQrConfig({...qrConfig, amount: e.target.value})}
          />
        </div>
      )}

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Payment description (optional)"
          value={qrConfig.description}
          onChange={(e) => setQrConfig({...qrConfig, description: e.target.value})}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="reference">Reference ID</Label>
        <Input
          id="reference"
          placeholder="Auto-generated if empty"
          value={qrConfig.reference}
          onChange={(e) => setQrConfig({...qrConfig, reference: e.target.value})}
        />
      </div>

      <div>
        <Label htmlFor="gateway">Payment Gateway</Label>
        <Select 
          value={qrConfig.gateway_id} 
          onValueChange={(value) => setQrConfig({...qrConfig, gateway_id: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select gateway" />
          </SelectTrigger>
          <SelectContent>
            {enabledGateways.length > 0 ? (
              enabledGateways.map((gateway) => (
                <SelectItem key={gateway.id} value={gateway.id}>
                  {gateway.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="" disabled>
                No enabled payment gateways
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        {enabledGateways.length === 0 && (
          <p className="text-sm text-red-600 mt-1">
            Please enable at least one payment gateway in Gateway Manager
          </p>
        )}
      </div>
    </div>
  );
};

export default QRBasicSettings;
