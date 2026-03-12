import React from "react";

type Transaction = {
  id: number;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
};

const transactions: Transaction[] = [
  {
    id: 1,
    date: "2026-03-10",
    description: "Groceries",
    category: "Food",
    amount: -54.32,
    type: "expense",
  },
  {
    id: 2,
    date: "2026-03-09",
    description: "Paycheck",
    category: "Income",
    amount: 850.0,
    type: "income",
  },
  {
    id: 3,
    date: "2026-03-08",
    description: "Gas",
    category: "Transportation",
    amount: -42.18,
    type: "expense",
  },
];

export default function TransactionHistory() {
  return (
    <div style={{ padding: "24px" }}>
      <h1>Transaction History</h1>
      <p>View all of your recent income and expenses.</p>

      <div
        style={{
          marginTop: "20px",
          border: "1px solid #ddd",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5", textAlign: "left" }}>
              <th style={{ padding: "12px" }}>Date</th>
              <th style={{ padding: "12px" }}>Description</th>
              <th style={{ padding: "12px" }}>Category</th>
              <th style={{ padding: "12px" }}>Type</th>
              <th style={{ padding: "12px" }}>Amount</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} style={{ borderTop: "1px solid #eee" }}>
                <td style={{ padding: "12px" }}>{transaction.date}</td>
                <td style={{ padding: "12px" }}>{transaction.description}</td>
                <td style={{ padding: "12px" }}>{transaction.category}</td>
                <td style={{ padding: "12px", textTransform: "capitalize" }}>
                  {transaction.type}
                </td>
                <td
                  style={{
                    padding: "12px",
                    color: transaction.amount < 0 ? "red" : "green",
                    fontWeight: "bold",
                  }}
                >
                  ${Math.abs(transaction.amount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}