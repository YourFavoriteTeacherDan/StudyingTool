const CF_ACCOUNT_ID = "432016fb922777d8a5140c9b3b3d37f3";
const DEFAULT_PROXY_BASE = "/api/cloudflare";
const IDENTITY_STORAGE_KEY = "elge:cloudflare:identity";
const PROFILE_STORAGE_KEY = "elge:cloudflare:profile";
const API_UNAVAILABLE_KEY = "elge:cloudflare:api-unavailable";
const AUTH_API_BASE = "/api/auth";

function getIdentityApiBaseUrl() {
  const configuredProxy = import.meta.env.VITE_CF_IDENTITY_PROXY_URL;

  if (configuredProxy) {
    return configuredProxy.replace(/\/$/, "");
  }

  return DEFAULT_PROXY_BASE;
}

function withStatusError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function extractErrorMessage(payload, status) {
  const message = payload?.errors?.[0]?.message || payload?.message;

  if (typeof message === "string" && message.trim()) {
    return message.length > 220 ? `${message.slice(0, 220)}…` : message;
  }

  return `Request failed with status ${status}`;
}

function looksLikeHtmlDocument(body, contentType = "") {
  const normalized = body.trim().toLowerCase();
  return (
    contentType.includes("text/html") ||
    normalized.startsWith("<!doctype html") ||
    normalized.startsWith("<html")
  );
}

async function fetchJsonWithGuards(requestUrl, options = {}) {
  const response = await fetch(requestUrl, {
    credentials: "include",
    ...options
  });

  const rawBody = await response.text();
  const contentType = response.headers.get("content-type") || "";

  if (rawBody && looksLikeHtmlDocument(rawBody, contentType)) {
    throw withStatusError(
      "Cloudflare identity lookup hit an HTML page instead of API JSON. Configure /api/cloudflare proxy routing (or VITE_CF_IDENTITY_PROXY_URL) to forward this request server-side.",
      response.status
    );
  }

  let payload = null;

  if (rawBody) {
    try {
      payload = JSON.parse(rawBody);
    } catch {
      payload = { message: rawBody };
    }
  }

  if (!response.ok || payload?.success === false) {
    throw withStatusError(extractErrorMessage(payload, response.status), response.status);
  }

  if (!payload) {
    throw withStatusError("Cloudflare identity lookup returned an empty response from proxy.", response.status);
  }

  return payload;
}

export function loadCachedIdentity() {
  const raw = localStorage.getItem(IDENTITY_STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function saveIdentitySnapshot(snapshot) {
  localStorage.setItem(IDENTITY_STORAGE_KEY, JSON.stringify(snapshot));
}

export function loadCachedProfile() {
  const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function saveCachedProfile(profile) {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

export function clearCachedProfile() {
  localStorage.removeItem(PROFILE_STORAGE_KEY);
}

export async function fetchAuthSessionUser() {
  const payload = await fetchJsonWithGuards(`${AUTH_API_BASE}/me`, { method: "GET" });
  return payload?.result ?? null;
}

export function redirectToProviderLogin(provider) {
  window.location.href = `${AUTH_API_BASE}/login/${encodeURIComponent(provider)}`;
}

export async function logoutAuthSession() {
  await fetchJsonWithGuards(`${AUTH_API_BASE}/logout`, { method: "POST" });
}

export async function updateAuthProfile(profilePatch) {
  const payload = await fetchJsonWithGuards(`${AUTH_API_BASE}/profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profilePatch)
  });
  return payload?.result ?? null;
}

export async function deleteAuthAccount() {
  return fetchJsonWithGuards(`${AUTH_API_BASE}/account`, { method: "DELETE" });
}


export async function fetchAllUsers() {
  const payload = await fetchJsonWithGuards(`${AUTH_API_BASE}/users`, {
    method: "GET"
  });
  return payload?.result ?? [];
}

export async function fetchPublicUserProfile(uid) {
  const payload = await fetchJsonWithGuards(`${AUTH_API_BASE}/user/${encodeURIComponent(uid)}`, {
    method: "GET"
  });
  return payload?.result ?? null;
}

export function buildUserProfile(identityResult) {
  const uid = identityResult?.uid || "";
  const identity = identityResult?.identity || {};

  const email = identity.email || identity?.identity?.email || "";
  const username =
    identity.name ||
    identity.preferred_username ||
    identity.nickname ||
    (email ? email.split("@")[0] : "");
  const country = identity.country || identity?.custom?.country || identity?.geo?.country || "";
  const profilePicture = identity.picture || identity.avatar || identity?.custom?.profile_picture || "";

  return {
    title: uid,
    uid,
    email,
    country,
    username,
    profilePicture,
    updatedAt: new Date().toISOString()
  };
}

export async function fetchAccessUserUid() {
  const apiBaseUrl = getIdentityApiBaseUrl();

  if (localStorage.getItem(API_UNAVAILABLE_KEY) === "1") {
    const cached = loadCachedIdentity();
    if (cached?.uid) {
      return cached;
    }
    throw new Error("Cloudflare identity endpoint is unavailable on this deployment. Configure /api/cloudflare routes.");
  }

  try {
    const payload = await fetchJsonWithGuards(`${apiBaseUrl}/identity`);
    localStorage.removeItem(API_UNAVAILABLE_KEY);
    return payload?.result ?? payload;
  } catch (error) {
    if (error?.status === 404) {
      localStorage.setItem(API_UNAVAILABLE_KEY, "1");
      throw new Error("Cloudflare identity endpoint not found (404). Deploy Pages Functions for /api/cloudflare/identity.");
    }

    try {
      const legacyPayload = await fetchJsonWithGuards("/api/get-user-uid");
      localStorage.removeItem(API_UNAVAILABLE_KEY);
      return legacyPayload;
    } catch {
      // preserve primary error message
    }

    if (error instanceof TypeError) {
      throw new Error(
        "Failed to auto-detect UID from Cloudflare Access session. Ensure /api/cloudflare/identity is proxied and Cloudflare Access is active for this hostname."
      );
    }

    throw error;
  }
}

export async function upsertUserProfile(uid, profile) {
  const apiBaseUrl = getIdentityApiBaseUrl();
  const payload = await fetchJsonWithGuards(`${apiBaseUrl}/users/${encodeURIComponent(uid)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(profile)
  });

  return payload?.result ?? payload;
}

export async function fetchUserProfile(uid) {
  const apiBaseUrl = getIdentityApiBaseUrl();
  const payload = await fetchJsonWithGuards(`${apiBaseUrl}/users/${encodeURIComponent(uid)}`, {
    method: "GET"
  });

  return payload?.result ?? payload;
}

export async function fetchLastSeenIdentity(userUid) {
  const trimmedUid = userUid.trim();
  if (!trimmedUid) {
    throw new Error("Please enter your Cloudflare Access UID.");
  }

  const apiBaseUrl = getIdentityApiBaseUrl();
  const requestUrl = `${apiBaseUrl}/accounts/${CF_ACCOUNT_ID}/access/users/${encodeURIComponent(trimmedUid)}/last_seen_identity`;

  const payload = await fetchJsonWithGuards(requestUrl, { method: "GET" });
  return payload?.result ?? payload;
}
