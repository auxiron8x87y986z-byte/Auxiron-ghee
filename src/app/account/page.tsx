import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { dbFetch, prisma } from "@/lib/prisma";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const role = (session as any)?.user?.role;
  if (role === "admin") {
    redirect("/admin");
  }

  const userId = parseInt((session as any)?.user?.id);

  // Fetch orders for this customer
  const orders = await dbFetch(
    () => prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    }),
    []
  );

  return (
    <div style={{ backgroundColor: "#FFFDF7", minHeight: "100vh", padding: "4rem 2rem" }}>
      <div className="container" style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
          <div>
            <h1 style={{ fontSize: "2.5rem", color: "var(--color-secondary-dark)", marginBottom: "0.5rem" }}>My Account</h1>
            <p style={{ color: "var(--color-text-light)" }}>Welcome back, {(session as any)?.user?.name}</p>
          </div>
          <div style={{ width: '150px' }}>
             <LogoutButton />
          </div>
        </div>

        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", padding: "2rem" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "2rem", borderBottom: "1px solid var(--color-border)", paddingBottom: "1rem" }}>My Orders</h2>
          
          {orders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--color-text-light)" }}>
              <p style={{ marginBottom: "1.5rem" }}>You haven't placed any orders yet.</p>
              <Link href="/" className="btn btn-primary">
                Browse Store
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {orders.map((order: any) => (
                <div key={order.id} style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                  <div style={{ backgroundColor: "#F9FAFB", padding: "1.5rem", display: "flex", flexWrap: "wrap", gap: "2rem", borderBottom: "1px solid var(--color-border)", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: "0.85rem", color: "var(--color-text-light)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.2rem" }}>Order Placed</div>
                      <div style={{ fontWeight: 500 }}>
                        {(() => {
                          const date = new Date(order.createdAt);
                          return isNaN(date.getTime()) 
                            ? "Date N/A" 
                            : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
                        })()}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.85rem", color: "var(--color-text-light)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.2rem" }}>Total</div>
                      <div style={{ fontWeight: 500 }}>₹{order.totalAmount.toLocaleString('en-IN')}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.85rem", color: "var(--color-text-light)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.2rem" }}>Order #</div>
                      <div style={{ fontWeight: 500 }}>ORD-{order.id.toString().padStart(4, '0')}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                      <span style={{ 
                        display: "inline-block",
                        padding: "0.3rem 0.8rem", 
                        borderRadius: "20px", 
                        backgroundColor: 
                          order.status === "DELIVERED" ? "#e8f5e9" : 
                          order.status === "SHIPPED" ? "#e3f2fd" : 
                          order.status === "PROCESSING" ? "#fff8e1" : 
                          order.status === "CANCELLED" ? "#ffebee" : "#f5f5f5",
                        color: 
                          order.status === "DELIVERED" ? "#2e7d32" : 
                          order.status === "SHIPPED" ? "#1565c0" : 
                          order.status === "PROCESSING" ? "#f57f17" : 
                          order.status === "CANCELLED" ? "#c62828" : "#616161",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ padding: "1.5rem" }}>
                    <h4 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Items</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      {(() => {
                        let parsedItems = [];
                        try {
                          if (order.items) parsedItems = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                        } catch (e) {}
                        
                        return parsedItems.map((item: any, idx: number) => (
                          <div key={idx} style={{ display: "flex", gap: "1.5rem", alignItems: "center", borderBottom: "1px solid #f0f0f0", paddingBottom: "1rem" }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 500, fontSize: "1.1rem", marginBottom: "0.3rem" }}>{item.productName || item.name || "Bilona Ghee"} ({item.volume})</div>
                              <div style={{ color: "var(--color-text-light)" }}>Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</div>
                            </div>
                            <div style={{ fontWeight: 600, fontSize: "1.1rem" }}>
                              ₹{(item.quantity * item.price).toLocaleString('en-IN')}
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                    
                    <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem" }}>
                      <h4 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Shipping Details</h4>
                      <p style={{ color: "var(--color-text-light)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                        {order.address}, {order.city}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
