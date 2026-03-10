const MonthlyPace = () => {
  const income = 5200;
  const spending = 3140;
  const ratio = Math.min(spending / income, 1);
  const remaining = income - spending;

  return (
    <section className="bg-card rounded-lg p-6">
      <p className="text-sm font-body text-muted-foreground tracking-wide uppercase mb-4">
        This Month's Pace
      </p>

      <div className="flex justify-between items-baseline mb-3">
        <span className="text-sm text-muted-foreground">Spent</span>
        <span className="font-heading text-lg text-foreground">
          ${spending.toLocaleString()}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${ratio > 0.85 ? "bg-primary" : "bg-foreground"}`}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>

      <div className="flex justify-between items-baseline mt-3">
        <span className="text-sm text-muted-foreground">Income</span>
        <span className="font-heading text-lg text-foreground">
          ${income.toLocaleString()}
        </span>
      </div>

      <div className="mt-5 pt-4 border-t border-border">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-muted-foreground">Remaining</span>
          <span className="font-heading text-xl text-foreground">
            ${remaining.toLocaleString()}
          </span>
        </div>
      </div>
    </section>
  );
};

export default MonthlyPace;
