"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MatchGrid from "@/components/MatchGrid";
import BetslipDrawer from "@/components/BetslipDrawer";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
      <div className="flex flex-1 pt-14">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-2 md:p-4 overflow-y-auto">
          <MatchGrid />
        </main>
      </div>
      <BetslipDrawer />
    </div>
  );
}
