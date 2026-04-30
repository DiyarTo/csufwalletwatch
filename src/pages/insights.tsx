import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface BudgetSubcategory { 
  id: number;
  name: string;
  amount: number;
}

interface BudgetCategory {
  id: number;
  name: string;
  subcategories: BudgetSubcategory[];
}

interface Transaction {
  amount: number;
  category: string | null;
}

export default function Insights() {
  const { user } = useAuth();

  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const [monthlySpending, setMonthlySpending] = useState(0);
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchInsights();
  }, [user]);

  async function fetchInsights() {
    setLoading(true);

    const savedBudget = localStorage.getItem("budgetData");
    if (savedBudget) {
      setBudgetCategories(JSON.parse(savedBudget));
    }

    const now = new Date();

    const startOfMonth = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-01`;

    const endOfMonth = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).getDate()}`;

    const { data } = await supabase
      .from("transactions")
      .select("amount, category")
      .eq("user_id", user.id)
      .gte("date", startOfMonth)
      .lte("date", endOfMonth);

    let spending = 0;
    let savings = 0;

    ((data as Transaction[]) || []).forEach((tx) => {
      const amount = Number(tx.amount);
      const category = tx.category || "";

      if (amount < 0) {
        const positiveAmount = Math.abs(amount);

        if (
          category === "Emergency Fund" ||
          category === "Investments" ||
          category === "Savings / Investing"
        ) {
          savings += positiveAmount;
        } else {
          spending += positiveAmount;
        }
      }
    });

    setMonthlySpending(spending);
    setMonthlySavings(savings);
    setLoading(false);
  }

  function getWeeksLeftInMonth() {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const daysLeft = lastDay.getDate() - today.getDate() + 1;

    return Math.max(daysLeft / 7, 1);
  }

  const savingsCategory = budgetCategories.find(
    (category) => category.name === "Savings / Investing"
  );

  const monthlySavingsBudget = savingsCategory
    ? savingsCategory.subcategories.reduce((sum, sub) => sum + sub.amount, 0)
    : 0;

  const monthlyTotalBudget = budgetCategories.reduce((sum, category) => {
    return (
      sum +
      category.subcategories.reduce((subSum, sub) => subSum + sub.amount, 0)
    );
  }, 0);

  const monthlySpendingBudget = monthlyTotalBudget - monthlySavingsBudget;

  const weeksLeft = getWeeksLeftInMonth();

  const leftToSpend = monthlySpendingBudget - monthlySpending;
  const leftToSave = monthlySavingsBudget - monthlySavings;

  const weeklySpendLimit = leftToSpend / weeksLeft;
  const weeklySavingsNeeded = leftToSave / weeksLeft;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-4">
          <Link
            to="/"
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </Link>

          <h1 className="font-heading text-lg tracking-tight text-foreground">
            Insights
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading insights...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-card rounded-lg p-6 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Weekly Spending Limit
                </p>
                <p className="font-heading text-3xl text-foreground">
                  ${weeklySpendLimit.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
                  You can spend this much per week and stay within budget.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Weekly Savings Needed
                </p>
                <p className="font-heading text-3xl text-foreground">
                  ${weeklySavingsNeeded.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Save or invest this much per week to hit your monthly plan.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-card rounded-lg p-6">
                <p className="text-sm text-muted-foreground mb-1">
                  Spending Budget
                </p>
                <p className="font-heading text-2xl">
                  ${monthlySpendingBudget.toLocaleString()}
                </p>
              </div>

              <div className="bg-card rounded-lg p-6">
                <p className="text-sm text-muted-foreground mb-1">
                  Spent So Far
                </p>
                <p className="font-heading text-2xl">
                  ${monthlySpending.toLocaleString()}
                </p>
              </div>

              <div className="bg-card rounded-lg p-6">
                <p className="text-sm text-muted-foreground mb-1">
                  Left to Spend
                </p>
                <p className="font-heading text-2xl">
                  ${leftToSpend.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-card rounded-lg p-6">
                <p className="text-sm text-muted-foreground mb-1">
                  Savings Target
                </p>
                <p className="font-heading text-2xl">
                  ${monthlySavingsBudget.toLocaleString()}
                </p>
              </div>

              <div className="bg-card rounded-lg p-6">
                <p className="text-sm text-muted-foreground mb-1">
                  Saved / Invested
                </p>
                <p className="font-heading text-2xl">
                  ${monthlySavings.toLocaleString()}
                </p>
              </div>

              <div className="bg-card rounded-lg p-6">
                <p className="text-sm text-muted-foreground mb-1">
                  Left to Save
                </p>
                <p className="font-heading text-2xl">
                  ${leftToSave.toLocaleString()}
                </p>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
