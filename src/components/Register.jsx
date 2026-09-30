import { useState } from "react";
import { Wallet } from "lucide-react";

function Register({ onRegister, onLogin }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      alert("Please complete all fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

  const user = {
  name: form.name,
  email: form.email,
  password: form.password,

  // New users start with no financial data
  monthlyIncome: 0,
  monthlyExpenses: 0,
  savingsTarget: 0,
};



    localStorage.setItem(
      "saveiq_registered_user",
      JSON.stringify(user)
    );

onRegister(user);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">
          <div className="logo-mark">
            <Wallet size={22} />
          </div>

          <div>
            <h1>SaveIQ</h1>
            <p>Smart Savings OS</p>
          </div>
        </div>

        <div className="auth-heading">
          <p className="section-kicker">GET STARTED</p>
          <h2>Create your account</h2>
          <p>
            Build your savings system and start tracking your goals.
          </p>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <label>
            Full Name
            <input
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              placeholder="Your name"
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              placeholder="you@example.com"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              placeholder="Create a password"
            />
          </label>

          <label>
            Confirm Password
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({
                  ...form,
                  confirmPassword: e.target.value,
                })
              }
              placeholder="Confirm password"
            />
          </label>

          <button className="primary-button full" type="submit">
            Create Account
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <button onClick={onLogin}>
            Sign in
          </button>
        </p>

      </div>
    </div>
  );
}

export default Register;
