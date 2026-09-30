import { useState } from "react";
import { Wallet } from "lucide-react";

function Login({ onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    const storedUser = JSON.parse(
      localStorage.getItem("saveiq_registered_user")
    );

    if (
      !storedUser ||
      storedUser.email !== email ||
      storedUser.password !== password
    ) {
      alert("Invalid email or password.");
      return;
    }

    onLogin({
      name: storedUser.name,
      email: storedUser.email,
    });
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
          <p className="section-kicker">WELCOME BACK</p>
          <h2>Sign in to SaveIQ</h2>
          <p>
            Continue managing your savings missions and financial goals.
          </p>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          <button className="primary-button full" type="submit">
            Sign In
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <button onClick={onRegister}>
            Create account
          </button>
        </p>

      </div>
    </div>
  );
}

export default Login;
