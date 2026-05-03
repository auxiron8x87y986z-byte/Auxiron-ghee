"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

type User = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
};

export default function UsersManager() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) setUsers(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({ name: user.name, email: user.email, password: "" });
    } else {
      setEditingUser(null);
      setFormData({ name: "", email: "", password: "" });
    }
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    try {
      const url = editingUser ? `/api/admin/users/${editingUser.id}` : "/api/admin/users";
      const method = editingUser ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (res.ok) {
        setIsModalOpen(false);
        fetchUsers();
      } else {
        setFormError(data.error || "An error occurred");
      }
    } catch (error) {
      setFormError("Failed to save user");
    } finally {
      setFormLoading(false);
    }
  };

  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    console.log("Delete button clicked for user ID:", id);
    setUserToDelete(id);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    console.log("Confirming delete for user ID:", userToDelete);
    
    try {
      console.log("API Called: DELETE /api/admin/users/" + userToDelete);
      const res = await fetch(`/api/admin/users/${userToDelete}`, { method: "DELETE" });
      const data = await res.json();
      console.log("Response received:", res.status, data);

      if (res.ok) {
        setUsers(users.filter(u => u.id !== userToDelete));
        setUserToDelete(null);
      } else {
        alert(data.error || "Failed to delete user");
        setUserToDelete(null);
      }
    } catch (error) {
      console.error("API Error during delete:", error);
      alert("An error occurred");
      setUserToDelete(null);
    }
  };

  if (loading) return <div>Loading users...</div>;

  const currentUserId = session?.user ? parseInt((session.user as any).id) : -1;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--color-secondary-dark)' }}>Admin Users</h1>
        <button onClick={() => openModal()} className="btn btn-primary">
          + Add New Admin
        </button>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #eee', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '1rem', color: '#666', fontWeight: 600 }}>Name</th>
              <th style={{ padding: '1rem', color: '#666', fontWeight: 600 }}>Email</th>
              <th style={{ padding: '1rem', color: '#666', fontWeight: 600 }}>Role</th>
              <th style={{ padding: '1rem', color: '#666', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '1rem', fontWeight: 500 }}>
                  {user.name}
                  {user.id === currentUserId && <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '0.1rem 0.4rem', borderRadius: '10px' }}>You</span>}
                </td>
                <td style={{ padding: '1rem', color: '#555' }}>{user.email}</td>
                <td style={{ padding: '1rem' }}><span style={{ backgroundColor: '#fff8e1', color: '#f57f17', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 500 }}>Super Admin</span></td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button type="button" onClick={() => openModal(user)} style={{ border: 'none', background: 'none', color: '#1976d2', cursor: 'pointer', marginRight: '1rem', fontWeight: 500 }}>Edit</button>
                  <button type="button" onClick={() => handleDelete(user.id)} style={{ border: 'none', background: 'none', color: '#d32f2f', cursor: 'pointer', fontWeight: 500 }}>Delete</button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {userToDelete !== null && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#d32f2f' }}>Confirm Deletion</h2>
            <p style={{ marginBottom: '2rem', color: '#555' }}>Are you sure you want to delete this user? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setUserToDelete(null)} style={{ flex: 1, padding: '0.8rem', background: '#f5f5f5', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
              <button onClick={confirmDelete} style={{ flex: 1, padding: '0.8rem', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>Yes, Delete User</button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--color-secondary-dark)' }}>
              {editingUser ? "Edit User" : "Add New User"}
            </h2>

            {formError && (
              <div style={{ padding: '0.8rem', marginBottom: '1rem', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '8px', fontSize: '0.9rem' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', color: '#555', fontWeight: 500 }}>Full Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '0.8rem', border: '1px solid #ccc', borderRadius: '8px' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', color: '#555', fontWeight: 500 }}>Email Address</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '0.8rem', border: '1px solid #ccc', borderRadius: '8px' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', color: '#555', fontWeight: 500 }}>
                  {editingUser ? "New Password (leave blank to keep current)" : "Password"}
                </label>
                <input required={!editingUser} type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={{ width: '100%', padding: '0.8rem', border: '1px solid #ccc', borderRadius: '8px' }} />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '0.8rem', background: '#f5f5f5', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                <button type="submit" disabled={formLoading} className="btn btn-primary" style={{ flex: 1, padding: '0.8rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>
                  {formLoading ? "Saving..." : "Save User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
