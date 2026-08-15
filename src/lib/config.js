// ─── ERP base URL ─────────────────────────────────────────────────────────────
export const ERP_BASE_URL =
  import.meta.env.VITE_ERP_BASE_URL || "https://erp.loxng.com";

// ─── OAuth client credentials ─────────────────────────────────────────────────
export const OAUTH_CLIENT_ID = import.meta.env.VITE_OAUTH_CLIENT_ID || "";
export const DEV = import.meta.env.VITE_DEV || true;

export const OAUTH_CLIENT_SECRET =
  import.meta.env.VITE_OAUTH_CLIENT_SECRET || "";
// Scopes — defaults to 'all openid' which is what Frappe requires
export const OAUTH_SCOPES = import.meta.env.VITE_OAUTH_SCOPES || "all openid";

// ─── Redirect URI ─────────────────────────────────────────────────────────────
// Computed from the browser's actual origin so it always matches what ERPNext
// sees, even when running on different ports or domains.
// Override with VITE_REDIRECT_URI only if you're behind a reverse proxy.
export const REDIRECT_URI =
  import.meta.env.VITE_REDIRECT_URI ||
  `${window.location.origin}/auth/callback`;

// ─── OAuth endpoints ──────────────────────────────────────────────────────────
export const OAUTH = {
  authorize: `${ERP_BASE_URL}/api/method/frappe.integrations.oauth2.authorize`,
  token: `${ERP_BASE_URL}/api/method/frappe.integrations.oauth2.get_token`,
  revoke: `${ERP_BASE_URL}/api/method/frappe.integrations.oauth2.revoke_token`,
  userinfo: `${ERP_BASE_URL}/api/method/frappe.integrations.oauth2.openid_profile`,
  logged_user: `${ERP_BASE_URL}/api/method/frappe.auth.get_logged_user`,
};

// ─── API endpoints ────────────────────────────────────────────────────────────
const API_PREFIX = `${ERP_BASE_URL}/api/method/loxng1.api`;

export const ENDPOINTS = {
  get_my_tasks: `${API_PREFIX}.get_my_tasks`,
  get_task_detail: `${API_PREFIX}.get_task_detail`,
  update_task_status: `${API_PREFIX}.update_task_status`,
  get_order_tasks: `${API_PREFIX}.get_order_tasks`,
  generate_tasks: `${API_PREFIX}.generate_tasks`,
  assign_task: `${API_PREFIX}.assign_task`,
  get_operations_dashboard: `${API_PREFIX}.get_operations_dashboard`,
};
