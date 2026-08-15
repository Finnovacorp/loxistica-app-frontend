import {
  REDIRECT_URI,
  OAUTH_CLIENT_ID,
  ERP_BASE_URL,
} from "../../lib/config.js";
import { redirectToErp } from "../../lib/auth.js";

const isDev = false;

export default function Login({ error }) {
  const missingClientId = !OAUTH_CLIENT_ID;

  return (
    <div style={S.wrap}>
      <div style={S.bgPattern} aria-hidden />
      <div style={S.topStripe} />

      {/* Logo */}
      <div style={S.logoBlock}>
        <div style={S.logoIconWrap}>
          <span style={S.logoIcon}>▦</span>
        </div>
        <h1 style={S.logoText}>LOXISTICA</h1>
        <p style={S.logoSub}>Field Operations Platform</p>
      </div>

      {/* Login card */}
      <div style={S.card}>
        <div style={S.divider}>
          <span style={S.divLine} />
          <span style={S.divLabel}>AUTHENTICATE</span>
          <span style={S.divLine} />
        </div>

        {/* OAuth / app error */}
        {error && (
          <div style={S.errorBox}>
            <span style={{ marginRight: 6 }}>⚠</span>
            {error}
          </div>
        )}

        {/* Missing client ID warning */}
        {missingClientId && (
          <div style={S.warnBox}>
            <div style={S.warnTitle}>⚙ VITE_OAUTH_CLIENT_ID not set</div>
            <div style={S.warnBody}>
              Add your Client ID to <code style={S.code}>.env</code> and restart
              the dev server before signing in.
            </div>
          </div>
        )}

        <p style={S.desc}>
          Sign in with your ERPNext credentials to access the portal.
        </p>

        {/*
         * Plain button → redirectToErp() → window.location.href
         * OAuth authorize is a full browser redirect, never fetch/XHR.
         */}
        <button
          style={{ ...S.btn, ...(missingClientId ? S.btnDisabled : {}) }}
          onClick={missingClientId ? undefined : redirectToErp}
          disabled={missingClientId}
        >
          Sign in with ERP &nbsp;→
        </button>

        <p style={S.hint}>No account? Contact your administrator.</p>
      </div>

      {/* ── Dev info panel ── */}
      {isDev && (
        <div style={S.devPanel}>
          <div style={S.devTitle}>// Dev · OAuth Config</div>

          <div style={S.devRow}>
            <span style={S.devKey}>ERP Base URL</span>
            <span style={S.devVal}>{ERP_BASE_URL}</span>
          </div>
          <div style={S.devRow}>
            <span style={S.devKey}>ERP Base URL</span>
            <span style={S.devVal}>{ERP_BASE_URL}</span>
          </div>

          <div style={S.devRow}>
            <span style={S.devKey}>Client ID</span>
            <span
              style={{
                ...S.devVal,
                color: OAUTH_CLIENT_ID ? "var(--primary)" : "var(--red)",
              }}
            >
              {OAUTH_CLIENT_ID || "⚠ not set"}
            </span>
          </div>

          {/* THE KEY VALUE — copy this exactly into ERPNext */}
          <div style={S.devRow}>
            <span style={S.devKey}>Redirect URI</span>
            <span
              style={{
                ...S.devVal,
                color: "var(--primary)",
                userSelect: "all",
              }}
            >
              {REDIRECT_URI}
            </span>
          </div>

          <div style={S.devHint}>
            ↑ Copy this Redirect URI verbatim into:
            <br />
            <strong>
              ERPNext → Setup → Integrations → OAuth Client → Redirect URIs
            </strong>
          </div>
        </div>
      )}

      <div style={S.footer}>
        <span style={S.dot} />
        <span>Loxistica</span>
        <span style={S.dot} />
        <span>v2.1</span>
        <span style={S.dot} />
      </div>
    </div>
  );
}

const S = {
  wrap: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 24px",
    gap: 20,
    background: "var(--bg)",
    position: "relative",
    overflow: "hidden",
  },
  bgPattern: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    opacity: 0.5,
    backgroundImage: `linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px)`,
    backgroundSize: "32px 32px",
  },
  topStripe: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: "var(--primary)",
  },

  logoBlock: { textAlign: "center", position: "relative", zIndex: 1 },
  logoIconWrap: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "var(--primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 12px",
    boxShadow: "0 4px 16px rgba(0,88,53,0.25)",
  },
  logoIcon: { fontSize: 24, color: "#ffffff" },
  logoText: {
    fontFamily: "var(--mono)",
    fontSize: 28,
    fontWeight: 700,
    color: "var(--primary)",
    letterSpacing: "0.12em",
  },
  logoSub: {
    fontSize: 12,
    color: "var(--text3)",
    fontFamily: "var(--mono)",
    marginTop: 4,
    letterSpacing: "0.06em",
  },

  card: {
    width: "100%",
    maxWidth: 360,
    background: "var(--bg2)",
    border: "1px solid var(--border)",
    borderTop: "3px solid var(--primary)",
    borderRadius: 6,
    padding: "28px 24px",
    position: "relative",
    zIndex: 1,
    boxShadow: "var(--shadow-lg)",
  },
  divider: { display: "flex", alignItems: "center", gap: 10, marginBottom: 20 },
  divLine: {
    flex: 1,
    height: 1,
    background: "var(--border)",
    display: "block",
  },
  divLabel: {
    fontFamily: "var(--mono)",
    fontSize: 10,
    color: "var(--text3)",
    letterSpacing: "0.14em",
    whiteSpace: "nowrap",
  },

  errorBox: {
    background: "var(--red-dim)",
    border: "1px solid var(--red)",
    borderRadius: 3,
    padding: "10px 14px",
    fontSize: 12,
    fontFamily: "var(--mono)",
    color: "var(--red)",
    marginBottom: 16,
    lineHeight: 1.6,
  },
  warnBox: {
    background: "var(--amber-dim)",
    border: "1px solid var(--amber)",
    borderRadius: 3,
    padding: "10px 14px",
    marginBottom: 16,
  },
  warnTitle: {
    fontFamily: "var(--mono)",
    fontSize: 11,
    fontWeight: 600,
    color: "var(--amber)",
    marginBottom: 4,
  },
  warnBody: { fontSize: 12, color: "var(--text2)", lineHeight: 1.6 },
  code: {
    fontFamily: "var(--mono)",
    fontSize: 11,
    background: "var(--bg3)",
    padding: "1px 5px",
    borderRadius: 2,
  },

  desc: {
    fontSize: 13,
    color: "var(--text2)",
    lineHeight: 1.7,
    marginBottom: 24,
  },

  btn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: "12px 20px",
    background: "var(--primary)",
    color: "#ffffff",
    borderRadius: 3,
    fontFamily: "var(--mono)",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.06em",
    cursor: "pointer",
    border: "none",
    boxShadow: "0 2px 8px rgba(0,88,53,0.2)",
    transition: "background .15s",
  },
  btnDisabled: { opacity: 0.45, cursor: "not-allowed", boxShadow: "none" },

  hint: {
    fontSize: 11,
    color: "var(--text3)",
    fontFamily: "var(--mono)",
    marginTop: 16,
    textAlign: "center",
    lineHeight: 1.6,
  },

  // Dev info panel
  devPanel: {
    width: "100%",
    maxWidth: 360,
    background: "var(--bg2)",
    border: "1px solid var(--border)",
    borderLeft: "3px solid var(--primary)",
    borderRadius: 4,
    padding: "14px 16px",
    position: "relative",
    zIndex: 1,
    boxShadow: "var(--shadow)",
  },
  devTitle: {
    fontFamily: "var(--mono)",
    fontSize: 10,
    color: "var(--primary)",
    fontWeight: 600,
    letterSpacing: "0.1em",
    marginBottom: 12,
  },
  devRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 8,
    flexWrap: "wrap",
  },
  devKey: {
    fontFamily: "var(--mono)",
    fontSize: 10,
    color: "var(--text3)",
    flexShrink: 0,
    paddingTop: 1,
  },
  devVal: {
    fontFamily: "var(--mono)",
    fontSize: 11,
    color: "var(--text2)",
    textAlign: "right",
    wordBreak: "break-all",
  },
  devHint: {
    fontFamily: "var(--mono)",
    fontSize: 10,
    color: "var(--text3)",
    marginTop: 10,
    lineHeight: 1.7,
    borderTop: "1px solid var(--border)",
    paddingTop: 10,
  },

  footer: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontFamily: "var(--mono)",
    fontSize: 10,
    color: "var(--text3)",
    position: "relative",
    zIndex: 1,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: "50%",
    background: "var(--border2)",
    display: "inline-block",
  },
};
