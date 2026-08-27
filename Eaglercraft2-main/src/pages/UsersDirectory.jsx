import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllUsers } from "../utils/authHeader.js";
import "./style/user-profile.css";

const FALLBACK_AVATAR = "https://api.dicebear.com/9.x/bottts/svg?seed=EaglerUsers";

export default function UsersDirectory() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      try {
        const result = await fetchAllUsers();
        if (!cancelled) {
          setUsers(Array.isArray(result) ? result : []);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || "Failed to load users");
        }
      }
    }

    loadUsers();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="user-profile-page">
      <div className="user-profile-shell">
        <h1>Eaglercraft2 Users</h1>
        <p>View all registered players and their online/offline status.</p>

        {error && <p className="user-profile-status">{error}</p>}

        <div className="users-grid">
          {users.map((user) => (
            <Link key={user.uid} to={`/users/${user.uid}`} className="user-directory-card">
              <img src={user.profilePicture || FALLBACK_AVATAR} alt={user.username || user.uid} />
              <div>
                <p className="user-directory-name">{user.username || "User"}</p>
                <p className={`user-directory-tag ${user.isOnline ? "online" : "offline"}`}>
                  {user.isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </Link>
          ))}
          {users.length === 0 && !error && <p>No users found yet.</p>}
        </div>
      </div>
    </section>
  );
}
