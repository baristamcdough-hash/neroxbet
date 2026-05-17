"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MatchGrid from "@/components/MatchGrid";
import BetslipDrawer from "@/components/BetslipDrawer";
import BottomNav from "@/components/BottomNav";
import ProfileDrawer from "@/components/ProfileDrawer";
import AuthModal from "@/components/AuthModal";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onMenuToggle={() => setSidebarOpen((prev) => !prev)}
        onProfileToggle={() => setProfileDrawerOpen((prev) => !prev)}
        onLoginClick={() => setAuthModalOpen(true)}
      />
      <div className="flex flex-1 pt-14">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-2 md:p-4 pb-16 md:pb-4 overflow-y-auto">
          <MatchGrid />
        </main>
      </div>
      <BetslipDrawer onLoginClick={() => setAuthModalOpen(true)} />
      <BottomNav
        onMenuClick={() => setSidebarOpen((prev) => !prev)}
      />
      <ProfileDrawer
        isOpen={profileDrawerOpen}
        onClose={() => setProfileDrawerOpen(false)}
        onLoginClick={() => setAuthModalOpen(true)}
      />
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}
