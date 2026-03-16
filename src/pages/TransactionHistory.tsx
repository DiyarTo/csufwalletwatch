import { useState } from "react";

type Transaction = {
  id: string;
  date: string;
  name: string;
  amount: number;
  category: string;
  type: "income" | "expense";
};

const sampleTransactions: Transaction[] = [
  {
    id: "1",
    date: "2026-03-01",
    name: "Amazon Paycheck",
    amount: 1250,
    category: "Income",
    type: "income",
  },
  {
    id: "2",
    date: "2026-03-03",
    name: "Chipotle",
    amount: -14.75,
    category: "Food",
    type: "expense",
  },
  {
    id: "3",
    date: "2026-03-05",
    name: "Gas Station",
    amount: -48.2,
    category: "Transportation",
    type: "expense",
  },
];

export default function TransactionHistory() {

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredTransactions = sampleTransactions.filter((transaction) => {
    if (startDate && transaction.date < startDate) return false;
    if (endDate && transaction.date > endDate) return false;
    return true;
  });

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold">Transaction History</h1>

      <p className="text-muted-foreground">
        View all income and expenses.
      </p>

      {/* Date range selector */}
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
          Clear
        </button>

     
