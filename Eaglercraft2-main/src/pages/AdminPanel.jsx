import { useEffect, useState } from "react";
import "./style/admin.css";

async function api(path, options = {}) {
  const res = await fetch(`/api/admin${path}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || "Request failed");
  }
  return data;
}

export default function AdminPanel() {
  const [password, setPassword] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [status, setStatus] = useState("");
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [mods, setMods] = useState([]);
  const [logs, setLogs] = useState([]);

  async function loadAll() {
    const [u, p, m, l] = await Promise.all([
      api("/users"),
      api("/posts"),
      api("/mods"),
      api("/logs")
    ]);
    setUsers(Array.isArray(u.result) ? u.result : []);
    setPosts(Array.isArray(p.result) ? p.result : []);
    setMods(Array.isArray(m.result) ? m.result : []);
    setLogs(Array.isArray(l.result) ? l.result : []);
  }

  useEffect(() => {
    api("/status")
      .then(() => {
        setIsAuthed(true);
        return loadAll();
      })
      .catch(() => setIsAuthed(false));
  }, []);

  async function handleLogin(event) {
    event.preventDefault();
    setStatus("");
    try {
      await api("/login", { method: "POST", body: JSON.stringify({ password }) });
      setPassword("");
      setIsAuthed(true);
      await loadAll();
    } catch (error) {
      setStatus(error.message || "Login failed");
    }
  }

  async function handleLogout() {
    await api("/logout", { method: "POST" });
    setIsAuthed(false);
    setUsers([]);
    setPosts([]);
    setMods([]);
    setLogs([]);
  }

  async function terminateUser(uid) {
    if (!window.confirm("Terminate this user account?")) return;
    await api(`/users/${encodeURIComponent(uid)}`, { method: "DELETE" });
    await loadAll();
  }

  async function deletePost(id) {
    if (!window.confirm("Delete this post?")) return;
    await api(`/posts/${encodeURIComponent(id)}`, { method: "DELETE" });
    await loadAll();
  }

  async function deleteMod(id) {
    if (!window.confirm("Delete this mod?")) return;
    await api(`/mods/${encodeURIComponent(id)}`, { method: "DELETE" });
    await loadAll();
  }

  async function clearLog(id) {
    if (!window.confirm("Delete this log entry?")) return;
    await api(`/logs/${encodeURIComponent(id)}`, { method: "DELETE" });
    await loadAll();
  }

  if (!isAuthed) {
    return (
      <section className="admin-page">
        <div className="admin-shell">
          <h1>Admin Panel</h1>
          <p>Sign in with ADMIN_PASS.</p>
          <form onSubmit={handleLogin} className="admin-login-form">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Admin password"
              required
            />
            <button type="submit">Login</button>
          </form>
          {status && <p className="admin-status">{status}</p>}
        </div>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <div className="admin-shell">
        <div className="admin-head-row">
          <h1>Admin Panel</h1>
          <button type="button" onClick={handleLogout}>Logout</button>
        </div>

        <div className="admin-grid">
          <section className="admin-card">
            <h2>Users ({users.length})</h2>
            {users.map((user) => (
              <div key={user.uid} className="admin-item">
                <div>
                  <strong>{user.username || user.uid}</strong>
                  <p>{user.email || "No email"}</p>
                </div>
                <button type="button" className="danger" onClick={() => terminateUser(user.uid)}>Terminate</button>
              </div>
            ))}
          </section>

          <section className="admin-card">
            <h2>Posts ({posts.length})</h2>
            {posts.map((post) => (
              <div key={post.id} className="admin-item">
                <div>
                  <strong>{post.title || "Untitled"}</strong>
                  <p>{post.authorName || "Unknown"}</p>
                </div>
                <button type="button" className="danger" onClick={() => deletePost(post.id)}>Delete</button>
              </div>
            ))}
          </section>

          <section className="admin-card">
            <h2>Mods ({mods.length})</h2>
            {mods.map((mod) => (
              <div key={mod.id} className="admin-item">
                <div>
                  <strong>{mod.title || "Untitled Mod"}</strong>
                  <p>{mod.authorName || "Unknown"}</p>
                </div>
                <button type="button" className="danger" onClick={() => deleteMod(mod.id)}>Delete</button>
              </div>
            ))}
          </section>

          <section className="admin-card">
            <h2>Log Explorer ({logs.length})</h2>
            {logs.map((entry) => (
              <div key={entry.id} className="admin-item">
                <div>
                  <strong>{entry.type || "event"}</strong>
                  <p>{entry.message || "No details"}</p>
                  <p>{entry.createdAt ? new Date(entry.createdAt).toLocaleString() : ""}</p>
                </div>
                <button type="button" className="danger" onClick={() => clearLog(entry.id)}>Delete</button>
              </div>
            ))}
          </section>
        </div>
      </div>
    </section>
  );
}
