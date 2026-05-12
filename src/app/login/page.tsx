"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      loginType: "customer",
    });

    setLoading(false);

    if (res?.error) {
      setError(res.error === "CredentialsSignin" ? "Invalid email or password" : res.error);
    } else {
      router.push("/account");
      router.refresh();
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#FFFDF7" }}>
      <div style={{ maxWidth: "400px", width: "100%", padding: "2.5rem", backgroundColor: "#FFFFFF", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-lg)" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", color: "var(--color-secondary-dark)", marginBottom: "0.5rem" }}>Customer Login</h1>
          <p style={{ color: "var(--color-text-light)" }}>Welcome back! Please enter your details.</p>
        </div>

        {error && (
          <div style={{ padding: "0.75rem", backgroundColor: "rgba(211, 47, 47, 0.1)", color: "var(--color-error)", borderRadius: "var(--radius-md)", marginBottom: "1.5rem", textAlign: "center", fontSize: "0.9rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500, color: "var(--color-text)" }}>Email <span style={{ color: 'var(--color-error, red)' }}>*</span></label>
            <input
              type="email"
              required
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email address"
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500, color: "var(--color-text)" }}>Password <span style={{ color: 'var(--color-error, red)' }}>*</span></label>
            <input
              type="password"
              required
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "0.5rem" }} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <div style={{ marginBottom: "0.5rem" }}>
            <Link href="/forgot-password" style={{ color: "var(--color-primary-dark)", fontSize: "0.9rem", fontWeight: 600, textDecoration: "none" }}>
              Forgot Password?
            </Link>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <span style={{ color: "var(--color-text-light)", fontSize: "0.9rem" }}>Don't have an account? </span>
            <Link href="/signup" style={{ color: "var(--color-primary-dark)", fontSize: "0.9rem", fontWeight: 600, textDecoration: "none" }}>
              Sign Up
            </Link>
          </div>
          <Link href="/" style={{ color: "var(--color-text-light)", fontSize: "0.9rem", textDecoration: "underline" }}>
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
