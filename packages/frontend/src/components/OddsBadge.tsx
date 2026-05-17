"use client";

interface OddsBadgeProps {
  label: string;
  odds: number;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function OddsBadge({ label, odds, isSelected, onClick }: OddsBadgeProps) {
  if (odds === 0) return null;

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center px-3 py-1.5 rounded text-xs font-medium transition-colors ${
        isSelected
          ? "bg-accents-lime text-white"
          : "bg-badge-odds text-white hover:bg-badge-odds/80"
      }`}
    >
      <span className="text-[10px] text-gray-400">{label}</span>
      <span className="font-bold">{odds.toFixed(2)}</span>
    </button>
  );
}
