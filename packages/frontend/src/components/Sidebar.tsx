"use client";

import { useState } from "react";
import { sportHierarchy } from "@/lib/mockData";

type ViewMode = "prematch" | "live";
type TimeHorizon = "1h" | "2h" | "24h" | "All";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("prematch");
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>("24h");
  const [expandedSport, setExpandedSport] = useState<string | null>("Football");
  const [expandedRegion, setExpandedRegion] = useState<string | null>("Spain");

  const timeOptions: TimeHorizon[] = ["1h", "2h", "24h", "All"];

  const sidebarContent = (
    <div className="p-3">
      {/* Prematch / Live Toggle */}
      <div className="flex bg-background-main rounded-full p-0.5 mb-3">
        <button
          onClick={() => setViewMode("prematch")}
          className={`flex-1 py-1.5 text-xs font-medium rounded-full transition-colors ${
            viewMode === "prematch"
              ? "bg-accents-lime text-white"
              : "text-gray-400"
          }`}
        >
          Prematch
        </button>
        <button
          onClick={() => setViewMode("live")}
          className={`flex-1 py-1.5 text-xs font-medium rounded-full transition-colors ${
            viewMode === "live"
              ? "bg-accents-lime text-white"
              : "text-gray-400"
          }`}
        >
          Live
        </button>
      </div>

      {/* Time Horizon Slider */}
      <div className="flex gap-1 mb-4">
        {timeOptions.map((t) => (
          <button
            key={t}
            onClick={() => setTimeHorizon(t)}
            className={`flex-1 py-1 text-[10px] font-medium rounded transition-colors ${
              timeHorizon === t
                ? "bg-accents-lime text-white"
                : "bg-background-main text-gray-400"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Sport / Region / League Accordion */}
      <div className="space-y-1">
        {sportHierarchy.map((sport) => (
          <div key={sport.name}>
            <button
              onClick={() =>
                setExpandedSport(expandedSport === sport.name ? null : sport.name)
              }
              className="w-full flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-white hover:bg-background-main/50 rounded transition-colors"
            >
              <span className={`text-xs transition-transform ${expandedSport === sport.name ? "rotate-90" : ""}`}>
                &#9654;
              </span>
              {sport.name}
            </button>

            {expandedSport === sport.name && (
              <div className="ml-3 border-l border-gray-700 pl-2">
                {sport.regions.map((region) => (
                  <div key={region.name}>
                    <button
                      onClick={() =>
                        setExpandedRegion(
                          expandedRegion === region.name ? null : region.name
                        )
                      }
                      className="w-full flex items-center gap-2 px-2 py-1 text-xs text-gray-300 hover:text-white transition-colors"
                    >
                      <span className={`text-[10px] transition-transform ${expandedRegion === region.name ? "rotate-90" : ""}`}>
                        &#9654;
                      </span>
                      {region.name}
                    </button>

                    {expandedRegion === region.name && (
                      <div className="ml-3 border-l border-gray-700 pl-2">
                        {region.leagues.map((league) => (
                          <button
                            key={league}
                            className="w-full text-left px-2 py-0.5 text-[11px] text-gray-400 hover:text-accents-lime transition-colors"
                          >
                            {league}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar - static */}
      <aside className="hidden md:block w-60 bg-background-panel border-r border-gray-800 overflow-y-auto h-[calc(100vh-3.5rem)] sticky top-14">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar - overlay drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Drawer */}
          <aside className="relative z-50 w-60 bg-background-panel border-r border-gray-800 overflow-y-auto h-full pt-14">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
