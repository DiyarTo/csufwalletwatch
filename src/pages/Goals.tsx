import { useState } from "react";

type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  deadline?: string;
};

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);

  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !targetAmount) return;

    const newGoal: Goal = {
      id: crypto.randomUUID(),
      name,
      targetAmount: Number(targetAmount),
      savedAmount: 0,
      deadline: deadline || undefined,
    };

    setGoals((prev) => [...prev, newGoal]);

    // reset form
    setName("");
    setTargetAmount("");
    setDeadline("");
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Goals</h1>

      {/* FORM */}
      <form onSubmit={handleAddGoal} className="space-y-3 mb-6">
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

        <button
          type="submit"
          className="w-full bg-black text-white p-2 rounded"
        >
          Add Goal
        </button>
      </form>

      {/* GOALS LIST */}
      <div className="space-y-3">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="border p-3 rounded shadow-sm"
          >
            <p className="font-semibold">{goal.name}</p>
            <p>Target: ${goal.targetAmount}</p>
            <p>Saved: ${goal.savedAmount}</p>
            {goal.deadline && <p>Deadline: {goal.deadline}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
