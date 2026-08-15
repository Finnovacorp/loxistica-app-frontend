import {
  ERP_BASE_URL,
  OAUTH,
  OAUTH_CLIENT_ID,
  REDIRECT_URI,
} from "./config.js";

// ─── Token storage (sessionStorage for security) ──────────────────────────────
export const TokenStore = {
  get: (k) => sessionStorage.getItem(k),
  set: (k, v) => sessionStorage.setItem(k, v),
  clear: () =>
    ["access_token", "refresh_token", "user"].forEach((k) =>
      sessionStorage.removeItem(k),
    ),

  getUser: () => {
    try {
      return JSON.parse(sessionStorage.getItem("user"));
    } catch {
      return null;
    }
  },
  setUser: (u) => sessionStorage.setItem("user", JSON.stringify(u)),
};

// ─── Build the OAuth authorize URL and redirect the browser ───────────────────
// Must be a full browser redirect — never fetch/XHR — to avoid CORS errors.
export function redirectToErp() {
  const state = crypto.randomUUID();
  sessionStorage.setItem("oauth_state", state);

  const params = new URLSearchParams({
    client_id: OAUTH_CLIENT_ID,
    response_type: "code",
    scope: "all openid",
    redirect_uri: REDIRECT_URI,
    state,
  });

  window.location.href = OAUTH.authorize + "?" + params.toString();
}

// ─── Exchange authorization code for tokens ───────────────────────────────────
export async function exchangeCode(code) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: OAUTH_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
  });

  const res = await fetch(OAUTH.token, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) throw new Error("Token exchange failed.");
  return res.json(); // { access_token, refresh_token, expires_in, ... }
}

// ─── Refresh an expired access token ─────────────────────────────────────────
export async function refreshAccessToken() {
  const rt = TokenStore.get("refresh_token");
  if (!rt) throw new Error("No refresh token.");

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: rt,
    client_id: OAUTH_CLIENT_ID,
  });

  const res = await fetch(OAUTH.token, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) throw new Error("Token refresh failed.");
  const data = await res.json();
  TokenStore.set("access_token", data.access_token);
  TokenStore.set("refresh_token", data.refresh_token ?? rt);
  return data;
}

// ─── Revoke token on logout ───────────────────────────────────────────────────
export async function revokeToken() {
  const token = TokenStore.get("access_token");
  if (!token) return;
  try {
    await fetch(OAUTH.revoke, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ token }),
    });
  } catch {
    /* best-effort */
  }
}

// ─── Fetch the OpenID profile after login ─────────────────────────────────────
export async function fetchProfile(accessToken) {
  const res = await fetch(OAUTH.userinfo, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Failed to fetch profile.");
  return res.json(); // { sub, name, email, roles }
}
