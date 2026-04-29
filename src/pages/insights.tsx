// src/pages/Insights.tsx

import { Link } from "react-router-dom";

export default function Insights() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Dashboard
          </Link>

          <h1 className="text-2xl font-bold">Insights</h1>

          {/* Empty spacer for symmetry */}
          <div className="w-20" />
        </div>

        {/* Placeholder Card */}
        <div className="border rounded-lg p-8 text-center">
          <h2 className="text-lg font-semibold mb-2">
            Insights Coming Soon
          </h2>

          <p className="text-sm text-muted-foreground">
            This page will display spending trends, savings progress, and financial analytics.
          </p>
        </div>
      </main>
    </div>
  );
}
