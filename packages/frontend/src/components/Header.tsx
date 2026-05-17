"use client";

import { useState } from "react";

interface HeaderProps {
  onMenuToggle?: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const [fiatBalance] = useState<number>(0);
  const [bonusBalance] = useState<number>(4000);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background-panel border-b border-gray-800 h-14 flex items-center px-3 md:px-4">
      {/* Hamburger menu button - mobile only */}
      <button
        onClick={onMenuToggle}
        className="md:hidden mr-2 w-8 h-8 flex items-center justify-center text-white"
        aria-label="Toggle menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-accents-lime flex items-center justify-center">
          <span className="text-white font-bold text-sm">N</span>
        </div>
        <span className="text-white font-bold text-lg hidden sm:inline">Nexarox</span>
      </div>

      <div className="ml-auto flex items-center gap-2 md:gap-4">
        <div className="flex flex-col items-end text-[10px] md:text-sm">
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
