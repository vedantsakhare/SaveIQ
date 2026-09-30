import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Target,
  ArrowLeftRight,
  BarChart3,
  Sparkles,
  Settings,
  Wallet,
  TrendingUp,
  PiggyBank,
  ShieldCheck,
  Plus,
  Trash2,
  X,
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
  CircleDollarSign,
  Activity,
  Menu,
  ChevronRight,
} from "lucide-react";

import "./App.css";
import Profile from "./components/Profile";
import SettingsPage from "./components/Settings";


const INITIAL_MISSIONS = [
  {
    id: 1,
    name: "Emergency Shield",
    category: "Emergency",
    target: 50000,
    saved: 18000,
    targetDate: "2027-03-31",
    color: "purple",
  },
  {
    id: 2,
    name: "Dream Home",
    category: "Home",
    target: 300000,
    saved: 85000,
    targetDate: "2028-12-31",
    color: "green",
  },
  {
    id: 3,
    name: "Freedom Trip",
    category: "Travel",
    target: 100000,
    saved: 42000,
    targetDate: "2027-12-31",
    color: "orange",
  },
];

const INITIAL_TRANSACTIONS = [
  {
    id: 1,
    title: "Emergency Shield",
    type: "income",
    amount: 5000,
    date: "30 Sep 2026",
  },
  {
    id: 2,
    title: "Dream Home",
    type: "income",
    amount: 8000,
    date: "28 Sep 2026",
  },
  {
    id: 3,
    title: "Food & Dining",
    type: "expense",
    amount: 1200,
    date: "27 Sep 2026",
  },
  {
    id: 4,
    title: "Freedom Trip",
    type: "income",
    amount: 3000,
    date: "25 Sep 2026",
  },
];

const formatMoney = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

function App() {
  

  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [missions, setMissions] = useState(() => {
    const stored = localStorage.getItem("saveiq_missions");
    return stored ? JSON.parse(stored) : INITIAL_MISSIONS;
  });

  const [transactions, setTransactions] = useState(() => {
    const stored = localStorage.getItem("saveiq_transactions");
    return stored ? JSON.parse(stored) : INITIAL_TRANSACTIONS;
  });

  

  const [showCreate, setShowCreate] = useState(false);
  const [showAdd, setShowAdd] = useState(null);

  const [showTransaction, setShowTransaction] = useState(false);

const [transactionForm, setTransactionForm] = useState({
  title: "",
  type: "income",
  amount: "",
});

   const [aiResult, setAiResult] = useState(null);
const [aiLoading, setAiLoading] = useState(false);
const [aiError, setAiError] = useState("");

  const [missionForm, setMissionForm] = useState({
    name: "",
    category: "General",
    target: "",
    starting: "",
    date: "",
  });

  const [amount, setAmount] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "saveiq_missions",
      JSON.stringify(missions)
    );
  }, [missions]);

  useEffect(() => {
    localStorage.setItem(
      "saveiq_transactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  const totalSaved = useMemo(
    () =>
      missions.reduce(
        (sum, mission) => sum + Number(mission.saved),
        0
      ),
    [missions]
  );

  const totalTarget = useMemo(
    () =>
      missions.reduce(
        (sum, mission) => sum + Number(mission.target),
        0
      ),
    [missions]
  );

  const savingsRate =
    totalTarget === 0
      ? 0
      : Math.round((totalSaved / totalTarget) * 100);

  const monthlySaving = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  const monthlyExpenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  const health =
    savingsRate >= 60
      ? "Excellent"
      : savingsRate >= 40
      ? "Strong"
      : savingsRate >= 20
      ? "Growing"
      : "Starting";
  async function analyzeFinances() {
  setAiLoading(true);
  setAiError("");

  try {
    const payload = {
      user: {
        currency: "INR",
      },

      metrics: {
        totalSaved,
        totalTarget,
        savingsRate,
        monthlySaving,
        monthlyExpenses,
        health,
      },

      goals: missions.map((mission) => ({
        id: mission.id,
        name: mission.name,
        category: mission.category,
        target: Number(mission.target),
        saved: Number(mission.saved),
        targetDate: mission.targetDate,
      })),

      recentTransactions: transactions
        .slice(0, 15)
        .map((transaction) => ({
          title: transaction.title,
          type: transaction.type,
          amount: Number(transaction.amount),
          date: transaction.date,
        })),
    };

    const response = await fetch("/api/analyze", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),
    });

    const text = await response.text();

let data;

try {
  data = text ? JSON.parse(text) : {};
} catch {
  throw new Error(
    `Server returned invalid response (${response.status}).`
  );
}

if (!response.ok) {
  throw new Error(
    data?.error || `AI analysis failed (${response.status}).`
  );
}

setAiResult(data.result);


   
  } catch (error) {
    console.error(error);

    setAiError(
      error.message ||
        "Unable to analyze your finances right now."
    );
  } finally {
    setAiLoading(false);
  }
}
  
function addTransaction(e) {
  e.preventDefault();

  const value = Number(transactionForm.amount);

  if (!transactionForm.title.trim()) {
    alert("Enter a description.");
    return;
  }

  if (value <= 0) {
    alert("Enter a valid amount.");
    return;
  }

  const newTransaction = {
    id: Date.now(),
    title: transactionForm.title.trim(),
    type: transactionForm.type,
    amount: value,
    date: new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  };

  setTransactions((current) => [
    newTransaction,
    ...current,
  ]);

  setTransactionForm({
    title: "",
    type: "income",
    amount: "",
  });

  setShowTransaction(false);
}

  function createMission(e) {
    e.preventDefault();

    const target = Number(missionForm.target);
    const starting = Number(missionForm.starting || 0);

    if (!missionForm.name.trim()) {
      alert("Enter a mission name.");
      return;
    }

    if (target <= 0) {
      alert("Enter a valid target amount.");
      return;
    }

    if (!missionForm.date) {
      alert("Select a target date.");
      return;
    }

    const newMission = {
      id: Date.now(),
      name: missionForm.name,
      category: missionForm.category,
      target,
      saved: starting,
      targetDate: missionForm.date,
      color:
        missionForm.category === "Travel"
          ? "orange"
          : missionForm.category === "Emergency"
          ? "purple"
          : "green",
    };

    setMissions((current) => [...current, newMission]);

    if (starting > 0) {
      setTransactions((current) => [
        {
          id: Date.now() + 1,
          title: missionForm.name,
          type: "income",
          amount: starting,
          date: new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        },
        ...current,
      ]);
    }

    setMissionForm({
      name: "",
      category: "General",
      target: "",
      starting: "",
      date: "",
    });

    setShowCreate(false);
  }

  function addSavings(e) {
    e.preventDefault();

    const value = Number(amount);

    if (!value || value <= 0) {
      alert("Enter a valid amount.");
      return;
    }

    const mission = missions.find(
      (item) => item.id === showAdd
    );

    if (!mission) return;

    setMissions((current) =>
      current.map((item) =>
        item.id === mission.id
          ? {
              ...item,
              saved: item.saved + value,
            }
          : item
      )
    );

    setTransactions((current) => [
      {
        id: Date.now(),
        title: mission.name,
        type: "income",
        amount: value,
        date: new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      },
      ...current,
    ]);

    setAmount("");
    setShowAdd(null);
  }
   

  function deleteMission(id) {
    const mission = missions.find(
      (item) => item.id === id
    );

    if (!mission) return;

    if (
      window.confirm(
        `Delete "${mission.name}" from your savings missions?`
      )
    ) {
      setMissions((current) =>
        current.filter((item) => item.id !== id)
      );
    }
  }

  function navigation(page) {
    setActivePage(page);
    setSidebarOpen(false);
  }

  return (
    <div className="saveiq-app">

      {/* MOBILE HEADER */}

      <div className="mobile-header">
        <button
          className="mobile-menu"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={22} />
        </button>

        <div className="mobile-logo">
          <Wallet size={18} />
          SaveIQ
        </div>
      </div>

      {/* SIDEBAR */}

      <aside
        className={`sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >
        <div className="logo-area">
          <div className="logo-mark">
            <Wallet size={21} />
          </div>

          <div>
            <h1>SaveIQ</h1>
            <p>Smart Savings OS</p>
          </div>
        </div>

        <div className="sidebar-label">
          WORKSPACE
        </div>

        <nav>
          <button
            className={
              activePage === "Dashboard"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => navigation("Dashboard")}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button
            className={
              activePage === "Missions"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => navigation("Missions")}
          >
            <Target size={18} />
            Savings Missions
            <span className="nav-count">
              {missions.length}
            </span>
          </button>

          <button
            className={
              activePage === "Transactions"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => navigation("Transactions")}
          >
            <ArrowLeftRight size={18} />
            Transactions
          </button>

          <button
            className={
              activePage === "Analytics"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => navigation("Analytics")}
          >
            <BarChart3 size={18} />
            Analytics
          </button>

          <button
            className={
              activePage === "AI Copilot"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => navigation("AI Copilot")}
          >
            <Sparkles size={18} />
            AI Copilot
            <span className="new-label">
              SOON
            </span>
          </button>
        </nav>

        <div className="sidebar-bottom">

          <div className="sidebar-health">
            <div className="health-small-icon">
              <ShieldCheck size={18} />
            </div>

            <div>
              <span>Financial Health</span>
              <strong>{health}</strong>
            </div>
          </div>

          <button
  className={
    activePage === "Settings"
      ? "nav-item active"
      : "nav-item"
  }
  onClick={() => navigation("Settings")}
>
  <Settings size={18} />
  Settings
</button>
<button
  className={
    activePage === "Profile"
      ? "nav-item active"
      : "nav-item"
  }
  onClick={() => navigation("Profile")}
>
  <Wallet size={18} />
  Profile
</button>

        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN */}

      <main className="main-content">

        {/* TOP BAR */}

        <div className="topbar">
          <div>
            <p className="topbar-date">
              <CalendarDays size={14} />
              Wednesday, 30 September 2026
            </p>

            <h2>
              Welcome back, <span>Saver.</span>
            </h2>
          </div>

          <div className="top-actions">
            <div className="system-pill">
              <span></span>
              Financial system active
            </div>

            <button
              className="primary-button"
              onClick={() => setShowCreate(true)}
            >
              <Plus size={17} />
              New Mission
            </button>
          </div>
        </div>

        {/* DASHBOARD */}

        {activePage === "Dashboard" && (
          <>
            <section className="overview-grid">

              <div className="overview-card main-money">
                <div className="card-label">
                  TOTAL SAVINGS
                  <Wallet size={16} />
                </div>

                <h3>{formatMoney(totalSaved)}</h3>

                <div className="money-growth">
                  <span className="positive">
                    <TrendingUp size={14} />
                    +12.8%
                  </span>

                  <span>vs last month</span>
                </div>

                <div className="mini-chart">
                  <span style={{ height: "32%" }} />
                  <span style={{ height: "44%" }} />
                  <span style={{ height: "38%" }} />
                  <span style={{ height: "57%" }} />
                  <span style={{ height: "48%" }} />
                  <span style={{ height: "70%" }} />
                  <span style={{ height: "82%" }} />
                  <span style={{ height: "91%" }} />
                </div>
              </div>

              <div className="overview-card">
                <div className="card-label">
                  MONTHLY SAVINGS
                  <PiggyBank size={16} />
                </div>

                <h3>{formatMoney(monthlySaving)}</h3>

                <p className="card-description">
                  Money added to your goals this month.
                </p>

                <div className="small-progress">
                  <div style={{ width: "68%" }} />
                </div>

                <div className="progress-meta">
                  <span>68% of monthly target</span>
                  <strong>₹27,000</strong>
                </div>
              </div>

              <div className="overview-card">
                <div className="card-label">
                  SAVINGS RATE
                  <Activity size={16} />
                </div>

                <h3>{savingsRate}%</h3>

                <p className="card-description">
                  Portion of your goal portfolio already funded.
                </p>

                <div className="rate-ring">
                  <div
                    style={{
                      background: `conic-gradient(
                        #a855f7 ${savingsRate * 3.6}deg,
                        rgba(255,255,255,.07) 0deg
                      )`,
                    }}
                  >
                    <span>{savingsRate}%</span>
                  </div>
                </div>
              </div>

              <div className="overview-card">
                <div className="card-label">
                  FINANCIAL HEALTH
                  <ShieldCheck size={16} />
                </div>

                <div className="health-value">
                  <div className="health-score">
                    {Math.min(
                      100,
                      savingsRate + 43
                    )}
                  </div>

                  <div>
                    <h4>{health}</h4>
                    <p>Stable financial progress</p>
                  </div>
                </div>

                <div className="health-bars">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>

            </section>

            {/* FINANCIAL PULSE */}

            <section className="section-block">

              <div className="section-heading">
                <div>
                  <p className="section-kicker">
                    FINANCIAL PULSE
                  </p>
                  <h2>Where your money stands</h2>
                </div>

                <span className="period-tag">
                  September 2026
                </span>
              </div>

              <div className="pulse-grid">

                <div className="pulse-card income">
                  <div className="pulse-icon">
                    <ArrowDownRight size={19} />
                  </div>

                  <div>
                    <span>Goal Contributions</span>
                    <strong>
                      {formatMoney(monthlySaving)}
                    </strong>
                  </div>

                  <small>Money going into goals</small>
                </div>

                <div className="pulse-card expense">
                  <div className="pulse-icon">
                    <ArrowUpRight size={19} />
                  </div>

                  <div>
                    <span>Tracked Expenses</span>
                    <strong>
                      {formatMoney(monthlyExpenses)}
                    </strong>
                  </div>

                  <small>Recorded spending</small>
                </div>

                <div className="pulse-card">
                  <div className="pulse-icon purple-icon">
                    <CircleDollarSign size={19} />
                  </div>

                  <div>
                    <span>Total Goal Value</span>
                    <strong>
                      {formatMoney(totalTarget)}
                    </strong>
                  </div>

                  <small>Across all active missions</small>
                </div>

              </div>
            </section>

            {/* MISSIONS */}

            <section className="section-block">

              <div className="section-heading">
                <div>
                  <p className="section-kicker">
                    SAVINGS PORTFOLIO
                  </p>

                  <h2>Active Missions</h2>

                  <p>
                    Every goal has a number, a deadline and a plan.
                  </p>
                </div>

                <button
                  className="secondary-button"
                  onClick={() => setActivePage("Missions")}
                >
                  View all
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="mission-grid">

                {missions.slice(0, 3).map((mission) => {

                  const progress = Math.min(
                    100,
                    Math.round(
                      (mission.saved / mission.target) * 100
                    )
                  );

                  const remaining = Math.max(
                    0,
                    mission.target - mission.saved
                  );

                  return (
                    <div
                      className={`mission-card-new ${mission.color}`}
                      key={mission.id}
                    >

                      <div className="mission-header">

                        <div className="mission-category">
                          {mission.category}
                        </div>

                        <button
                          className="delete-button"
                          onClick={() =>
                            deleteMission(mission.id)
                          }
                        >
                          <Trash2 size={15} />
                        </button>

                      </div>

                      <h3>{mission.name}</h3>

                      <div className="mission-values">
                        <div>
                          <span>Saved</span>
                          <strong>
                            {formatMoney(mission.saved)}
                          </strong>
                        </div>

                        <div>
                          <span>Target</span>
                          <strong>
                            {formatMoney(mission.target)}
                          </strong>
                        </div>
                      </div>

                      <div className="mission-progress">

                        <div className="mission-progress-label">
                          <span>
                            {progress}% complete
                          </span>

                          <strong>
                            {formatMoney(remaining)} left
                          </strong>
                        </div>

                        <div className="mission-bar">
                          <div
                            style={{
                              width: `${progress}%`,
                            }}
                          />
                        </div>

                      </div>

                      <div className="mission-footer">

                        <span>
                          <CalendarDays size={13} />
                          {mission.targetDate}
                        </span>

                        <button
                          onClick={() =>
                            setShowAdd(mission.id)
                          }
                        >
                          <Plus size={14} />
                          Add money
                        </button>

                      </div>

                    </div>
                  );
                })}

              </div>
            </section>

            {/* BOTTOM */}

            <section className="bottom-dashboard">

              <div className="transactions-panel">

                <div className="section-heading compact">
                  <div>
                    <p className="section-kicker">
                      MONEY MOVES
                    </p>

                    <h2>Recent activity</h2>
                  </div>

                  <button
                    className="text-button"
                    onClick={() =>
                      setActivePage("Transactions")
                    }
                  >
                    See all
                  </button>
                </div>

                <div className="transaction-list">

                  {transactions.slice(0, 5).map(
                    (transaction) => (
                      <div
                        className="transaction-row"
                        key={transaction.id}
                      >

                        <div
                          className={`transaction-icon ${
                            transaction.type
                          }`}
                        >
                          {transaction.type === "income" ? (
                            <ArrowDownRight size={17} />
                          ) : (
                            <ArrowUpRight size={17} />
                          )}
                        </div>

                        <div className="transaction-name">
                          <strong>
                            {transaction.title}
                          </strong>

                          <span>
                            {transaction.date}
                          </span>
                        </div>

                        <strong
                          className={
                            transaction.type === "income"
                              ? "income-text"
                              : "expense-text"
                          }
                        >
                          {transaction.type === "income"
                            ? "+"
                            : "-"}
                          {formatMoney(transaction.amount)}
                        </strong>

                      </div>
                    )
                  )}

                </div>
              </div>

              <div className="copilot-card">

                <div className="copilot-glow" />

                <div className="copilot-icon">
                  <Sparkles size={23} />
                </div>

                <p className="section-kicker">
                  SAVEIQ COPILOT
                </p>

                <h2>
                  Your financial
                  <br />
                  intelligence layer.
                </h2>

                <p>
                  Gemini-powered insights will analyze your
                  savings progress, goals and spending patterns.
                </p>

                                <button
                    className="copilot-button"
                    onClick={analyzeFinances}
                    disabled={aiLoading}
                  >
                    <Sparkles size={16} />

                    {aiLoading
                      ? "Analyzing..."
                      : "Analyze my finances"}
                  </button>


                <div className="copilot-status">
                  <span />
                  AI engine ready for connection
                </div>

              </div>

            </section>
          </>
        )}

        {/* MISSIONS PAGE */}

        {activePage === "Missions" && (
          <section className="page-section">

            <div className="page-title">

              <button
  className="primary-button"
  onClick={() => setShowTransaction(true)}
>
  <Plus size={17} />
  Add Transaction
</button>

              <div>
                <p className="section-kicker">
                  GOAL MANAGEMENT
                </p>

                <h1>Savings Missions</h1>

                <p>
                  Create, monitor and fund your financial goals.
                </p>
              </div>

              <button
                className="primary-button"
                onClick={() => setShowCreate(true)}
              >
                <Plus size={17} />
                Create Mission
              </button>
            </div>

            <div className="mission-grid large">

              {missions.map((mission) => {

                const progress = Math.min(
                  100,
                  Math.round(
                    (mission.saved / mission.target) * 100
                  )
                );

                return (
                  <div
                    className={`mission-card-new ${mission.color}`}
                    key={mission.id}
                  >

                    <div className="mission-header">
                      <div className="mission-category">
                        {mission.category}
                      </div>

                      <button
                        className="delete-button"
                        onClick={() =>
                          deleteMission(mission.id)
                        }
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <h3>{mission.name}</h3>

                    <div className="big-mission-number">
                      {formatMoney(mission.saved)}
                    </div>

                    <p>
                      of {formatMoney(mission.target)}
                    </p>

                    <div className="mission-bar">
                      <div
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>

                    <div className="mission-progress-label">
                      <span>{progress}% complete</span>
                      <strong>
                        {formatMoney(
                          mission.target - mission.saved
                        )}{" "}
                        remaining
                      </strong>
                    </div>

                    <button
                      className="mission-add-large"
                      onClick={() =>
                        setShowAdd(mission.id)
                      }
                    >
                      <Plus size={16} />
                      Add Savings
                    </button>

                  </div>
                );
              })}

            </div>
          </section>
        )}

        {/* TRANSACTIONS */}

        {activePage === "Transactions" && (
          <section className="page-section">

           <div className="page-title">
  <div>
    <p className="section-kicker">
      MONEY MOVES
    </p>

    <h1>Transactions</h1>

    <p>
      A simple history of your savings activity.
    </p>
  </div>

  <button
    className="primary-button"
    onClick={() => setShowTransaction(true)}
  >
    <Plus size={17} />
    Add Transaction
  </button>
</div>


            <div className="full-panel">

              {transactions.map((transaction) => (
                <div
                  className="transaction-row large-row"
                  key={transaction.id}
                >

                  <div
                    className={`transaction-icon ${
                      transaction.type
                    }`}
                  >
                    {transaction.type === "income" ? (
                      <ArrowDownRight size={18} />
                    ) : (
                      <ArrowUpRight size={18} />
                    )}
                  </div>

                  <div className="transaction-name">
                    <strong>{transaction.title}</strong>
                    <span>{transaction.date}</span>
                  </div>

                  <strong
                    className={
                      transaction.type === "income"
                        ? "income-text"
                        : "expense-text"
                    }
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatMoney(transaction.amount)}
                  </strong>

                </div>
              ))}
             <button
  className="primary-button"
  onClick={() => setShowTransaction(true)}
>
  <Plus size={17} />
  Add Transaction
</button>

            </div>
          </section>
        )}

        {/* ANALYTICS */}

        {activePage === "Analytics" && (
          <section className="page-section">

            <div className="page-title">
              <div>
                <p className="section-kicker">
                  FINANCIAL INTELLIGENCE
                </p>

                <h1>Analytics</h1>

                <p>
                  Understand your savings performance.
                </p>
              </div>
            </div>

            <div className="analytics-grid">

              <div className="full-panel analytics-card">

                <div className="section-heading compact">
                  <div>
                    <p className="section-kicker">
                      GOAL PROGRESS
                    </p>
                    <h2>Portfolio completion</h2>
                  </div>
                </div>

                <div className="large-stat">
                  {savingsRate}%
                </div>

                <div className="large-progress">
                  <div
                    style={{
                      width: `${savingsRate}%`,
                    }}
                  />
                </div>

                <p>
                  You have saved{" "}
                  <strong>{formatMoney(totalSaved)}</strong>{" "}
                  toward{" "}
                  <strong>{formatMoney(totalTarget)}</strong>{" "}
                  across your active missions.
                </p>

              </div>

              <div className="full-panel analytics-card">

                <p className="section-kicker">
                  FINANCIAL HEALTH
                </p>

                <h2>{health}</h2>

                <div className="health-meter">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>

                <p>
                  Your current savings progress indicates
                  consistent movement toward your financial goals.
                </p>

              </div>

            </div>
          </section>
        )}
  {/* SETTINGS */}

{activePage === "Settings" && (
  <SettingsPage />
)}
{/* SETTINGS */}

{activePage === "Settings" && (
  <SettingsPage />
)}
  {/* PROFILE */}

{activePage === "Profile" && (
  <Profile />
)}



        {/* AI PAGE */}

        {activePage === "AI Copilot" && (
          <section className="page-section">

            <div className="ai-page">

              <div className="large-ai-icon">
                <Sparkles size={34} />
              </div>

              <p className="section-kicker">
                SAVEIQ AI
              </p>

              <h1>
                Your personal
                <br />
                financial copilot.
              </h1>

              <p>
                SaveIQ will use Gemini to analyze your goals,
                savings behavior and financial activity and
                turn the data into practical recommendations.
              </p>

              <button
  className="copilot-button large-button"
  onClick={analyzeFinances}
  disabled={aiLoading}
>
  <Sparkles size={17} />

  {aiLoading
    ? "Analyzing..."
    : "Start AI Analysis"}
</button>
  {aiError && (
  <div
    style={{
      marginTop: "20px",
      padding: "14px",
      borderRadius: "10px",
      color: "#fda4af",
      background: "rgba(244,63,94,.08)",
      border: "1px solid rgba(244,63,94,.15)",
      fontSize: ".7rem",
      textAlign: "left",
    }}
  >
    {aiError}
  </div>
)}

{aiResult && (
  <div
    style={{
      marginTop: "30px",
      padding: "22px",
      borderRadius: "16px",
      border: "1px solid rgba(168,85,247,.15)",
      background: "rgba(168,85,247,.045)",
      textAlign: "left",
    }}
  >
    <p className="section-kicker">
      GEMINI INSIGHT
    </p>

    <h2>{aiResult.summary}</h2>

    <p
      style={{
        color: "#aaa7b9",
        fontSize: ".72rem",
        lineHeight: 1.7,
      }}
    >
      {aiResult.goalInsight}
    </p>

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "14px",
        marginTop: "20px",
      }}
    >
      <div>
        <strong>Strengths</strong>

        <ul>
          {aiResult.strengths?.map(
            (item, index) => (
              <li key={index}>{item}</li>
            )
          )}
        </ul>
      </div>

      <div>
        <strong>Watch points</strong>

        <ul>
          {aiResult.risks?.map(
            (item, index) => (
              <li key={index}>{item}</li>
            )
          )}
        </ul>
      </div>
    </div>

    <div style={{ marginTop: "20px" }}>
      <strong>Recommendations</strong>

      <ul>
        {aiResult.recommendations?.map(
          (item, index) => (
            <li key={index}>{item}</li>
          )
        )}
      </ul>
    </div>

    <div
      style={{
        marginTop: "20px",
        padding: "13px",
        borderRadius: "10px",
        background: "rgba(16,185,129,.07)",
        border:
          "1px solid rgba(16,185,129,.12)",
      }}
    >
      <strong>Next action</strong>

      <p
        style={{
          margin: "6px 0 0",
          color: "#a7f3d0",
          fontSize: ".7rem",
        }}
      >
        {aiResult.nextAction}
      </p>
    </div>
  </div>
)}


              <div className="ai-features">

                <div>
                  <ShieldCheck size={20} />
                  <strong>Goal analysis</strong>
                  <span>
                    Understand whether your targets are realistic.
                  </span>
                </div>

                <div>
                  <TrendingUp size={20} />
                  <strong>Savings insights</strong>
                  <span>
                    Discover patterns in your saving behavior.
                  </span>
                </div>

                <div>
                  <Wallet size={20} />
                  <strong>Action plans</strong>
                  <span>
                    Receive practical financial suggestions.
                  </span>
                </div>

              </div>

            </div>

          </section>
        )}

      </main>

      {/* CREATE MISSION MODAL */}

      {showCreate && (
        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-title">
              <div>
                <p className="section-kicker">
                  NEW FINANCIAL GOAL
                </p>

                <h2>Create Savings Mission</h2>
              </div>

              <button
                className="close-button"
                onClick={() => setShowCreate(false)}
              >
                <X size={19} />
              </button>
            </div>

            <form
              className="form"
              onSubmit={createMission}
            >

              <label>
                Mission Name
                <input
                  value={missionForm.name}
                  onChange={(e) =>
                    setMissionForm({
                      ...missionForm,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g. New Laptop"
                />
              </label>

              <label>
                Category
                <select
                  value={missionForm.category}
                  onChange={(e) =>
                    setMissionForm({
                      ...missionForm,
                      category: e.target.value,
                    })
                  }
                >
                  <option>General</option>
                  <option>Emergency</option>
                  <option>Home</option>
                  <option>Travel</option>
                  <option>Education</option>
                  <option>Technology</option>
                </select>
              </label>

              <label>
                Target Amount
                <input
                  type="number"
                  min="1"
                  value={missionForm.target}
                  onChange={(e) =>
                    setMissionForm({
                      ...missionForm,
                      target: e.target.value,
                    })
                  }
                  placeholder="50000"
                />
              </label>

              <label>
                Starting Savings
                <input
                  type="number"
                  min="0"
                  value={missionForm.starting}
                  onChange={(e) =>
                    setMissionForm({
                      ...missionForm,
                      starting: e.target.value,
                    })
                  }
                  placeholder="5000"
                />
              </label>

              <label>
                Target Date
                <input
                  type="date"
                  value={missionForm.date}
                  onChange={(e) =>
                    setMissionForm({
                      ...missionForm,
                      date: e.target.value,
                    })
                  }
                />
              </label>

              <button
                className="primary-button full"
                type="submit"
              >
                <Plus size={17} />
                Create Mission
              </button>

            </form>
          </div>
        </div>
      )}



      {/* ADD SAVINGS MODAL */}
      {/* ADD TRANSACTION MODAL */}

{showTransaction && (
  <div className="modal-overlay">
    <div className="modal">

      <div className="modal-title">
        <div>
          <p className="section-kicker">
            MONEY MOVEMENT
          </p>

          <h2>Add Transaction</h2>
        </div>

        <button
          className="close-button"
          onClick={() => setShowTransaction(false)}
        >
          <X size={19} />
        </button>
      </div>

      <form
        className="form"
        onSubmit={addTransaction}
      >

        <label>
          Description

          <input
            value={transactionForm.title}
            onChange={(e) =>
              setTransactionForm({
                ...transactionForm,
                title: e.target.value,
              })
            }
            placeholder="e.g. Salary, Food, Rent"
          />
        </label>

        <label>
          Type

          <select
            value={transactionForm.type}
            onChange={(e) =>
              setTransactionForm({
                ...transactionForm,
                type: e.target.value,
              })
            }
          >
            <option value="income">
              Savings / Income
            </option>

            <option value="expense">
              Expense
            </option>
          </select>
        </label>

        <label>
          Amount

          <input
            type="number"
            min="1"
            value={transactionForm.amount}
            onChange={(e) =>
              setTransactionForm({
                ...transactionForm,
                amount: e.target.value,
              })
            }
            placeholder="5000"
          />
        </label>

        <button
          className="primary-button full"
          type="submit"
        >
          <Plus size={17} />
          Add Transaction
        </button>

      </form>
    </div>
  </div>
)}

      {showAdd !== null && (
        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-title">
              <div>
                <p className="section-kicker">
                  UPDATE YOUR GOAL
                </p>

                <h2>Add Savings</h2>
              </div>

              <button
                className="close-button"
                onClick={() => setShowAdd(null)}
              >
                <X size={19} />
              </button>
            </div>

            <form
              className="form"
              onSubmit={addSavings}
            >

              <label>
                Amount to Save
                <input
                  autoFocus
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value)
                  }
                  placeholder="1000"
                />
              </label>

              <button
                className="primary-button full"
                type="submit"
              >
                <PiggyBank size={17} />
                Add Money
              </button>

            </form>
          </div>
        </div>
      )}

    

      

      {/* ADD TRANSACTION MODAL */}

     

    </div>

    
  );
}

export default App;