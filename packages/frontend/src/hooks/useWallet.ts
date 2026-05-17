"use client";

import { useState } from "react";

export function useWallet() {
  const [fiatBalance, setFiatBalance] = useState<number>(0);
  const [bonusBalance, setBonusBalance] = useState<number>(4000);
  const [currency, setCurrency] = useState<string>("KES");

  return {
    fiatBalance,
    bonusBalance,
    currency,
    setFiatBalance,
    setBonusBalance,
    setCurrency,
  };
}
