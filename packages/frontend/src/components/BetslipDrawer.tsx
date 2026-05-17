"use client";

import { useState } from "react";
import QuickStake from "./QuickStake";
import { useAuth } from "@/context/AuthContext";
import { useBetslip } from "@/hooks/useBetslip";

type BetTab = "ordinary" | "express" | "system";

interface BetslipDrawerProps {
  onLoginClick?: () => void;
}

export default function BetslipDrawer({ onLoginClick }: BetslipDrawerProps) {
  const { user, isAuthenticated } = useAuth();
  const { selections, stake, setStake, totalCoefficient, potentialPayout, submitBet, setBetType, betType } = useBetslip();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<BetTab>("ordinary");
  const [agreeCoeffChange, setAgreeCoeffChange] = useState<boolean>(false);
  const [betError, setBetError] = useState<string | null>(null);
  const [betSuccess, setBetSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const tabs: { key: BetTab; label: string }[] = [
    { key: "ordinary", label: "Ordinary" },
    { key: "express", label: "Express" },
    { key: "system", label: "System" },
  ];

  const handleTabChange = (tab: BetTab) => {
    setActiveTab(tab);
    setBetType(tab);
  };

  const handleMakeBet = async () => {
    setBetError(null);
    setBetSuccess(null);

    if (!isAuthenticated || !user) {
      setBetError("Please login to place a bet");
      onLoginClick?.();
      return;
    }

    if (selections.length === 0) {
      setBetError("Add selections to your betslip first");
      return;
    }

    if (stake <= 0) {
      setBetError("Enter a stake amount");
      return;
    }

    setSubmitting(true);
    try {
      await submitBet(user.userId, user.token);
      setBetSuccess("Bet placed successfully!");
      setTimeout(() => setBetSuccess(null), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to place bet";
      setBetError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-14 md:bottom-0 left-0 right-0 z-40">
      {/* Toggle Bar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-background-panel border-t border-gray-800 py-2 px-4 flex items-center justify-between"
      >
        <span className="text-sm font-medium text-white">
          Betslip {selections.length > 0 && `(${selections.length})`}
        </span>
        <span className="text-xs text-gray-400">{isOpen ? "Close" : "Open"}</span>
      </button>

      {/* Drawer Content */}
      {isOpen && (
        <div className="bg-background-panel border-t border-gray-800 p-4 max-h-[60vh] overflow-y-auto">
          {/* Tabs */}
          <div className="flex gap-1 bg-background-main rounded-full p-0.5 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  activeTab === tab.key
                    ? "bg-accents-lime text-white"
                    : "text-gray-400"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mb-4">
            {activeTab === "ordinary" && (
              <div className="text-sm text-gray-300">
                {selections.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">
                    Select a match to add to your betslip
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selections.map((s) => (
                      <div key={s.matchId} className="bg-background-main rounded p-2 flex justify-between items-center">
                        <span className="text-xs">{s.homeTeam} vs {s.awayTeam}</span>
                        <span className="text-accents-lime text-xs font-bold">{s.odds.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === "express" && (
              <div className="text-sm text-gray-300">
                <div className="flex justify-between items-center mb-2">
                  <span>Total Coefficient:</span>
                  <span className="text-accents-lime font-bold">{totalCoefficient.toFixed(2)}</span>
                </div>
                {selections.length < 2 ? (
                  <p className="text-center text-gray-500 py-4">
                    Add 2+ selections for express bet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selections.map((s) => (
                      <div key={s.matchId} className="bg-background-main rounded p-2 flex justify-between items-center">
                        <span className="text-xs">{s.homeTeam} vs {s.awayTeam}</span>
                        <span className="text-accents-lime text-xs font-bold">{s.odds.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === "system" && (
              <div className="text-sm text-gray-300">
                {selections.length < 3 ? (
                  <p className="text-center text-gray-500 py-4">
                    Add 3+ selections for system bet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selections.map((s) => (
                      <div key={s.matchId} className="bg-background-main rounded p-2 flex justify-between items-center">
                        <span className="text-xs">{s.homeTeam} vs {s.awayTeam}</span>
                        <span className="text-accents-lime text-xs font-bold">{s.odds.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Potential payout */}
          {potentialPayout > 0 && (
            <div className="flex justify-between items-center mb-3 text-sm">
              <span className="text-gray-400">Potential payout:</span>
              <span className="text-accents-gold font-bold">{potentialPayout.toFixed(2)} KES</span>
            </div>
          )}

          {/* Quick Stakes */}
          <QuickStake
            onSelect={(amount) => setStake(amount)}
            selectedAmount={stake}
          />

          {/* Stake Input */}
          <div className="mt-3">
            <input
              type="number"
              value={stake || ""}
              onChange={(e) => setStake(Number(e.target.value))}
              placeholder="Enter stake amount"
              className="w-full bg-background-main border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accents-lime"
            />
          </div>

          {/* Coefficient Toggle */}
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-400">
              Always agree to a change in the coefficient
            </span>
            <button
              onClick={() => setAgreeCoeffChange(!agreeCoeffChange)}
              className={`w-10 h-5 rounded-full transition-colors relative ${
                agreeCoeffChange ? "bg-accents-lime" : "bg-gray-600"
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  agreeCoeffChange ? "left-5" : "left-0.5"
                }`}
              />
            </button>
          </div>

          {/* Error/Success messages */}
          {betError && (
            <p className="text-red-400 text-xs mt-2">{betError}</p>
          )}
          {betSuccess && (
            <p className="text-green-400 text-xs mt-2">{betSuccess}</p>
          )}

          {/* Make Bet Button */}
          <button
            onClick={handleMakeBet}
            disabled={submitting}
            className="w-full mt-4 bg-accents-gold text-white font-bold py-3 rounded-lg hover:bg-accents-gold/90 transition-colors disabled:opacity-50"
          >
            {submitting ? "Placing bet..." : "Make bet"}
          </button>
        </div>
      )}
    </div>
  );
}
