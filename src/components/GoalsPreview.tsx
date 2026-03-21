import { Link } from "react-router-dom";

export default function GoalsPreview() {
  // temporary mock data (later you'll connect real state)
  const goals = [
    {
      id: "1",
      name: "Emergency Fund",
      saved: 1200,
      target: 5000,
    },
  ];

  const goal = goals[0]; // just show first goal for now

  if (!goal) {
    return (
      <div className="border rounded-lg p-4">
        <p className="text-sm text-muted-foreground">No goals yet</p>

        <Link
          to="/goals"
          className="text-sm text-primary hover:underline"
        >
          Create one →
        </Link>
      </div>
    );
  }

  const percent = Math.round((goal.saved / goal.target) * 100);

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-medium text-muted-foreground">
          Savings Goal
        </h2>

        <Link
          to="/goals"
          className="text-sm text-primary hover:underline"
        >
          View →
        </Link>
      </div>

      <p className="font-semibold">{goal.name}</p>

      <p className="text-sm">
        ${goal.saved} / ${goal.target}
      </p>

      {/* Progress bar */}
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        {percent}% complete
      </p>
    </div>
  );
}
