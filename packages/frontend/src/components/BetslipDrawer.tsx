"use client";

import { useState } from "react";
import QuickStake from "./QuickStake";

type BetTab = "ordinary" | "express" | "system";

export default function BetslipDrawer() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<BetTab>("ordinary");
  const [stake, setStake] = useState<number>(0);
  const [agreeCoeffChange, setAgreeCoeffChange] = useState<boolean>(false);

  const tabs: { key: BetTab; label: string }[] = [
    { key: "ordinary", label: "Ordinary" },
    { key: "express", label: "Express" },
    { key: "system", label: "System" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      {/* Toggle Bar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-background-panel border-t border-gray-800 py-2 px-4 flex items-center justify-between"
      >
        <span className="text-sm font-medium text-white">Betslip</span>
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
                onClick={() => setActiveTab(tab.key)}
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
                <p className="text-center text-gray-500 py-4">
                  Select a match to add to your betslip
                </p>
              </div>
            )}
            {activeTab === "express" && (
              <div className="text-sm text-gray-300">
                <div className="flex justify-between items-center mb-2">
                  <span>Total Coefficient:</span>
                  <span className="text-accents-lime font-bold">1.00</span>
                </div>
                <p className="text-center text-gray-500 py-4">
                  Add 2+ selections for express bet
                </p>
              </div>
            )}
            {activeTab === "system" && (
              <div className="text-sm text-gray-300">
                <p className="text-center text-gray-500 py-4">
                  Add 3+ selections for system bet
                </p>
              </div>
            )}
          </div>

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

          {/* Make Bet Button */}
          <button className="w-full mt-4 bg-accents-gold text-white font-bold py-3 rounded-lg hover:bg-accents-gold/90 transition-colors">
            Make bet
          </button>
        </div>
      )}
    </div>
  );
}
