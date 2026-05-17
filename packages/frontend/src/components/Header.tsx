"use client";

import { useAuth } from "@/context/AuthContext";
import { useWallet } from "@/hooks/useWallet";

interface HeaderProps {
  onMenuToggle?: () => void;
  onProfileToggle?: () => void;
  onLoginClick?: () => void;
}

export default function Header({ onMenuToggle, onProfileToggle, onLoginClick }: HeaderProps) {
  const { isAuthenticated } = useAuth();
  const { fiatBalance, bonusBalance } = useWallet();

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
        <span className="text-accents-gold font-bold text-lg hidden sm:inline">NexaroX</span>
      </div>

      <div className="ml-auto flex items-center gap-2 md:gap-4">
        {isAuthenticated ? (
          <>
            <div className="flex flex-col items-end text-[10px] md:text-sm">
              <span className="text-gray-300">
                Balance: <span className="text-white font-semibold">{fiatBalance} KES</span>
              </span>
              <span className="text-gray-300">
                Bonus: <span className="text-accents-gold font-semibold">{bonusBalance} KES</span>
              </span>
            </div>

            {/* Profile icon */}
            <button
              onClick={onProfileToggle}
              className="w-8 h-8 rounded-full bg-accents-lime flex items-center justify-center text-white text-sm font-bold"
            >
              U
            </button>
          </>
        ) : (
          <button
            onClick={onLoginClick}
            className="bg-accents-lime text-white text-sm font-bold px-4 py-1.5 rounded-full hover:bg-accents-lime/90 transition-colors"
          >
            Login
          </button>
        )}

        {/* Three-dot menu - mobile only */}
        <button
          onClick={onProfileToggle}
          className="md:hidden w-8 h-8 flex items-center justify-center text-white"
          aria-label="More options"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>
      </div>
    </header>
  );
}
