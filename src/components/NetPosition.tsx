const NetPosition = () => {
  const total = 12847.63;
  const accounts = [
    { name: "Checking", amount: 4231.18 },
    { name: "Savings", amount: 8102.45 },
    { name: "Credit Card", amount: -1486.00 },
  ];

  return (
    <section>
      <p className="text-sm font-body text-muted-foreground tracking-wide uppercase mb-2">
        Net Position
      </p>
      <p className="font-heading text-5xl md:text-6xl font-bold tracking-tight text-foreground">
        ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </p>
      <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2">
        {accounts.map((acc) => (
          <div key={acc.name} className="flex items-baseline gap-2">
            <span className="text-sm text-muted-foreground">{acc.name}</span>
            <span className="font-heading text-base text-foreground">
              {acc.amount < 0 ? "−" : ""}${Math.abs(acc.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NetPosition;
