import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearCachedProfile, deleteAuthAccount, saveCachedProfile, updateAuthProfile } from "../utils/authHeader.js";
import "./style/user-profile.css";

export default function UserSettings({ profile, onProfileUpdated }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState(profile?.username || "");
  const [profilePicture, setProfilePicture] = useState(profile?.profilePicture || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [country, setCountry] = useState(profile?.country || "");
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave(event) {
    event.preventDefault();
    setIsSaving(true);
    setStatus("");

    try {
      const updated = await updateAuthProfile({ username, profilePicture, bio, country });
      if (updated) {
        saveCachedProfile(updated);
        onProfileUpdated?.(updated);
        setStatus("Profile updated successfully.");
      }
    } catch (error) {
      setStatus(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm("Delete your account permanently? This cannot be undone.");
    if (!confirmed) return;

    try {
      await deleteAuthAccount();
      clearCachedProfile();
      window.location.href = "/";
    } catch (error) {
      setStatus(error.message || "Failed to delete account");
    }
  }

  return (
    <section className="user-profile-page">
      <div className="user-profile-shell">
        <h1>Account Settings</h1>
        <p>Edit your public profile details for posts and comments.</p>

        <form className="user-profile-form" onSubmit={handleSave}>
          <label>
            Username
            <input value={username} onChange={(event) => setUsername(event.target.value)} maxLength={40} />
          </label>

          <label>
            Profile Picture URL
            <input value={profilePicture} onChange={(event) => setProfilePicture(event.target.value)} />
          </label>

          <label>
            Country
            <input value={country} onChange={(event) => setCountry(event.target.value)} maxLength={80} />
          </label>

          <label>
            Bio
            <textarea value={bio} onChange={(event) => setBio(event.target.value)} rows={5} maxLength={280} />
          </label>

          {status && <p className="user-profile-status">{status}</p>}

          <div className="user-profile-actions">
            <button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save Profile"}</button>
            <button type="button" className="ghost" onClick={() => navigate(`/users/${profile?.uid}`)}>View Public Profile</button>
          </div>
        </form>

        <div className="danger-zone">
          <h2>Danger Zone</h2>
          <button type="button" onClick={handleDeleteAccount}>Delete Account</button>
        </div>
      </div>
    </section>
  );
}
