import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface CurrencyRate {
  id: string;
  base_currency: string;
  target_currency: string;
  rate: number;
  updated_at: string;
}

export const SUPPORTED_CURRENCIES = [
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
];

export const useCurrencyRates = () => {
  const [rates, setRates] = useState<CurrencyRate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRates = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("currency_rates")
        .select("*")
        .order("base_currency");

      if (error) throw error;
      setRates((data as CurrencyRate[]) || []);
    } catch (error) {
      console.error("Error fetching currency rates:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  const convertAmount = useCallback(
    (amount: number, fromCurrency: string, toCurrency: string): number => {
      if (fromCurrency === toCurrency) return amount;

      const rate = rates.find(
        (r) =>
          r.base_currency === fromCurrency && r.target_currency === toCurrency
      );

      if (rate) {
        return amount * rate.rate;
      }

      // Try reverse conversion
      const reverseRate = rates.find(
        (r) =>
          r.base_currency === toCurrency && r.target_currency === fromCurrency
      );

      if (reverseRate) {
        return amount / reverseRate.rate;
      }

      // Fall back to NGN as intermediary
      const toNGN = rates.find(
        (r) => r.base_currency === fromCurrency && r.target_currency === "NGN"
      );
      const fromNGN = rates.find(
        (r) => r.base_currency === "NGN" && r.target_currency === toCurrency
      );

      if (toNGN && fromNGN) {
        return amount * toNGN.rate * fromNGN.rate;
      }

      console.warn(
        `No conversion rate found for ${fromCurrency} to ${toCurrency}`
      );
      return amount;
    },
    [rates]
  );

  const formatCurrency = useCallback(
    (amount: number, currencyCode: string): string => {
      const currency = SUPPORTED_CURRENCIES.find(
        (c) => c.code === currencyCode
      );
      const symbol = currency?.symbol || currencyCode;
      return `${symbol}${amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
    []
  );

  const getRate = useCallback(
    (fromCurrency: string, toCurrency: string): number | null => {
      if (fromCurrency === toCurrency) return 1;

      const rate = rates.find(
        (r) =>
          r.base_currency === fromCurrency && r.target_currency === toCurrency
      );

      return rate?.rate || null;
    },
    [rates]
  );

  return {
    rates,
    loading,
    convertAmount,
    formatCurrency,
    getRate,
    refetch: fetchRates,
    supportedCurrencies: SUPPORTED_CURRENCIES,
  };
};
