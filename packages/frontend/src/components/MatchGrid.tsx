"use client";

import { useState } from "react";
import { matches } from "@/lib/mockData";
import OddsBadge from "./OddsBadge";

interface Selection {
  matchId: string;
  market: "home" | "draw" | "away";
}

export default function MatchGrid() {
  const [selections, setSelections] = useState<Selection[]>([]);

  const toggleSelection = (matchId: string, market: "home" | "draw" | "away") => {
    setSelections((prev) => {
      const exists = prev.find((s) => s.matchId === matchId && s.market === market);
      if (exists) {
        return prev.filter((s) => !(s.matchId === matchId && s.market === market));
      }
      return [...prev.filter((s) => s.matchId !== matchId), { matchId, market }];
    });
  };

  const isSelected = (matchId: string, market: "home" | "draw" | "away") => {
    return selections.some((s) => s.matchId === matchId && s.market === market);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
      {matches.map((match) => (
        <div
          key={match.id}
          className="bg-background-panel rounded-lg p-2 md:p-3 border border-gray-800"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] text-gray-400">{match.league}</span>
            <span className="text-[10px] text-gray-500">
              {new Date(match.startTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <div className="flex justify-between items-center mb-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{match.homeTeam}</p>
              <p className="text-sm font-medium text-white">{match.awayTeam}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <OddsBadge
              label="1"
              odds={match.odds.home}
              isSelected={isSelected(match.id, "home")}
              onClick={() => toggleSelection(match.id, "home")}
            />
            {match.odds.draw > 0 && (
              <OddsBadge
                label="X"
                odds={match.odds.draw}
                isSelected={isSelected(match.id, "draw")}
                onClick={() => toggleSelection(match.id, "draw")}
              />
            )}
            <OddsBadge
              label="2"
              odds={match.odds.away}
              isSelected={isSelected(match.id, "away")}
              onClick={() => toggleSelection(match.id, "away")}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
