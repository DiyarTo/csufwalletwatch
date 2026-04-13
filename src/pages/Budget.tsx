import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface CategorySpending {
  category: string;
  amount: number;
}

const Budget = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [income, setIncome] = useState(0);
  const [spending, setSpending] = useState(0);
  const [categories, setCategories] = useState<CategorySpending[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;

    const now = new Date();
    const startOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
    const endOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()}`;

    supabase
      .from("transactions")
      .select("amount, category")
      .eq("user_id", user.id)
      .gte("date", startOfMonth)
      .lte("date", endOfMonth)
      .then(({ data }) => {
        let inc = 0;
        let spend = 0;
        const catMap: Record<string, number> = {};

        (data || []).forEach((tx) => {
          if (tx.amount > 0) {
            inc += Number(tx.amount);
          } else {
            const amt = Math.abs(Number(tx.amount));
            spend += amt;
            const cat = tx.category || "Uncategorized";
            catMap[cat] = (catMap[cat] || 0) + amt;
          }
        });

        setIncome(inc);
        setSpending(spend);
        setCategories(
          Object.entries(catMap)
            .map(([category, amount]) => ({ category, amount }))
            .sort((a, b) => b.amount - a.amount)
        );
        setLoading(false);
      });
  }, [user]);

  if (authLoading || !user) return null;

  const remaining = income - spending;
  const ratio = income > 0 ? Math.min(spending / income, 1) : 0;

  const monthName = new Date().toLocaleString("default", { month: "long", year: "numeric" });

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
            Budget — {monthName}
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-card rounded-lg p-6">
                <p className="text-sm text-muted-foreground mb-1">Income</p>
                <p className="font-heading text-2xl text-foreground">
                  ${income.toLocaleString()}
                </p>
              </div>
              <div className="bg-card rounded-lg p-6">
                <p className="text-sm text-muted-foreground mb-1">Spent</p>
                <p className="font-heading text-2xl text-foreground">
                  ${spending.toLocaleString()}
                </p>
              </div>
              <div className="bg-card rounded-lg p-6">
                <p className="text-sm text-muted-foreground mb-1">Remaining</p>
                <p className={`font-heading text-2xl ${remaining >= 0 ? "text-foreground" : "text-primary"}`}>
                  ${remaining.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="bg-card rounded-lg p-6">
              <div className="flex justify-between items-baseline mb-3">
                <span className="text-sm text-muted-foreground">
                  {Math.round(ratio * 100)}% of income spent
                </span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${ratio > 0.85 ? "bg-primary" : "bg-foreground"}`}
                  style={{ width: `${ratio * 100}%` }}
                />
              </div>
            </div>

            {/* Spending by category */}
            <div className="bg-card rounded-lg p-6">
              <p className="text-sm font-body text-muted-foreground tracking-wide uppercase mb-4">
                Spending by Category
              </p>
              {categories.length === 0 ? (
                <p className="text-sm text-muted-foreground">No spending this month.</p>
              ) : (
                <div className="space-y-4">
                  {categories.map((cat) => {
                    const catRatio = spending > 0 ? cat.amount / spending : 0;
                    return (
                      <div key={cat.category}>
                        <div className="flex justify-between items-baseline mb-1">
                          <span className="text-sm text-foreground">{cat.category}</span>
                          <span className="text-sm text-muted-foreground">
                            ${cat.amount.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-foreground/60 transition-all duration-500"
                            style={{ width: `${catRatio * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Budget;
