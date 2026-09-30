import React from "react";

export default function Home({
  user = {},
  metrics = {},
  goals = [],
  onNavigate,
}) {
  const income = Number(metrics?.monthlyIncome || user?.monthlyIncome || 0);
  const expenses = Number(metrics?.monthlyExpenses || user?.monthlyExpenses || 0);
  const savings = Math.max(income - expenses, 0);

  return (
    <div className="page home-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">SAVEIQ DASHBOARD</p>
          <h1>Welcome back{user?.name ? `, ${user.name}` : ""} 👋</h1>
          <p>Keep your savings plan simple and stay on track.</p>
        </div>

        <div className="header-actions">
          <button onClick={() => onNavigate?.("profile")}>
            Profile
          </button>

          <button onClick={() => onNavigate?.("settings")}>
            Settings
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Monthly Income</span>
          <strong>₹{income.toLocaleString("en-IN")}</strong>
        </div>

        <div className="stat-card">
          <span>Monthly Expenses</span>
          <strong>₹{expenses.toLocaleString("en-IN")}</strong>
        </div>

        <div className="stat-card">
          <span>Available to Save</span>
          <strong>₹{savings.toLocaleString("en-IN")}</strong>
        </div>
      </div>

      <section className="dashboard-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR GOALS</p>
            <h2>Savings goals</h2>
          </div>

          <button onClick={() => onNavigate?.("guide")}>
            View Guide
          </button>
        </div>

        {goals.length === 0 ? (
          <div className="empty-state">
            <h3>No savings goals yet</h3>
            <p>Create your first goal and start tracking your progress.</p>

            <button onClick={() => onNavigate?.("guide")}>
              Get Started
            </button>
          </div>
        ) : (
          <div className="goal-list">
            {goals.slice(0, 4).map((goal, index) => (
              <div className="goal-item" key={goal.id || index}>
                <div>
                  <strong>{goal.name || goal.title || "Savings Goal"}</strong>
                  <span>
                    ₹{Number(goal.saved || goal.current || 0).toLocaleString(
                      "en-IN"
                    )}{" "}
                    saved
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="quick-actions">
        <h2>Quick actions</h2>

        <div className="quick-action-grid">
          <button onClick={() => onNavigate?.("guide")}>
            <strong>Start Step-by-Step</strong>
            <span>Build your savings plan</span>
          </button>

          <button onClick={() => onNavigate?.("profile")}>
            <strong>Update Profile</strong>
            <span>Keep your information current</span>
          </button>

          <button onClick={() => onNavigate?.("settings")}>
            <strong>Settings</strong>
            <span>Manage your preferences</span>
          </button>
        </div>
      </section>
    </div>
  );
}
