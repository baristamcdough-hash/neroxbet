"use client";

import { useState } from "react";
import { payoutFeed } from "@/lib/mockData";

type PaymentMethod = "mpesa" | "mtn" | "crypto";

export default function PayoutOverlay() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa");
  const [amount, setAmount] = useState<string>("");
  const [phoneOrAddress, setPhoneOrAddress] = useState<string>("");

  const paymentOptions: { key: PaymentMethod; label: string }[] = [
    { key: "mpesa", label: "M-Pesa" },
    { key: "mtn", label: "MTN MoMo" },
    { key: "crypto", label: "Crypto" },
  ];

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-20 right-4 z-30 bg-accents-gold text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accents-gold/90 transition-colors"
      >
        Withdraw
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background-card-fiat rounded-2xl w-full max-w-md mx-4 p-6 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Payout</h2>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            &times;
          </button>
        </div>

        {/* Payment Method Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment System
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-accents-lime"
          >
            {paymentOptions.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accents-lime"
          />
        </div>

        {/* Phone / Address Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {paymentMethod === "crypto" ? "Wallet Address" : "Phone Number"}
          </label>
          <input
            type="text"
            value={phoneOrAddress}
            onChange={(e) => setPhoneOrAddress(e.target.value)}
            placeholder={
              paymentMethod === "crypto"
                ? "Enter wallet address"
                : "Enter phone number"
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accents-lime"
          />
        </div>

        {/* Submit Button */}
        <button className="w-full bg-accents-gold text-white font-bold py-3 rounded-lg hover:bg-accents-gold/90 transition-colors mb-6">
          Submit Payout
        </button>

        {/* Live Payout Feed */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Live Verifications
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {payoutFeed.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between text-xs text-gray-600"
              >
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-[8px]">
                    &#10003;
                  </span>
                  <span>{entry.username}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">
                    {entry.amount.toLocaleString()} {entry.currency}
                  </span>
                  <span className="text-gray-400">{entry.method}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
