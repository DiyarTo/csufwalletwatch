import NetPosition from "@/components/NetPosition";
import MonthlyPace from "@/components/MonthlyPace";
import UpcomingBills from "@/components/UpcomingBills";
import RecentTransactions from "@/components/RecentTransactions";
import { Plus } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="font-heading text-lg tracking-tight text-foreground">Wallet Watch</h1>
          <button className="w-9 h-9 rounded-full bg-primary flex items-center justify-center hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4 text-primary-foreground" />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <NetPosition />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MonthlyPace />
          <UpcomingBills />
        </div>

        <RecentTransactions />

        <footer className="text-center py-8">
          <p className="text-xs text-muted-foreground">
            March 2026 · All figures are current as of today.
          </p>
        </footer>
      </main>
    </div>);
};

export default Index;