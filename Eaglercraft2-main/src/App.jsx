import { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Navbar from "./Navbar.jsx";
import {
  clearCachedProfile,
  fetchAuthSessionUser,
  loadCachedProfile,
  logoutAuthSession,
  redirectToProviderLogin,
  saveCachedProfile
} from "./utils/authHeader.js";

const Forums = lazy(() => import("./pages/ForumsV2.jsx"));
const UserSettings = lazy(() => import("./pages/UserSettings.jsx"));
const UserProfile = lazy(() => import("./pages/UserProfile.jsx"));
const UsersDirectory = lazy(() => import("./pages/UsersDirectory.jsx"));
const Docs = lazy(() => import("./pages/Docs.jsx"));
const Moddit = lazy(() => import("./pages/Moddit.jsx"));
const Play = lazy(() => import("./pages/Play.jsx"));
const AdminPanel = lazy(() => import("./pages/AdminPanel.jsx"));
const Editor3D = lazy(() => import("./pages/Editor3D.jsx"));
const Store = lazy(() => import("./pages/Store.jsx"));

const AUTH_PENDING_TEXT = "Checking account session...";

export default function App() {
  const initialProfile = loadCachedProfile();
  const [profile, setProfile] = useState(initialProfile);
  const [identityState, setIdentityState] = useState(AUTH_PENDING_TEXT);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const error = currentUrl.searchParams.get("auth_error");
    if (!error) return;

    setAuthError(error);
    currentUrl.searchParams.delete("auth_error");
    window.history.replaceState({}, "", currentUrl.toString());
  }, []);

  useEffect(() => {
    const elgeHub = document.getElementById("elge-hub");
    if (elgeHub) {
      elgeHub.remove();
    }
  }, [isAuthChecked, profile]);

  useEffect(() => {
    let cancelled = false;

    async function bootstrapAuth() {
      try {
        const user = await fetchAuthSessionUser();
        if (cancelled) return;

        if (!user?.uid) {
          setProfile(null);
          setIdentityState("Not signed in.");
          clearCachedProfile();
          setIsAuthChecked(true);
          return;
        }

        saveCachedProfile(user);
        setProfile(user);
        setIdentityState(`Signed in as ${user.username || user.email || user.uid}`);
      } catch {
        if (cancelled) return;
        setProfile(null);
        setIdentityState("Not signed in.");
        clearCachedProfile();
      } finally {
        if (!cancelled) {
          setIsAuthChecked(true);
        }
      }
    }

    bootstrapAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSignOut() {
    try {
      await logoutAuthSession();
    } finally {
      clearCachedProfile();
      setProfile(null);
      setIdentityState("Not signed in.");
      setIsAuthChecked(true);
    }
  }

  function handleProfileUpdated(nextProfile) {
    setProfile(nextProfile);
    setIdentityState(`Signed in as ${nextProfile.username || nextProfile.email || nextProfile.uid}`);
  }

  const appRoutes = (
    <Suspense fallback={<div className="content-layout">Loading page…</div>}>
      <Routes>
        <Route path="/" element={<Home identityState={identityState} profile={profile} onSignOut={handleSignOut} />} />
        <Route path="/forums" element={<Forums profile={profile} />} />
        <Route path="/settings" element={<UserSettings profile={profile} onProfileUpdated={handleProfileUpdated} />} />
        <Route path="/users" element={<UsersDirectory />} />
        <Route path="/users/:uid" element={<UserProfile />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/moddit" element={<Moddit profile={profile} />} />
        <Route path="/store" element={<Store />} />
        <Route path="/play" element={<Play />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/editor" element={<Editor3D />} />
      </Routes>
    </Suspense>
  );

  if (!isAuthChecked || !profile) {
    return <Login authError={authError} onGoogle={() => redirectToProviderLogin("google")} onGithub={() => redirectToProviderLogin("github")} />;
  }

  return (
    <div id="app-root">
      <Navbar onSignOut={handleSignOut} />
      <main className="content-layout">{appRoutes}</main>
    </div>
  );
}
