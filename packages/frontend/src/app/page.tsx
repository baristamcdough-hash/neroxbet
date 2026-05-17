import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MatchGrid from "@/components/MatchGrid";
import BetslipDrawer from "@/components/BetslipDrawer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 pt-14">
        <Sidebar />
        <main className="flex-1 p-4 overflow-y-auto">
          <MatchGrid />
        </main>
      </div>
      <BetslipDrawer />
    </div>
  );
}
