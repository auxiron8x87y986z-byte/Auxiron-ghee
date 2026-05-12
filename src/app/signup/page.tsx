"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const [step, setStep] = useState(1); // 1: Details, 2: OTP
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      }

      setStep(2);
      setLoading(false);
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Verification failed");
        setLoading(false);
        return;
      }

      // Auto login after verification
      const signInRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInRes?.error) {
        setSuccessMessage("Account verified, Please try logging in.");
        setLoading(false);
      } else {
        router.push("/account");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#FFFDF7", padding: "2rem" }}>
      <div style={{ maxWidth: "400px", width: "100%", padding: "2.5rem", backgroundColor: "#FFFFFF", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-lg)" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", color: "var(--color-secondary-dark)", marginBottom: "0.5rem" }}>
            {step === 1 ? "Create Account" : "Verify Email"}
          </h1>
          <p style={{ color: "var(--color-text-light)" }}>
            {step === 1 ? "Join Auxiron to track your orders" : `Enter the OTP sent to ${email}`}
          </p>
        </div>

        {error && (
          <div style={{ padding: "0.75rem", backgroundColor: "rgba(211, 47, 47, 0.1)", color: "var(--color-error)", borderRadius: "var(--radius-md)", marginBottom: "1.5rem", textAlign: "center", fontSize: "0.9rem" }}>
            {error}
          </div>
        )}

        {successMessage && (
          <div style={{ padding: "0.75rem", backgroundColor: "rgba(46, 125, 50, 0.1)", color: "#2E7D32", borderRadius: "var(--radius-md)", marginBottom: "1.5rem", textAlign: "center", fontSize: "0.9rem" }}>
            {successMessage}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500, color: "var(--color-text)" }}>Full Name <span style={{ color: 'var(--color-error, red)' }}>*</span></label>
              <input
                type="text"
                required
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
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
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500, color: "var(--color-text)" }}>Confirm Password <span style={{ color: 'var(--color-error, red)' }}>*</span></label>
              <input
                type="password"
                required
                className="input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "0.5rem" }} disabled={loading}>
              {loading ? "Sending OTP..." : "Sign Up"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500, color: "var(--color-text)" }}>Enter OTP</label>
              <input
                type="text"
                required
                className="input"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                maxLength={6}
                style={{ textAlign: "center", fontSize: "1.5rem", letterSpacing: "5px" }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "0.5rem" }} disabled={loading}>
              {loading ? "Verifying..." : "Verify & Sign In"}
            </button>
            <button type="button" onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "var(--color-text-light)", cursor: "pointer", fontSize: "0.9rem" }}>
              ← Change details
            </button>
          </form>
        )}

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          {step === 1 && (
            <div style={{ marginBottom: "1rem" }}>
              <span style={{ color: "var(--color-text-light)", fontSize: "0.9rem" }}>Already have an account? </span>
              <Link href="/login" style={{ color: "var(--color-primary-dark)", fontSize: "0.9rem", fontWeight: 600, textDecoration: "none" }}>
                Log In
              </Link>
            </div>
          )}
          <Link href="/" style={{ color: "var(--color-text-light)", fontSize: "0.9rem", textDecoration: "underline" }}>
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
