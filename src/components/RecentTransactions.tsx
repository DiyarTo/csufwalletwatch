import { useState } from "react";

type Transaction = {
  id: number;
  name: string;
  category: string;
  amount: number;
  date: string;
};

const allTransactions: Transaction[] = [
  { id: 1, name: "Whole Foods Market", category: "Groceries", amount: -87.42, date: "Mar 10" },
  { id: 2, name: "Shell Gas Station", category: "Transport", amount: -52.30, date: "Mar 10" },
  { id: 3, name: "Salary Deposit", category: "Income", amount: 2600.00, date: "Mar 9" },
  { id: 4, name: "Blue Bottle Coffee", category: "Dining", amount: -6.50, date: "Mar 9" },
  { id: 5, name: "Netflix", category: "Subscriptions", amount: -15.99, date: "Mar 8" },
  { id: 6, name: "Target", category: "Shopping", amount: -43.12, date: "Mar 8" },
  { id: 7, name: "Uber Eats", category: "Dining", amount: -28.90, date: "Mar 7" },
  { id: 8, name: "Pharmacy", category: "Health", amount: -12.49, date: "Mar 7" },
  { id: 9, name: "Trader Joe's", category: "Groceries", amount: -64.20, date: "Mar 6" },
  { id: 10, name: "Electric Bill Payment", category: "Utilities", amount: -142.00, date: "Mar 5" },
  { id: 11, name: "Freelance Payment", category: "Income", amount: 850.00, date: "Mar 4" },
  { id: 12, name: "Bookstore", category: "Shopping", amount: -24.99, date: "Mar 4" },
];

const PAGE_SIZE = 7;

const RecentTransactions = () => {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(allTransactions.length / PAGE_SIZE);
  const visible = allTransactions.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <section className="bg-card rounded-lg p-6">
      <p className="text-sm font-body text-muted-foreground tracking-wide uppercase mb-4">
        Recent Transactions
      </p>

      <ul className="divide-y divide-border">
        {visible.map((tx) => (
          <li key={tx.id} className="flex items-center justify-between py-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-foreground font-medium truncate">{tx.name}</p>
              <p className="text-xs text-muted-foreground">{tx.category} · {tx.date}</p>
            </div>
            <span
              className={`font-heading text-base ml-4 whitespace-nowrap ${
                tx.amount > 0 ? "text-foreground" : "text-foreground"
              }`}
            >
              {tx.amount > 0 ? "+" : "−"}${Math.abs(tx.amount).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
          >
            ← Previous
          </button>
          <span className="text-xs text-muted-foreground">
            {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </section>
  );
};

export default RecentTransactions;
