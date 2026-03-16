import { useState } from "react";

type Transaction = {
  id: string;
  date: string;
  name: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  source: "manual" | "bank";
};

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      date: "2026-03-01",
      name: "Work Paycheck",
      amount: 1250,
      category: "Income",
      type: "income",
      source: "bank",
    },
    {
      id: "2",
      date: "2026-03-03",
      name: "Chipotle",
      amount: -14.75,
      category: "Food",
      type: "expense",
      source: "bank",
    },
    {
      id: "3",
      date: "2026-03-05",
      name: "Gas Station",
      amount: -48.2,
      category: "Transportation",
      type: "expense",
      source: "bank",
    },
    {
      id: "4",
      date: "2026-03-08",
      name: "Work Paycheck",
      amount: 1450,
      category: "Income",
      type: "income",
      source: "bank",
    },
    {
      id: "5",
      date: "2026-03-06",
      name: "Cash Dinner",
      amount: -22,
      category: "Food",
      type: "expense",
      source: "manual",
    },
  ]);

  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formName, setFormName] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formDate, setFormDate] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const sortedTransactions = [...transactions].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  const filteredTransactions = sortedTransactions.filter((transaction) => {
    if (startDate && transaction.date < startDate) return false;
    if (endDate && transaction.date > endDate) return false;
    return true;
  });

  function resetForm() {
    setFormName("");
    setFormAmount("");
    setFormCategory("");
    setFormDate("");
    setEditingId(null);
    setShowEditor(false);
  }

  function handleSubmitTransaction() {
    if (!formName || !formAmount || !formCategory || !formDate) return;

    const parsedAmount = Number(formAmount);

    if (editingId) {
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === editingId && transaction.source === "manual"
            ? {
                ...transaction,
                name: formName,
                amount: parsedAmount,
                category: formCategory,
                date: formDate,
                type: parsedAmount >= 0 ? "income" : "expense",
              }
            : transaction
        )
      );
    } else {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        name: formName,
        amount: parsedAmount,
        category: formCategory,
        date: formDate,
        type: parsedAmount >= 0 ? "income" : "expense",
        source: "manual",
      };

      setTransactions((prev) => [...prev, newTransaction]);
    }

    resetForm();
  }

  function startEditing(transaction: Transaction) {
    if (transaction.source !== "manual") return;

    setEditingId(transaction.id);
    setFormName(transaction.name);
    setFormAmount(transaction.amount.toString());
    setFormCategory(transaction.category);
    setFormDate(transaction.date);
    setShowEditor(true);
  }

  function removeTransaction(id: string) {
    setTransactions((prev) =>
      prev.filter(
        (transaction) =>
          !(transaction.id === id && transaction.source === "manual")
      )
    );
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold">Transaction History</h1>

      <p className="text-muted-foreground">
        View all income and expenses.
      </p>

      <div className="mt-4 flex flex-wrap gap-4 items-end">
        <div className="flex flex-col">
          <label className="text-sm">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded-md px-3 py-2"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded-md px-3 py-2"
          />
        </div>

        <button
          onClick={() => {
            setStartDate("");
            setEndDate("");
          }}
          className="border rounded-md px-4 py-2"
        >
          Reset
        </button>

        <button
          onClick={() => {
            if (showEditor) {
              resetForm();
            } else {
              setEditingId(null);
              setFormName("");
              setFormAmount("");
              setFormCategory("");
              setFormDate("");
              setShowEditor(true);
            }
          }}
          className="border rounded-md px-4 py-2"
        >
          {showEditor ? "Cancel" : "Edit"}
        </button>
      </div>

      {showEditor && (
        <div className="mt-6 border rounded-lg p-4 space-y-4">
          <h2 className="text-lg font-semibold">
            {editingId ? "Edit Transaction" : "Add Transaction"}
          </h2>

          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="border rounded-md px-3 py-2"
            />

            <input
              type="text"
              placeholder="Category"
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              className="border rounded-md px-3 py-2"
            />

            <input
              type="number"
              placeholder="Amount"
              value={formAmount}
              onChange={(e) => setFormAmount(e.target.value)}
              className="border rounded-md px-3 py-2"
            />

            <input
              type="date"
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              className="border rounded-md px-3 py-2"
            />

            <button
              onClick={handleSubmitTransaction}
              className="border rounded-md px-4 py-2"
            >
              {editingId ? "Save Changes" : "Submit"}
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 border rounded-lg p-4 space-y-4">
        {filteredTransactions.length === 0 && (
          <p>No transactions in this date range.</p>
        )}

        {filteredTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex justify-between items-center border-b pb-2"
          >
            <div>
              <p className="font-medium">{transaction.name}</p>
              <p className="text-sm text-muted-foreground">
                {transaction.category} • {transaction.date}
                {transaction.source === "manual" ? " • Custom" : " • Bank"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <p
                className={`font-semibold ${
                  transaction.amount < 0 ? "text-red-500" : "text-green-500"
                }`}
              >
                {transaction.amount < 0
                  ? `-$${Math.abs(transaction.amount).toFixed(2)}`
                  : `+$${transaction.amount.toFixed(2)}`}
              </p>

              {transaction.source === "manual" && (
                <>
                  <button
                    onClick={() => startEditing(transaction)}
                    className="border rounded-md px-2 py-1 text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => removeTransaction(transaction.id)}
                    className="border rounded-md px-2 py-1 text-sm"
                  >
                    X
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
