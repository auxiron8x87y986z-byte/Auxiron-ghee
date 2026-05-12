"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import Script from "next/script";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [availableGateways, setAvailableGateways] = useState<string[]>([]);
  const [formData, setFormData] = useState({ name: session?.user?.name || '', phone: '', address: '', city: 'Jaipur' });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push("/login?callbackUrl=/checkout");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.name && !formData.name) {
      setFormData(prev => ({ ...prev, name: session.user?.name || '' }));
    }
  }, [session, formData.name]);

  useEffect(() => {
    // Fetch enabled payment gateways
    fetch("/api/checkout/gateways")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAvailableGateways(data);
          if (data.length > 0) setPaymentMethod(data[0]);
        }
      })
      .catch(console.error);
  }, []);

  const handleNext = () => {
    if (checkoutStep === 2) {
      if (!formData.name || !formData.phone || !formData.address || !formData.city) {
        alert("Please fill all mandatory fields: Full Name, Phone Number, Address, and City.");
        return;
      }
      if (formData.phone.length < 10) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
      }
    }
    setCheckoutStep(step => step + 1);
  };

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    setProcessing(true);
    
    try {
      // 1. Create Order via our Backend API
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          totalAmount: totalPrice,
          customerInfo: formData,
          paymentMethod
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      // 2. Process based on Gateway
      if (paymentMethod === "Razorpay") {
        const options = {
          key: data.keyId,
          amount: data.amount,
          currency: "INR",
          name: "Auxiron",
          description: "Premium Bilona Ghee Purchase",
          order_id: data.gatewayOrderId,
          handler: async function (response: any) {
            // Verify payment
            const verifyRes = await fetch("/api/checkout/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paymentMethod: "Razorpay",
                orderId: data.orderId,
                ...response
              })
            });
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              clearCart();
              setCheckoutStep(4);
            } else {
              alert("Payment verification failed. Please contact support.");
              setProcessing(false);
            }
          },
          prefill: {
            name: formData.name,
            contact: formData.phone,
          },
          theme: { color: "#D4AF37" },
          modal: {
            ondismiss: function() {
              setProcessing(false);
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any){
          alert("Payment Failed: " + response.error.description);
          setProcessing(false);
        });
        rzp.open();

      } else if (paymentMethod === "Stripe") {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else if (paymentMethod === "Paytm") {
        alert("Paytm gateway initialization pending.");
        setProcessing(false);
      } else {
        alert("Unsupported gateway.");
        setProcessing(false);
      }

    } catch (error: any) {
      console.error(error);
      alert(error.message || "There was an error processing your order. Please try again.");
      setProcessing(false);
    }
  };

  if (checkoutStep === 4) {
    return (
      <div className="container section" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(56, 142, 60, 0.1)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', marginBottom: '2rem' }}>
          ✓
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-secondary-dark)' }}>Payment Successful!</h1>
        <p style={{ color: 'var(--color-text-light)', fontSize: '1.2rem', marginBottom: '2rem' }}>Your order has been placed securely. Thank you for choosing Auxiron.</p>
        <Link href="/" className="btn btn-primary">Return to Home</Link>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="container section" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="container section" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Login Required</h2>
        <p style={{ marginBottom: '2rem', color: 'var(--color-text-light)' }}>Please login to your account to complete your purchase.</p>
        <Link href="/login?callbackUrl=/checkout" className="btn btn-primary">Login Now</Link>
      </div>
    );
  }

  return (
    <div className="checkout-page" style={{ backgroundColor: '#FFFDF7', minHeight: '85vh', paddingBottom: '4rem' }}>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: '2rem 0', marginBottom: '2rem' }}>
        <div className="container">
          <h1 style={{ fontSize: '2rem', color: 'var(--color-secondary-dark)' }}>Secure Checkout</h1>
          <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', color: 'var(--color-text-light)' }}>
            <span style={{ fontWeight: checkoutStep >= 1 ? 600 : 400, color: checkoutStep >= 1 ? 'var(--color-primary-dark)' : 'inherit' }}>1. Cart</span>
            <span>→</span>
            <span style={{ fontWeight: checkoutStep >= 2 ? 600 : 400, color: checkoutStep >= 2 ? 'var(--color-primary-dark)' : 'inherit' }}>2. Details</span>
            <span>→</span>
            <span style={{ fontWeight: checkoutStep >= 3 ? 600 : 400, color: checkoutStep >= 3 ? 'var(--color-primary-dark)' : 'inherit' }}>3. Payment</span>
          </div>
        </div>
      </div>

      <div className="container">
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Your cart is empty</h2>
            <Link href="/product" className="btn btn-primary">Shop Now</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {checkoutStep === 1 && (
                <div style={{ backgroundColor: 'var(--color-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                  <h2 style={{ marginBottom: '2rem' }}>Shopping Cart</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {items.map(item => (
                      <div key={item.volume} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                        <div>
                          <h3 style={{ fontSize: '1.1rem' }}>Shuddh Deshi Bilona Ghee - {item.volume}</h3>
                          <p style={{ color: 'var(--color-text-light)' }}>₹{item.price.toLocaleString('en-IN')}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                            <button onClick={() => updateQuantity(item.volume, item.quantity - 1)} style={{ padding: '0.4rem 0.8rem', border: 'none', background: 'transparent', cursor: 'pointer' }}>-</button>
                            <span style={{ padding: '0 0.5rem' }}>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.volume, item.quantity + 1)} style={{ padding: '0.4rem 0.8rem', border: 'none', background: 'transparent', cursor: 'pointer' }}>+</button>
                          </div>
                          <button onClick={() => removeFromCart(item.volume)} style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer', fontSize: '1.2rem' }}>🗑</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={handleNext} className="btn btn-primary" style={{ width: '100%', marginTop: '2rem', padding: '1rem' }}>
                    Proceed to Details
                  </button>
                </div>
              )}

              {checkoutStep === 2 && (
                <div style={{ backgroundColor: 'var(--color-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                  <h2 style={{ marginBottom: '2rem' }}>Delivery Details</h2>
                  <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Full Name <span style={{ color: 'var(--color-error, red)' }}>*</span></label>
                        <input type="text" className="input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Phone Number <span style={{ color: 'var(--color-error, red)' }}>*</span></label>
                        <input type="tel" className="input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Full Address <span style={{ color: 'var(--color-error, red)' }}>*</span></label>
                      <textarea className="textarea" rows={3} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required></textarea>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>City <span style={{ color: 'var(--color-error, red)' }}>*</span></label>
                      <select className="input" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}>
                        <option value="Jaipur">Jaipur</option>
                        <option value="Jodhpur">Jodhpur</option>
                      </select>
                    </div>
                  </form>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button onClick={() => setCheckoutStep(1)} className="btn btn-outline" style={{ flex: 1 }}>Back</button>
                    <button onClick={handleNext} className="btn btn-primary" style={{ flex: 2 }}>Proceed to Payment</button>
                  </div>
                </div>
              )}

              {checkoutStep === 3 && (
                <div style={{ backgroundColor: 'var(--color-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                  <h2 style={{ marginBottom: '2rem' }}>Payment Method</h2>
                  
                  {availableGateways.length === 0 ? (
                    <div style={{ padding: '1rem', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '8px' }}>
                      No payment gateways are currently enabled. Please contact support.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {availableGateways.map(method => (
                        <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: `1px solid ${paymentMethod === method ? 'var(--color-primary)' : 'var(--color-border)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', backgroundColor: paymentMethod === method ? 'rgba(212, 175, 55, 0.05)' : 'transparent' }}>
                          <input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} style={{ transform: 'scale(1.2)' }} />
                          <span style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {method === 'Razorpay' && 'Razorpay (Cards, UPI, NetBanking)'}
                            {method === 'Stripe' && 'Stripe (International Cards)'}
                            {method === 'Paytm' && 'Paytm Wallet & UPI'}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button onClick={() => setCheckoutStep(2)} className="btn btn-outline" style={{ flex: 1 }} disabled={processing}>Back</button>
                    <button onClick={handlePlaceOrder} className="btn btn-secondary" style={{ flex: 2, padding: '1rem', fontSize: '1.1rem' }} disabled={processing || availableGateways.length === 0}>
                      {processing ? 'Processing...' : `Pay ₹${totalPrice.toLocaleString('en-IN')}`}
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Right Column: Order Summary */}
            <div style={{ flex: '1 1 350px', backgroundColor: 'var(--color-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: '100px' }}>
              <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>Order Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-light)' }}>Subtotal ({totalItems} items)</span>
                  <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-light)' }}>Delivery</span>
                  <span style={{ color: 'var(--color-success)' }}>Free</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                <span style={{ fontWeight: 600, fontSize: '1.2rem' }}>Total</span>
                <span style={{ fontWeight: 700, fontSize: '1.5rem', color: 'var(--color-secondary-dark)' }}>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
