export const ERP_BASE_URL =
  import.meta.env.VITE_ERP_BASE_URL || "https://erp.loxng.com";
export const OAUTH_CLIENT_ID = import.meta.env.VITE_OAUTH_CLIENT_ID || "";
export const REDIRECT_URI =
  import.meta.env.VITE_REDIRECT_URI ||
  `${window.location.origin}/auth/callback`;

export const OAUTH = {
  authorize: `${ERP_BASE_URL}/api/method/frappe.integrations.oauth2.authorize`,
  token: `${ERP_BASE_URL}/api/method/frappe.integrations.oauth2.get_token`,
  revoke: `${ERP_BASE_URL}/api/method/frappe.integrations.oauth2.revoke_token`,
  userinfo: `${ERP_BASE_URL}/api/method/frappe.integrations.oauth2.openid_profile`,
  logged_user: `${ERP_BASE_URL}/api/method/frappe.auth.get_logged_user`,
};

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
