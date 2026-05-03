"use client";

import { useState } from "react";
import { updateOrderStatus } from "./actions";

type Order = {
  id: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  address: string;
  city: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string | null;
  status: string;
  items: any;
  createdAt: Date;
};

export default function OrderManager({ orders }: { orders: Order[] }) {
  const handleStatusChange = async (orderId: number, newStatus: string) => {
    await updateOrderStatus(orderId, newStatus);
    window.location.reload();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--color-secondary-dark)' }}>Orders Management</h1>
      </div>
      
      <div style={{ backgroundColor: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-light)' }}>
              <th style={{ padding: '1rem 0' }}>Order ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Address</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '2rem 0', textAlign: 'center' }}>No orders found.</td>
              </tr>
            ) : orders.map((o) => (
              <tr key={o.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '1rem 0', fontWeight: 500 }}>#{o.id}</td>
                <td>{new Date(o.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                <td>
                  <div>{o.customerName}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-light)' }}>{o.customerPhone}</div>
                </td>
                <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {o.address}, {o.city}
                </td>
                <td>₹{o.totalAmount.toLocaleString('en-IN')}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{o.paymentMethod}</div>
                  <div style={{ fontSize: '0.8rem', color: o.paymentStatus === 'PAID' ? 'green' : 'red' }}>{o.paymentStatus}</div>
                  {o.transactionId && <div style={{ fontSize: '0.75rem', color: '#888' }}>{o.transactionId}</div>}
                </td>
                <td>
                  <span style={{ 
                    padding: '0.2rem 0.5rem', 
                    borderRadius: 'var(--radius-full)', 
                    backgroundColor: o.status === 'DELIVERED' ? 'rgba(56, 142, 60, 0.1)' : o.status === 'SHIPPED' ? 'rgba(33, 150, 243, 0.1)' : 'rgba(212, 175, 55, 0.1)', 
                    color: o.status === 'DELIVERED' ? 'var(--color-success)' : o.status === 'SHIPPED' ? '#1976D2' : 'var(--color-primary-dark)', 
                    fontSize: '0.85rem' 
                  }}>
                    {o.status}
                  </span>
                </td>
                <td>
                  <select 
                    value={o.status} 
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    className="input"
                    style={{ padding: '0.25rem 0.5rem', minWidth: '120px' }}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
