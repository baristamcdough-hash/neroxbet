"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getWallets, createWallet, Wallet } from "@/lib/api";

export function useWallet() {
  const { user, isAuthenticated } = useAuth();
  const [fiatBalance, setFiatBalance] = useState<number>(0);
  const [bonusBalance, setBonusBalance] = useState<number>(0);
  const [currency, setCurrency] = useState<string>("KES");
  const [walletId, setWalletId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshWallet = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      let wallets: Wallet[] = await getWallets(user.userId, user.token);

      if (wallets.length === 0) {
        const newWallet = await createWallet(user.userId, "KES", user.token);
        wallets = [newWallet];
      }

      const wallet = wallets[0];
      setFiatBalance(wallet.balance ?? 0);
      setBonusBalance(wallet.bonus_balance ?? 0);
      setCurrency(wallet.currency_code ?? "KES");
      setWalletId(wallet.id);
    } catch {
      // Silently fail - keep existing state
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshWallet();
    } else {
      setFiatBalance(0);
      setBonusBalance(0);
      setWalletId(null);
    }
  }, [isAuthenticated, refreshWallet]);

  return {
    fiatBalance,
    bonusBalance,
    currency,
    walletId,
    loading,
    setFiatBalance,
    setBonusBalance,
    setCurrency,
    refreshWallet,
  };
}
