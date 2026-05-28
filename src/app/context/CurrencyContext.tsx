import { createContext, useContext, useEffect, useState } from 'react';

export type CurrencyCode = 'PHP' | 'USD' | 'EUR' | 'AUD' | 'SGD' | 'GBP' | 'KRW' | 'CNY';

export const CURRENCIES: { code: CurrencyCode; symbol: string; flag: string; label: string }[] = [
  { code: 'PHP', symbol: '₱', flag: '🇵🇭', label: 'PHP' },
  { code: 'USD', symbol: '$', flag: '🇺🇸', label: 'USD' },
  { code: 'EUR', symbol: '€', flag: '🇪🇺', label: 'EUR' },
  { code: 'AUD', symbol: 'A$', flag: '🇦🇺', label: 'AUD' },
  { code: 'SGD', symbol: 'S$', flag: '🇸🇬', label: 'SGD' },
  { code: 'GBP', symbol: '£', flag: '🇬🇧', label: 'GBP' },
  { code: 'KRW', symbol: '₩', flag: '🇰🇷', label: 'KRW' },
  { code: 'CNY', symbol: '¥', flag: '🇨🇳', label: 'CNY' },
];

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  convertPrice: (phpAmount: number) => string;
  symbol: string;
  loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'PHP',
  setCurrency: () => {},
  convertPrice: (n) => `₱${n.toLocaleString()}`,
  symbol: '₱',
  loading: false,
});

const FALLBACK_RATES: Partial<Record<CurrencyCode, number>> = {
  USD: 0.0175,
  EUR: 0.0161,
  AUD: 0.0273,
  SGD: 0.0235,
  GBP: 0.0138,
  KRW: 24.1,
  CNY: 0.127,
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    return (localStorage.getItem('currency') as CurrencyCode) ?? 'PHP';
  });
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES as Record<string, number>);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currency === 'PHP') return;
    const CACHE_KEY = 'fx_rates_php';
    const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { rates: cachedRates, ts } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL && cachedRates[currency]) {
          setRates(cachedRates);
          return;
        }
      }
    } catch { /* ignore corrupt cache */ }
    fetch('https://api.frankfurter.app/latest?from=PHP')
      .then((r) => r.json())
      .then((data) => {
        if (data.rates) {
          setRates(data.rates);
          localStorage.setItem(CACHE_KEY, JSON.stringify({ rates: data.rates, ts: Date.now() }));
        }
      })
      .catch(() => {});
  }, [currency]);

  const setCurrency = (c: CurrencyCode) => {
    localStorage.setItem('currency', c);
    setCurrencyState(c);
  };

  const convertPrice = (phpAmount: number): string => {
    const cur = CURRENCIES.find((c) => c.code === currency)!;
    if (currency === 'PHP') return `₱${phpAmount.toLocaleString()}`;
    const rate = rates[currency];
    if (!rate) return `₱${phpAmount.toLocaleString()}`;
    const converted = phpAmount * rate;
    const formatted = currency === 'KRW'
      ? Math.round(converted).toLocaleString()
      : converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${cur.symbol}${formatted}`;
  };

  const symbol = CURRENCIES.find((c) => c.code === currency)?.symbol ?? '₱';

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice, symbol, loading }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
