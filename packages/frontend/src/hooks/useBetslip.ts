"use client";

import { useState, useCallback, useMemo } from "react";
import { placeBet as placeBetApi, BetResponse } from "@/lib/api";

export interface BetSelection {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  market: "home" | "draw" | "away";
  odds: number;
}

export type BetType = "ordinary" | "express" | "system";

export function useBetslip() {
  const [selections, setSelections] = useState<BetSelection[]>([]);
  const [betType, setBetType] = useState<BetType>("ordinary");
  const [stake, setStake] = useState<number>(0);

  const addSelection = useCallback((selection: BetSelection) => {
    setSelections((prev) => {
      const exists = prev.find(
        (s) => s.matchId === selection.matchId && s.market === selection.market
      );
      if (exists) return prev;
      const sameMatch = prev.find((s) => s.matchId === selection.matchId);
      if (sameMatch) {
        return prev.map((s) =>
          s.matchId === selection.matchId ? selection : s
        );
      }
      return [...prev, selection];
    });
  }, []);

  const removeSelection = useCallback((matchId: string) => {
    setSelections((prev) => prev.filter((s) => s.matchId !== matchId));
  }, []);

  const clearSelections = useCallback(() => {
    setSelections([]);
  }, []);

  const totalCoefficient = useMemo(() => {
    if (selections.length === 0) return 0;
    if (betType === "express") {
      return selections.reduce((acc, s) => acc * s.odds, 1);
    }
    if (selections.length === 1) return selections[0].odds;
    return selections.reduce((acc, s) => acc * s.odds, 1);
  }, [selections, betType]);

  const potentialPayout = useMemo(() => {
    if (stake <= 0 || totalCoefficient === 0) return 0;
    return stake * totalCoefficient;
  }, [stake, totalCoefficient]);

  const submitBet = useCallback(
    async (userId: string, token: string): Promise<BetResponse> => {
      const betSelections = selections.map((s) => ({
        matchId: s.matchId,
        homeTeam: s.homeTeam,
        awayTeam: s.awayTeam,
        market: s.market,
        odds: s.odds,
      }));
      const result = await placeBetApi(userId, betType, stake, betSelections, token);
      setSelections([]);
      setStake(0);
      return result;
    },
    [selections, betType, stake]
  );

  return {
    selections,
    betType,
    stake,
    totalCoefficient,
    potentialPayout,
    setBetType,
    setStake,
    addSelection,
    removeSelection,
    clearSelections,
    submitBet,
  };
}
