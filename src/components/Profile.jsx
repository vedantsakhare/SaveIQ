import  { useState } from "react";

export default function Profile({ user = {}, onSave, onNavigate }) {
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    monthlyIncome: user.monthlyIncome || "",
    monthlyExpenses: user.monthlyExpenses || "",
    savingsTarget: user.savingsTarget || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave?.({
      ...form,
      monthlyIncome: Number(form.monthlyIncome) || 0,
      monthlyExpenses: Number(form.monthlyExpenses) || 0,
      savingsTarget: Number(form.savingsTarget) || 0,
    });
  };

  return (
    <div className="page profile-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">YOUR PROFILE</p>
          <h1>Profile</h1>
          <p>Keep your financial information up to date.</p>
        </div>

        <button onClick={() => onNavigate?.("home")}>
          Back to Home
        </button>
      </div>

      <form className="profile-card" onSubmit={handleSubmit}>
        <div className="profile-avatar">
          {form.name
            ? form.name.charAt(0).toUpperCase()
            : "S"}
        </div>

        <div className="form-grid">
          <label>
            <span>Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
            />
          </label>

          <label>
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </label>

          <label>
            <span>Monthly Income</span>
            <input
              type="number"
              min="0"
              name="monthlyIncome"
              value={form.monthlyIncome}
              onChange={handleChange}
              placeholder="50000"
            />
          </label>

          <label>
            <span>Monthly Expenses</span>
            <input
              type="number"
              min="0"
              name="monthlyExpenses"
              value={form.monthlyExpenses}
              onChange={handleChange}
              placeholder="30000"
            />
          </label>

          <label className="full-width">
            <span>Savings Target</span>
            <input
              type="number"
              min="0"
              name="savingsTarget"
              value={form.savingsTarget}
              onChange={handleChange}
              placeholder="10000"
            />
          </label>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => onNavigate?.("home")}
          >
            Cancel
          </button>

          <button type="submit" className="primary-button">
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
}
