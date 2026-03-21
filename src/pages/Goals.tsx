import { useState } from "react";
import { Link } from "react-router-dom";

type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  deadline?: string;
};

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");

  const [selectedGoalId, setSelectedGoalId] = useState("");
  const [contributionAmount, setContributionAmount] = useState("");

  const resetForm = () => {
    setName("");
    setTargetAmount("");
    setDeadline("");
    setEditingGoalId(null);
    setShowCreateForm(false);
  };

  const handleAddOrUpdateGoal = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !targetAmount) return;

    if (editingGoalId) {
      setGoals((prev) =>
        prev.map((goal) =>
          goal.id === editingGoalId
            ? {
                ...goal,
                name: name.trim(),
                targetAmount: Number(targetAmount),
                deadline: deadline || undefined,
              }
            : goal
        )
      );
    } else {
      const newGoal: Goal = {
        id: crypto.randomUUID(),
        name: name.trim(),
        targetAmount: Number(targetAmount),
        savedAmount: 0,
        deadline: deadline || undefined,
      };

      setGoals((prev) => [...prev, newGoal]);
    }

    resetForm();
  };

  const handleEditGoal = (goal: Goal) => {
    setName(goal.name);
    setTargetAmount(String(goal.targetAmount));
    setDeadline(goal.deadline || "");
    setEditingGoalId(goal.id);
    setShowCreateForm(true);
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== goalId));

    if (selectedGoalId === goalId) {
      setSelectedGoalId("");
    }

    if (editingGoalId === goalId) {
      resetForm();
    }
  };

  const handleAddContribution = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedGoalId || !contributionAmount) return;

    const amount = Number(contributionAmount);
    if (amount <= 0) return;

    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === selectedGoalId
          ? { ...goal, savedAmount: goal.savedAmount + amount }
          : goal
      )
    );

    setContributionAmount("");
    setSelectedGoalId("");
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-sm text-primary hover:underline"
          >
            ← Back
          </Link>
        
          <h1 className="text-2xl font-bold">My Goals</h1>
        
          {!showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 rounded bg-black text-white"
            >
              + New Goal
            </button>
          )}
        </div>

          {!showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 rounded bg-black text-white"
            >
              + New Goal
            </button>
          )}
        </div>

        {/* Contribution Section */}
        <div className="border rounded-lg p-4 space-y-4">
          <h2 className="text-lg font-semibold">Add Contribution</h2>

          {goals.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No goals yet. Create a goal first.
            </p>
          ) : (
            <form onSubmit={handleAddContribution} className="space-y-3">
              <select
                value={selectedGoalId}
                onChange={(e) => setSelectedGoalId(e.target.value)}
                className="w-full border p-2 rounded bg-background"
              >
                <option value="">Select a goal</option>
                {goals.map((goal) => (
                  <option key={goal.id} value={goal.id}>
                    {goal.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Contribution amount"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                className="w-full border p-2 rounded"
              />

              <button
                type="submit"
                className="px-4 py-2 rounded bg-black text-white"
              >
                Add Contribution
              </button>
            </form>
          )}
        </div>

        {/* Create / Edit Goal Form */}
        {showCreateForm && (
          <div className="border rounded-lg p-4 space-y-4">
            <h2 className="text-lg font-semibold">
              {editingGoalId ? "Edit Goal" : "Create New Goal"}
            </h2>

            <form onSubmit={handleAddOrUpdateGoal} className="space-y-3">
              <input
                type="text"
                placeholder="Goal name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-2 rounded"
              />

              <input
                type="number"
                placeholder="Target amount"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full border p-2 rounded"
              />

              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full border p-2 rounded"
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-black text-white"
                >
                  {editingGoalId ? "Save Changes" : "Add Goal"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded border"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Goals List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Your Goals</h2>

          {goals.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You have no goals yet.
            </p>
          ) : (
            goals.map((goal) => {
              const percent =
                goal.targetAmount > 0
                  ? Math.min((goal.savedAmount / goal.targetAmount) * 100, 100)
                  : 0;

              return (
                <div
                  key={goal.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{goal.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Target: ${goal.targetAmount.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Saved: ${goal.savedAmount.toFixed(2)}
                      </p>
                      {goal.deadline && (
                        <p className="text-sm text-muted-foreground">
                          Deadline: {goal.deadline}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditGoal(goal)}
                        className="px-3 py-1 rounded border text-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="px-3 py-1 rounded border text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-black"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {percent.toFixed(0)}% complete
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
