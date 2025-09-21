"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  convertAmount: (amount: number, fromCurrency?: string) => number;
  formatCurrency: (amount: number, fromCurrency?: string) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Exchange rates (simplified - in real app, these would come from an API)
const exchangeRates: { [key: string]: number } = {
  USD: 1.0,
  EUR: 0.85,
  GBP: 0.73,
  JPY: 110.0,
  CAD: 1.25,
  AUD: 1.35,
  INR: 75.0,
};

const currencySymbols: { [key: string]: string } = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$',
  INR: '₹',
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState('USD');

  // Load currency from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency && exchangeRates[savedCurrency]) {
      setCurrencyState(savedCurrency);
    }
  }, []);

  // Save currency to localStorage and update state
  const setCurrency = (newCurrency: string) => {
    if (exchangeRates[newCurrency]) {
      localStorage.setItem('selectedCurrency', newCurrency);
      setCurrencyState(newCurrency);
    }
  };

  const convertAmount = (amount: number, fromCurrency: string = 'USD'): number => {
    // Convert from source currency to USD first
    const amountInUSD = amount / exchangeRates[fromCurrency];
    // Then convert to target currency
    return amountInUSD * exchangeRates[currency];
  };

  const formatCurrency = (amount: number, fromCurrency: string = 'USD'): string => {
    const convertedAmount = convertAmount(amount, fromCurrency);
    const symbol = currencySymbols[currency];
    
    // Format based on currency
    if (currency === 'JPY' || currency === 'INR') {
      // No decimal places for JPY and INR, with commas
      return `${symbol}${Math.round(convertedAmount).toLocaleString()}`;
    } else {
      // 2 decimal places for other currencies, with commas
      return `${symbol}${convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertAmount, formatCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
