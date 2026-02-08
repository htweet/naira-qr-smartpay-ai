import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRightLeft, Globe } from "lucide-react";
import { useCurrencyRates, SUPPORTED_CURRENCIES } from "@/hooks/useCurrencyRates";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CurrencyConverter = () => {
  const { rates, loading, convertAmount, formatCurrency } = useCurrencyRates();
  const [amount, setAmount] = useState(1000);
  const [fromCurrency, setFromCurrency] = useState("NGN");
  const [toCurrency, setToCurrency] = useState("USD");

  const convertedAmount = convertAmount(amount, fromCurrency, toCurrency);

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Currency Converter
        </CardTitle>
        <CardDescription>
          Convert between supported currencies
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-5 gap-4 items-end">
          <div className="col-span-2 space-y-2">
            <Label>Amount</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="flex-1"
              />
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.symbol} {c.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSwap}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          <div className="col-span-2 space-y-2">
            <Label>Converted To</Label>
            <div className="flex gap-2">
              <div className="flex-1 h-10 px-3 py-2 rounded-md border bg-muted flex items-center font-semibold">
                {formatCurrency(convertedAmount, toCurrency)}
              </div>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.symbol} {c.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-3">Supported Currencies</h4>
          <div className="flex flex-wrap gap-2">
            {SUPPORTED_CURRENCIES.map((currency) => (
              <Badge key={currency.code} variant="secondary">
                {currency.symbol} {currency.code} - {currency.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Exchange rates are indicative and updated periodically
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencyConverter;
