const bills = [
  { name: "Electric Co.", amount: 142.00, due: "Mar 12" },
  { name: "Internet", amount: 79.99, due: "Mar 13" },
  { name: "Car Insurance", amount: 215.00, due: "Mar 15" },
  { name: "Streaming", amount: 15.99, due: "Mar 16" },
];

const UpcomingBills = () => {
  return (
    <section className="bg-card rounded-lg p-6">
      <p className="text-sm font-body text-muted-foreground tracking-wide uppercase mb-4">
        Upcoming Bills — Next 7 Days
      </p>

      <ul className="space-y-4">
        {bills.map((bill) => (
          <li key={bill.name} className="flex items-center justify-between">
            <div>
              <p className="text-foreground text-sm font-medium">{bill.name}</p>
              <p className="text-xs text-muted-foreground">{bill.due}</p>
            </div>
            <span className="font-heading text-base text-primary">
              ${bill.amount.toFixed(2)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 pt-4 border-t border-border flex justify-between items-baseline">
        <span className="text-sm text-muted-foreground">Total due</span>
        <span className="font-heading text-lg text-foreground">
          ${bills.reduce((s, b) => s + b.amount, 0).toFixed(2)}
        </span>
      </div>
    </section>
  );
};

export default UpcomingBills;
