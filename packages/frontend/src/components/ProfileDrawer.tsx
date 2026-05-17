"use client";

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
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

export default function ProfileDrawer({ isOpen, onClose }: ProfileDrawerProps) {
  if (!isOpen) return null;

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
          {/* User Level Circle */}
          <div className="w-20 h-20 rounded-full bg-accents-lime flex items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">1</span>
          </div>

          {/* Balance Card */}
          <div className="w-full bg-background-main rounded-lg p-3 mb-2">
            <span className="text-xs text-gray-400">Balance</span>
            <p className="text-white font-semibold text-lg">0 KES</p>
          </div>

          {/* Bonus Card */}
          <div className="w-full bg-background-main rounded-lg p-3 mb-4">
            <span className="text-xs text-gray-400">Bonus</span>
            <p className="text-accents-gold font-semibold text-lg">4000 KES</p>
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
        </div>
      </aside>
    </div>
  );
}
