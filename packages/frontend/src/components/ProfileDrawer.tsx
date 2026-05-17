"use client";

import { useAuth } from "@/context/AuthContext";
import { useWallet } from "@/hooks/useWallet";

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick?: () => void;
}

const menuItems = [
  "Withdrawals",
  "Bonus Transfer",
  "Bring a friend",
  "Check Bet",
  "Transaction History",
  "Voucher",
  "Chat",
  "My bets",
  "Settings",
  "Get a VIP account",
  "Verification",
];

export default function ProfileDrawer({ isOpen, onClose, onLoginClick }: ProfileDrawerProps) {
  const { isAuthenticated, logout, user } = useAuth();
  const { fiatBalance, bonusBalance } = useWallet();

  if (!isOpen) return null;

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer - slides from right */}
      <aside className="relative z-50 w-3/4 max-w-xs bg-background-panel h-full overflow-y-auto">
        <div className="p-4 flex flex-col items-center">
          {isAuthenticated ? (
            <>
              {/* User Level Circle */}
              <div className="w-20 h-20 rounded-full bg-accents-lime flex items-center justify-center mb-4">
                <span className="text-white font-bold text-2xl">1</span>
              </div>

              {/* Email */}
              {user?.email && (
                <p className="text-gray-400 text-xs mb-3 truncate w-full text-center">
                  {user.email}
                </p>
              )}

              {/* Balance Card */}
              <div className="w-full bg-background-main rounded-lg p-3 mb-2">
                <span className="text-xs text-gray-400">Balance</span>
                <p className="text-white font-semibold text-lg">{fiatBalance} KES</p>
              </div>

              {/* Bonus Card */}
              <div className="w-full bg-background-main rounded-lg p-3 mb-4">
                <span className="text-xs text-gray-400">Bonus</span>
                <p className="text-accents-gold font-semibold text-lg">{bonusBalance} KES</p>
              </div>

              {/* Deposit Button */}
              <button className="w-full bg-accents-lime text-white font-bold py-3 rounded-lg mb-4">
                Deposit
              </button>

              {/* Menu Items */}
              <div className="w-full">
                {menuItems.map((item, idx) => (
                  <button
                    key={item}
                    className={`w-full text-left py-3 px-2 text-sm text-gray-300 hover:text-white transition-colors ${
                      idx !== menuItems.length - 1
                        ? "border-b border-gray-700/50"
                        : ""
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full text-left py-3 px-2 text-sm text-red-400 hover:text-red-300 transition-colors border-t border-gray-700/50 mt-2"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-gray-400 text-sm mb-4">Please login to continue</p>
              <button
                onClick={() => {
                  onClose();
                  onLoginClick?.();
                }}
                className="bg-accents-lime text-white font-bold px-6 py-3 rounded-lg"
              >
                Login
              </button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
