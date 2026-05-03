"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id");
  const [status, setStatus] = useState("verifying");
  const { clearCart } = useCart();

  useEffect(() => {
    if (sessionId && orderId) {
      verifyPayment();
    } else {
      setStatus("error");
    }
  }, [sessionId, orderId]);

  const verifyPayment = async () => {
    try {
      const res = await fetch("/api/checkout/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod: "Stripe",
          orderId,
          sessionId
        })
      });

      const data = await res.json();
      if (data.success) {
        setStatus("success");
        clearCart();
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <div className="container section" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      {status === "verifying" && (
        <>
          <div style={{ width: '50px', height: '50px', border: '4px solid #eee', borderTop: '4px solid var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '2rem' }} />
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          `}} />
          <h2 style={{ color: 'var(--color-secondary-dark)' }}>Verifying your payment...</h2>
          <p style={{ color: 'var(--color-text-light)' }}>Please do not close this window.</p>
        </>
      )}

      {status === "success" && (
        <>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(56, 142, 60, 0.1)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', marginBottom: '2rem' }}>
            ✓
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-secondary-dark)' }}>Payment Successful!</h1>
          <p style={{ color: 'var(--color-text-light)', fontSize: '1.2rem', marginBottom: '2rem' }}>Your order #{orderId} has been confirmed securely via Stripe.</p>
          <Link href="/" className="btn btn-primary">Return to Home</Link>
        </>
      )}

      {status === "error" && (
        <>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(211, 47, 47, 0.1)', color: 'var(--color-error)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', marginBottom: '2rem' }}>
            ✗
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-error)' }}>Payment Verification Failed</h1>
          <p style={{ color: 'var(--color-text-light)', fontSize: '1.2rem', marginBottom: '2rem' }}>We could not verify your payment. If money was deducted, please contact support.</p>
          <Link href="/checkout" className="btn btn-outline">Return to Checkout</Link>
        </>
      )}
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
