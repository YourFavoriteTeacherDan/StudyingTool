import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPublicUserProfile } from "../utils/authHeader.js";
import "./style/user-profile.css";

const FALLBACK_AVATAR = "https://api.dicebear.com/9.x/bottts/svg?seed=EaglerUser";

export default function UserProfile() {
  const { uid } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const result = await fetchPublicUserProfile(uid);
        if (!cancelled) {
          setProfile(result);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || "Failed to load profile");
        }
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [uid]);

  if (error) {
    return <section className="user-profile-page"><div className="user-profile-shell"><p>{error}</p></div></section>;
  }

  if (!profile) {
    return <section className="user-profile-page"><div className="user-profile-shell"><p>Loading profile...</p></div></section>;
  }

  return (
    <section className="user-profile-page">
      <div className="user-profile-shell">
        <div className="public-profile-card">
          <img src={profile.profilePicture || FALLBACK_AVATAR} alt={profile.username || profile.uid} />
          <div>
            <h1>{profile.username || "User"}</h1>
            <p className="profile-uid">UID: {profile.uid}</p>
            {profile.country && <p>Country: {profile.country}</p>}
            <p>{profile.bio || "No bio yet."}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
