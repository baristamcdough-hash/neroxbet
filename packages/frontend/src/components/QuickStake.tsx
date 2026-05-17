"use client";

interface QuickStakeProps {
  onSelect: (amount: number) => void;
  selectedAmount?: number;
}

const STAKES = [1, 5, 10, 50, 100, 150];

export default function QuickStake({ onSelect, selectedAmount }: QuickStakeProps) {
  return (
    <div className="flex gap-2 overflow-x-auto py-2">
      {STAKES.map((amount) => (
        <button
          key={amount}
          onClick={() => onSelect(amount)}
          className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selectedAmount === amount
              ? "bg-accents-lime text-white"
              : "bg-background-panel text-gray-300 hover:bg-background-panel/80 border border-gray-600"
          }`}
        >
          {amount}
        </button>
      ))}
    </div>
  );
}
