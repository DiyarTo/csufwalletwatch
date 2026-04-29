// src/pages/Insights.tsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft } from "lucide-react";

interface BudgetSubcategory {
  id: number;
  name: string;
  amount: number;
  isCustom?: boolean;
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
  const [spending, setSpending] = useState(0);
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
      .eq("user_id", user?.id)
      .gte("date", startOfMonth)
      .lte("date", endOfMonth);

    const monthlySpending = ((data as Transaction[]) || []).reduce(
      (sum, tx) => {
        return tx.amount < 0 ? sum + Math.abs(Number(tx.amount)) : sum;
      },
      0
    );

    setSpending(monthlySpending);
    setLoading(false);
  }

  function getWeeksLeftInMonth() {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const daysLeft = lastDay.getDate() - today.getDate() + 1;

    return Math.max(daysLeft / 7, 1);
  }

  const totalBudgeted = budgetCategories.reduce((sum, category) => {
    return (
      sum +
      category.subcategories.reduce((subSum, sub) => subSum + sub.amount, 0)
    );
  }, 0);

  const savingsCategory = budgetCategories.find(
    (category) => category.name === "Savings / Investing"
  );

  const savingsGoal = savingsCategory
    ? savingsCategory.subcategories.reduce((sum, sub) => sum + sub.amount, 0)
    : 0;

  const spendingBudget = totalBudgeted - savingsGoal;
  const remainingToSpend = spendingBudget - spending;
  const weeksLeft = getWeeksLeftInMonth();

  const weeklySpendLimit = remainingToSpend / weeksLeft;
  const weeklySavingsNeeded = savingsGoal / weeksLeft;

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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-card rounded-lg p-6">
                <p className="text-sm text-muted-foreground mb-1">
                  Monthly Spending Budget
                </p>
                <p className="font-heading text-2xl text-foreground">
                  ${spendingBudget.toLocaleString()}
                </p>
              </div>

              <div className="bg-card rounded-lg p-6">
                <p className="text-sm text-muted-foreground mb-1">
                  Spent This Month
                </p>
                <p className="font-heading text-2xl text-foreground">
                  ${spending.toLocaleString()}
                </p>
              </div>

              <div className="bg-card rounded-lg p-6">
                <p className="text-sm text-muted-foreground mb-1">
                  Left to Spend
                </p>
                <p className="font-heading text-2xl text-foreground">
                  ${remainingToSpend.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 space-y-2">
              <p className="text-sm font-body text-muted-foreground tracking-wide uppercase">
                Weekly Spending Pace
              </p>

              <p className="font-heading text-3xl text-foreground">
                ${weeklySpendLimit.toFixed(2)} / week
              </p>

              <p className="text-sm text-muted-foreground">
                This is how much you can spend per week for the rest of the
                month and stay within your planned spending budget.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 space-y-2">
              <p className="text-sm font-body text-muted-foreground tracking-wide uppercase">
                Savings / Investing Pace
              </p>

              <p className="font-heading text-3xl text-foreground">
                ${weeklySavingsNeeded.toFixed(2)} / week
              </p>

              <p className="text-sm text-muted-foreground">
                This is based on your Savings / Investing budget category.
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
