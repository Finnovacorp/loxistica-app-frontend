import { TokenStore, refreshAccessToken } from "./auth.js";

/**
 * Parse Frappe _server_messages into a human-readable string.
 */
function parseFrappeError(data) {
  if (data?._server_messages) {
    try {
      const msgs = JSON.parse(data._server_messages);
      return msgs
        .map((m) => {
          try {
            return JSON.parse(m).message;
          } catch {
            return m;
          }
        })
        .filter(Boolean)
        .join(". ");
    } catch {
      /* fall through */
    }
  }
  if (data?.message && typeof data.message === "string") return data.message;
  return null;
}

/**
 * Central fetch wrapper.
 * - Attaches Bearer token automatically.
 * - On 401: attempts one token refresh, then retries.
 * - On error: parses Frappe _server_messages.
 * - Unwraps the Frappe { message: ... } envelope.
 */
export async function apiFetch(url, options = {}, _retry = true) {
  const token = TokenStore.get("access_token");

  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.headers ?? {}),
    },
  });

  // Auto-refresh on 401
  if (res.status === 401 && _retry) {
    try {
      await refreshAccessToken();
      return apiFetch(url, options, false);
    } catch {
      TokenStore.clear();
      window.location.href = "/";
      throw new Error("Session expired. Please log in again.");
    }
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = parseFrappeError(data) ?? `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }

  // Unwrap Frappe envelope
  return data?.message !== undefined ? data.message : data;
}

// ─── Convenience wrappers ─────────────────────────────────────────────────────

export const api = {
  get: (url, params) => {
    const u = params ? url + "?" + new URLSearchParams(params).toString() : url;
    return apiFetch(u, { method: "GET" });
  },

  post: (url, body) =>
    apiFetch(url, { method: "POST", body: JSON.stringify(body) }),
};
