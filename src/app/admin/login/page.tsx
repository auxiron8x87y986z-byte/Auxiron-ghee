"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  console.log("Rendering AdminLoginPage!");
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
      loginType: "admin",
    });

    setLoading(false);

    if (res?.error) {
      setError(res.error === "CredentialsSignin" ? "Invalid email or password" : res.error);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f8f9fa" }}>
      <div style={{ maxWidth: "400px", width: "100%", padding: "2.5rem", backgroundColor: "#FFFFFF", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-lg)", border: "1px solid var(--color-border)" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔐</div>
          <h1 style={{ fontSize: "1.75rem", color: "var(--color-secondary-dark)", marginBottom: "0.5rem" }}>Admin Portal</h1>
          <p style={{ color: "var(--color-text-light)" }}>Secure access for administrators</p>
        </div>

        {error && (
          <div style={{ padding: "0.75rem", backgroundColor: "rgba(211, 47, 47, 0.1)", color: "var(--color-error)", borderRadius: "var(--radius-md)", marginBottom: "1.5rem", textAlign: "center", fontSize: "0.9rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "var(--color-text)" }}>Admin Email</label>
            <input
              type="email"
              required
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@auxiron.com"
              style={{ borderColor: "var(--color-secondary)" }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "var(--color-text)" }}>Password</label>
            <input
              type="password"
              required
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ borderColor: "var(--color-secondary)" }}
            />
          </div>
          <button type="submit" className="btn" style={{ width: "100%", marginTop: "0.5rem", backgroundColor: "var(--color-secondary-dark)", color: "white", padding: "0.8rem", fontWeight: 600 }} disabled={loading}>
            {loading ? "Authenticating..." : "Access Dashboard"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link href="/" style={{ color: "var(--color-text-light)", fontSize: "0.9rem", textDecoration: "none" }}>
            ← Return to Website
          </Link>
        </div>
      </div>
    </div>
  );
}
