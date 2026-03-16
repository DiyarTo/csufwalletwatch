export default function TransactionHistory() {
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold">Transaction History</h1>
      <p className="text-muted-foreground">
        View all income and expenses.
      </p>

      <div className="mt-6 border rounded-lg p-4">
        <p>No transactions yet.</p>
      </div>
    </div>
  );
}
