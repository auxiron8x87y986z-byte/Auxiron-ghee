import { dbFetch, prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // Fetch real data from database
  const totalOrders = await dbFetch(() => prisma.order.count(), 0);
  const productsCount = await dbFetch(() => prisma.product.count(), 0);
  const recentOrders = await dbFetch(
    () => prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' }
    }),
    []
  );

  // Calculate total revenue
  const revenueResult = await dbFetch(
    () => prisma.order.aggregate({
      _sum: {
        totalAmount: true
      },
      where: {
        paymentStatus: 'PAID'
      }
    }),
    { _sum: { totalAmount: 0 } }
  );

  const totalRevenue = revenueResult._sum.totalAmount || 0;

  const stats = [
    { title: "Total Revenue (Paid)", value: `₹${totalRevenue.toLocaleString('en-IN')}`, change: "Real-time" },
    { title: "Total Orders", value: totalOrders.toString(), change: "Lifetime" },
    { title: "Active Products", value: productsCount.toString(), change: "Database" },
    { title: "Site Visitors", value: "Live", change: "Analytics" }
  ];

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--color-secondary-dark)' }}>Dashboard Overview</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ backgroundColor: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ color: 'var(--color-text-light)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 500 }}>{stat.title}</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-text)' }}>{stat.value}</span>
              <span style={{ color: 'var(--color-success)', fontSize: '0.9rem', fontWeight: 600 }}>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Recent Orders</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-light)' }}>
              <th style={{ padding: '1rem 0' }}>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map(order => (
              <tr key={order.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '1rem 0', fontWeight: 500 }}>#ORD-{order.id.toString().padStart(4, '0')}</td>
                <td>
                  <div>{order.customerName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>{order.customerPhone}</div>
                </td>
                <td>₹{order.totalAmount.toLocaleString('en-IN')}</td>
                <td>
                  <span style={{ 
                    padding: '0.2rem 0.5rem', 
                    borderRadius: 'var(--radius-full)', 
                    backgroundColor: order.paymentStatus === 'PAID' ? 'rgba(56, 142, 60, 0.1)' : 'rgba(212, 175, 55, 0.1)', 
                    color: order.paymentStatus === 'PAID' ? 'var(--color-success)' : 'var(--color-primary-dark)', 
                    fontSize: '0.85rem' 
                  }}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td>
                  <span style={{ 
                    padding: '0.2rem 0.5rem', 
                    borderRadius: 'var(--radius-full)', 
                    backgroundColor: 'rgba(25, 118, 210, 0.1)', 
                    color: '#1976d2', 
                    fontSize: '0.85rem' 
                  }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                  {(() => {
                    const date = new Date(order.createdAt);
                    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
                  })()}
                </td>
              </tr>
            ))}
            {recentOrders.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--color-text-light)' }}>
                  No orders have been placed yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
