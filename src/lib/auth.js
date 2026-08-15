import { ERP_BASE_URL, OAUTH, OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_SCOPES, REDIRECT_URI } from './config.js';

// ─── Token storage (sessionStorage — cleared when tab closes) ─────────────────
export const TokenStore = {
    get:     (k)    => sessionStorage.getItem(k),
    set:     (k, v) => sessionStorage.setItem(k, v),
    clear:   ()     => ['access_token', 'refresh_token', 'user'].forEach(k => sessionStorage.removeItem(k)),
    getUser: ()     => { try { return JSON.parse(sessionStorage.getItem('user')); } catch { return null; } },
    setUser: (u)    => sessionStorage.setItem('user', JSON.stringify(u)),
};

// ─── redirectToErp ────────────────────────────────────────────────────────────
// Performs a full browser navigation to the ERPNext authorization endpoint.
// MUST be window.location.href — never fetch/XHR — to avoid CORS errors.
// The redirect_uri sent here must be character-for-character identical to
// what is registered in ERPNext → OAuth Client → Redirect URIs.
export function redirectToErp() {
    const state = crypto.randomUUID();
    sessionStorage.setItem('oauth_state', state);

    const params = new URLSearchParams({
        client_id:     OAUTH_CLIENT_ID,
        response_type: 'code',
        scope:         OAUTH_SCOPES,
        redirect_uri:  REDIRECT_URI,   // ← must match ERPNext exactly
        state,
    });

    window.location.href = OAUTH.authorize + '?' + params.toString();
}

// ─── exchangeCode ─────────────────────────────────────────────────────────────
// Step 2 of Authorization Code flow.
// redirect_uri here must be identical to the one sent in step 1.
export async function exchangeCode(code) {
    const body = new URLSearchParams({
        grant_type:   'authorization_code',
        code,
        client_id:    OAUTH_CLIENT_ID,
        redirect_uri: REDIRECT_URI,    // ← must match step 1 exactly
    });

    // Include client_secret only when configured (confidential client)
    if (OAUTH_CLIENT_SECRET) {
        body.set('client_secret', OAUTH_CLIENT_SECRET);
    }

    const res = await fetch(OAUTH.token, {
        method:  'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error_description ?? err.error ?? 'Token exchange failed.');
    }
    return res.json();
}

// ─── refreshAccessToken ───────────────────────────────────────────────────────
export async function refreshAccessToken() {
    const rt = TokenStore.get('refresh_token');
    if (!rt) throw new Error('No refresh token.');

    const body = new URLSearchParams({
        grant_type:    'refresh_token',
        refresh_token: rt,
        client_id:     OAUTH_CLIENT_ID,
    });

    if (OAUTH_CLIENT_SECRET) {
        body.set('client_secret', OAUTH_CLIENT_SECRET);
    }

    const res = await fetch(OAUTH.token, {
        method:  'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
    });

    if (!res.ok) throw new Error('Token refresh failed.');
    const data = await res.json();
    TokenStore.set('access_token', data.access_token);
    TokenStore.set('refresh_token', data.refresh_token ?? rt);
    return data;
}

// ─── revokeToken ──────────────────────────────────────────────────────────────
export async function revokeToken() {
    const token = TokenStore.get('access_token');
    if (!token) return;
    try {
        await fetch(OAUTH.revoke, {
            method:  'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body:    new URLSearchParams({ token }),
        });
    } catch { /* best-effort */ }
}

// ─── fetchProfile ─────────────────────────────────────────────────────────────
export async function fetchProfile(accessToken) {
    const res = await fetch(OAUTH.userinfo, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error('Failed to fetch user profile.');
    return res.json();
}
