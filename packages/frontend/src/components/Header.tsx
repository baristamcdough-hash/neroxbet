"use client";

import { useState } from "react";

export default function Header() {
  const [fiatBalance] = useState<number>(0);
  const [bonusBalance] = useState<number>(4000);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background-panel border-b border-gray-800 h-14 flex items-center px-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-accents-lime flex items-center justify-center">
          <span className="text-white font-bold text-sm">N</span>
        </div>
        <span className="text-white font-bold text-lg">Nexarox</span>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <div className="flex flex-col items-end text-sm">
          <span className="text-gray-300">
            Balance: <span className="text-white font-semibold">{fiatBalance} KES</span>
          </span>
          <span className="text-gray-300">
            Bonus: <span className="text-accents-gold font-semibold">{bonusBalance} KES</span>
          </span>
        </div>
        <button className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm">
          U
        </button>
      </div>
    </header>
  );
}
