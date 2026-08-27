import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style/home.css";

const navItems = [
  { key: "dashboard", label: "Dashboard" },
  { key: "store", label: "Eaglercraft2 Game Store" },
  { key: "forums", label: "EaglerForums" },
  { key: "elge", label: "ELGE" },
  { key: "hopper", label: "GameHopper" },
  { key: "moddit", label: "Moddit" },
  { key: "clipper", label: "GameClipper" },
  { key: "profile", label: "Profile Settings" }
];

const spotlightCards = [
  {
    title: "Featured Store Launch",
    text: "Discover trending games from Eaglercraft2 Game Store with one-click browser sessions."
  },
  {
    title: "Weekly Forum Threads",
    text: "Follow EaglerForums updates, patch notes, and community challenges in one place."
  },
  {
    title: "Creator Toolkit",
    text: "Use Moddit and GameClipper together to build mods and share your best gameplay moments."
  }
];

function DashboardPage() {
  return (
    <div className="page-block">
      <section className="hero-banner">
        <div className="hero-content">
          <h1>Eaglercraft2 Platform</h1>
          <p className="hero-sub">You Play , We Pay</p>
          <p className="hero-desc">
            A complete web gaming platform connecting gameplay, forums, docs,
            mods, and clips across one unified experience.
          </p>
          <div className="hero-actions">
            <button type="button" onClick={() => navigate("/play")}>Start Session</button>
            <button className="ghost">Explore Services</button>
          </div>
        </div>
      </section>

      <section className="stat-grid">
        <article><span>Services</span><strong>6 Core Services</strong></article>
        <article><span>Platform Type</span><strong>Browser Gaming</strong></article>
        <article><span>Runtime</span><strong>ELGE</strong></article>
        <article><span>Community</span><strong>EaglerForums</strong></article>
      </section>

      <section className="card-grid">
        {spotlightCards.map((card) => (
          <article key={card.title}>
            <h3>{card.title}</h3>
            <p>{card.text}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

function ServicePage({ title, summary, bullets }) {
  return (
    <div className="page-block">
      <h2>{title}</h2>
      <p className="page-summary">{summary}</p>
      <div className="list-card">
        <h3>What you can do here</h3>
        <ul>
          {bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Home({ identityState, profile, onSignOut }) {
  const [activePage, setActivePage] = useState("dashboard");
  const navigate = useNavigate();

  const pageContent = useMemo(() => {
    switch (activePage) {
      case "store":
        return (
          <ServicePage
            title="Eaglercraft2 Game Store"
            summary="Browse, launch, and track games across your Eaglercraft2 catalog."
            bullets={[
              "Featured games and new releases",
              "Genre and popularity filtering",
              "Direct browser launch flow"
            ]}
          />
        );
      case "elge":
        return (
          <ServicePage
            title="ELGE"
            summary="Low-End Game Engine runtime powering smooth browser-first gameplay."
            bullets={[
              "Optimized low-end performance",
              "Runtime boot diagnostics",
              "Modular startup and compatibility checks"
            ]}
          />
        );
      case "hopper":
        return (
          <ServicePage
            title="GameHopper"
            summary="Your docs, guides, articles, and game knowledge center."
            bullets={[
              "Official documentation and tutorials",
              "Strategy and build articles",
              "Community learning resources"
            ]}
          />
        );
      case "moddit":
        return (
          <ServicePage
            title="Moddit"
            summary="Central modding library for all Eaglercraft2 Game Store titles."
            bullets={[
              "Browse and publish mods",
              "Version compatibility labels",
              "Creator pages and mod packs"
            ]}
          />
        );
      case "clipper":
        return (
          <ServicePage
            title="GameClipper"
            summary="Capture and share your best gameplay moments instantly."
            bullets={[
              "Record in-browser gameplay clips",
              "Create short highlight reels",
              "Publish clips to community feeds"
            ]}
          />
        );
      case "profile":
        return (
          <div className="page-block">
            <h2>Player Profile</h2>
            <p className="page-summary">Your profile and service access details.</p>
            <div className="list-card">
              <h3>Identity Snapshot</h3>
              <ul>
                <li><strong>Status:</strong> {identityState}</li>
                <li><strong>UID:</strong> {profile?.uid || "Unknown"}</li>
                <li><strong>Email:</strong> {profile?.email || "Unknown"}</li>
                <li><strong>Username:</strong> {profile?.username || "Unknown"}</li>
                <li><strong>Country:</strong> {profile?.country || "Unknown"}</li>
              </ul>
            </div>
          </div>
        );
      default:
        return <DashboardPage />;
    }
  }, [activePage, identityState, profile]);

  const handleNavClick = (item) => {
    if (item.key === 'forums') {
      navigate('/forums');
    } else if (item.key === "profile") {
      navigate("/settings");
    } else if (item.key === "moddit") {
      navigate("/moddit");
    } else {
      setActivePage(item.key);
    }
  };

  return (
    <div className="home">
      <div className="layout">
        <aside className="sidebar">
          <h3>Platform</h3>
          {navItems.map((item) => (
            <button
              key={item.key}
              className={item.key === activePage ? "active" : ""}
              onClick={() => handleNavClick(item)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </aside>

        <main className="content">{pageContent}</main>

        <aside className="identity-card">
          <h3>Account Status</h3>
          <p>{identityState}</p>
          {profile && (
            <div className="mini-profile">
              {profile.profilePicture && <img src={profile.profilePicture} alt={profile.username || profile.uid} />}
              <div>
                <p><strong>{profile.username || "Unknown user"}</strong></p>
                <p>{profile.email || "Unknown email"}</p>
                <p>UID: {profile.uid}</p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
