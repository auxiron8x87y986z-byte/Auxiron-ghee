"use client";

import { useState, useEffect } from "react";

interface Customer {
  id: number;
  name: string;
  email: string;
  signupDate: string;
  location: string;
  orderCount: number;
  status: string;
  isVerified: boolean;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/admin/customers");
      const data = await res.json();
      if (Array.isArray(data)) {
        setCustomers(data);
      } else {
        console.error("API error:", data.error || "Unknown error");
        setCustomers([]);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = Array.isArray(customers) ? customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div style={{ padding: '2rem', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--color-secondary-dark)', margin: 0 }}>Registered Customers</h1>
          <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem', marginTop: '0.25rem' }}>View and manage your store customers</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Search customers..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              padding: '0.6rem 1rem', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--color-border)',
              width: '250px'
            }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading customers...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)', textAlign: 'left' }}>
                <th style={{ padding: '1rem', color: 'var(--color-text-light)', fontWeight: 600 }}>Customer Name</th>
                <th style={{ padding: '1rem', color: 'var(--color-text-light)', fontWeight: 600 }}>Email</th>
                <th style={{ padding: '1rem', color: 'var(--color-text-light)', fontWeight: 600 }}>Location</th>
                <th style={{ padding: '1rem', color: 'var(--color-text-light)', fontWeight: 600 }}>Signup Date</th>
                <th style={{ padding: '1rem', color: 'var(--color-text-light)', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '1rem', color: 'var(--color-text-light)', fontWeight: 600 }}>Verified</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background-color 0.2s' }} className="hover-row">
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{customer.name}</div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--color-text)' }}>{customer.email}</td>
                  <td style={{ padding: '1rem', color: 'var(--color-text)' }}>{customer.location}</td>
                  <td style={{ padding: '1rem', color: 'var(--color-text)' }}>
                    {(() => {
                      const date = new Date(customer.signupDate);
                      return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
                    })()}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '100px', 
                      fontSize: '0.75rem', 
                      fontWeight: 600,
                      backgroundColor: customer.orderCount > 0 ? '#E8F5E9' : '#FFF3E0',
                      color: customer.orderCount > 0 ? '#2E7D32' : '#E65100'
                    }}>
                      {customer.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ color: customer.isVerified ? '#2E7D32' : '#C62828' }}>
                      {customer.isVerified ? "✓ Yes" : "✗ No"}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .hover-row:hover {
          background-color: #fcfaf7;
        }
      `}</style>
    </div>
  );
}
