import { useEffect, useState } from "react";

// ─── Status Badge ──────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  Pending: {
    bg: "var(--blue-dim)",
    color: "var(--blue)",
    border: "var(--blue)",
  },
  "In Progress": {
    bg: "var(--amber-dim)",
    color: "var(--amber)",
    border: "var(--amber)",
  },
  Completed: {
    bg: "var(--green-dim)",
    color: "var(--green)",
    border: "var(--green)",
  },
  Blocked: { bg: "var(--red-dim)", color: "var(--red)", border: "var(--red)" },
  Skipped: {
    bg: "var(--bg3)",
    color: "var(--text3)",
    border: "var(--border2)",
  },
};

export function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES["Pending"];
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: 10,
        fontFamily: "var(--mono)",
        padding: "3px 8px",
        borderRadius: 2,
        letterSpacing: "0.08em",
        fontWeight: 600,
        whiteSpace: "nowrap",
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
      }}
    >
      {status}
    </span>
  );
}

// ─── Toast ─────────────────────────────────────────────────────────────────────
export function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        background: type === "success" ? "var(--green-100)" : "var(--red)",
        color: "var(--green-900)",
        borderRadius: 4,
        padding: "11px 22px",
        fontFamily: "var(--mono)",
        fontSize: 12,
        zIndex: 200,
        maxWidth: "90vw",
        textAlign: "center",
        boxShadow: "var(--shadow-lg)",
        letterSpacing: "0.03em",
        cursor: "pointer",
      }}
    >
      {message}
    </div>
  );
}

// ─── useToast hook ─────────────────────────────────────────────────────────────
export function useToast() {
  const [toast, setToast] = useState(null);
  const show = (message, type = "success") => setToast({ message, type });
  const hide = () => setToast(null);
  const ToastNode = toast ? (
    <Toast message={toast.message} type={toast.type} onClose={hide} />
  ) : null;
  return { show, ToastNode };
}

// ─── Loading ───────────────────────────────────────────────────────────────────
export function Loading({ text = "Loading" }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "48px 24px",
        color: "var(--primary)",
        fontFamily: "var(--mono)",
        fontSize: 12,
        letterSpacing: "0.1em",
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 40">
        <circle fill="#48A942" cx="15" cy="20" r="4">
          <animate
            attributeName="opacity"
            dur="2s"
            values="1;0;1"
            repeatCount="indefinite"
            begin="-0.4s"
          />
        </circle>
        <circle fill="#48A942" cx="40" cy="20" r="4">
          <animate
            attributeName="opacity"
            dur="2s"
            values="1;0;1"
            repeatCount="indefinite"
            begin="-0.2s"
          />
        </circle>
        <circle fill="#48A942" cx="65" cy="20" r="4">
          <animate
            attributeName="opacity"
            dur="2s"
            values="1;0;1"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
      {text}…
    </div>
  );
}

// ─── Empty ─────────────────────────────────────────────────────────────────────
export function Empty({ text }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "48px 24px",
        color: "var(--text3)",
        fontFamily: "var(--mono)",
        fontSize: 13,
      }}
    >
      {text}
    </div>
  );
}

// ─── ErrorBanner ──────────────────────────────────────────────────────────────
export function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div
      style={{
        background: "var(--red-dim)",
        border: "1px solid var(--red)",
        borderLeft: "4px solid var(--red)",
        borderRadius: 3,
        padding: "10px 14px",
        fontSize: 12,
        fontFamily: "var(--mono)",
        color: "var(--red)",
        marginBottom: 16,
        lineHeight: 1.6,
      }}
    >
      ⚠ {message}
    </div>
  );
}

// ─── ResultBanner ─────────────────────────────────────────────────────────────
export function ResultBanner({ type = "success", children }) {
  return (
    <div
      style={{
        marginTop: 16,
        padding: 14,
        background: type === "success" ? "var(--green-dim)" : "var(--red-dim)",
        border: `1px solid ${type === "success" ? "var(--green)" : "var(--red)"}`,
        borderLeft: `4px solid ${type === "success" ? "var(--primary)" : "var(--red)"}`,
        borderRadius: 3,
        fontFamily: "var(--mono)",
        fontSize: 12,
        color: type === "success" ? "var(--primary)" : "var(--red)",
        lineHeight: 1.7,
      }}
    >
      {children}
    </div>
  );
}

// ─── Section ───────────────────────────────────────────────────────────────────
export function Section({ title, children }) {
  return (
    <div
      style={{
        background: "var(--bg2)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: 16,
        marginBottom: 12,
        boxShadow: "var(--shadow)",
      }}
    >
      {title && (
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: "var(--primary)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: 14,
            paddingBottom: 8,
            borderBottom: "1px solid var(--border)",
          }}
        >
          // {title}
        </div>
      )}
      {children}
    </div>
  );
}

// ─── KV Grid ───────────────────────────────────────────────────────────────────
export function KVGrid({ children }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "10px 8px",
      }}
    >
      {children}
    </div>
  );
}

export function KVItem({ label, children, full = false }) {
  return (
    <div style={{ gridColumn: full ? "span 2" : undefined }}>
      <div
        style={{
          fontSize: 10,
          fontFamily: "var(--mono)",
          color: "var(--text3)",
          letterSpacing: "0.08em",
          marginBottom: 3,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div
        style={{ fontSize: 13, color: "var(--text)", wordBreak: "break-word" }}
      >
        {children ?? "—"}
      </div>
    </div>
  );
}

// ─── Button ────────────────────────────────────────────────────────────────────
const BTN = {
  primary: { background: "var(--primary)", color: "#ffffff", border: "none" },
  confirm: {
    background: "var(--green-dim)",
    color: "var(--green)",
    border: "1px solid var(--green)",
  },
  block: {
    background: "var(--red-dim)",
    color: "var(--red)",
    border: "1px solid var(--red)",
  },
  ghost: {
    background: "transparent",
    color: "var(--text2)",
    border: "1px solid var(--border2)",
  },
  blue: {
    background: "var(--blue-dim)",
    color: "var(--blue)",
    border: "1px solid var(--blue)",
  },
  amber: {
    background: "var(--amber-dim)",
    color: "var(--amber)",
    border: "1px solid var(--amber)",
  },
};

export function Button({
  variant = "primary",
  onClick,
  disabled,
  children,
  fullWidth,
  style: extra = {},
}) {
  const v = BTN[variant] ?? BTN.primary;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...v,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "10px 20px",
        borderRadius: 3,
        fontFamily: "var(--mono)",
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: "0.04em",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        width: fullWidth ? "100%" : "auto",
        transition: "all .15s",
        ...extra,
      }}
    >
      {children}
    </button>
  );
}

// ─── Field ─────────────────────────────────────────────────────────────────────
export function Field({ label, required, error, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label
        style={{
          display: "block",
          fontSize: 11,
          fontFamily: "var(--mono)",
          color: "var(--text2)",
          letterSpacing: "0.08em",
          marginBottom: 6,
          textTransform: "uppercase",
          fontWeight: 500,
        }}
      >
        {label}
        {required && (
          <span style={{ color: "var(--red)", marginLeft: 4 }}>*</span>
        )}
      </label>
      {children}
      {error && (
        <div
          style={{
            fontSize: 11,
            color: "var(--red)",
            marginTop: 5,
            fontFamily: "var(--mono)",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

export const inputStyle = {
  width: "100%",
  background: "var(--bg3)",
  border: "1px solid var(--border)",
  borderRadius: 3,
  padding: "10px 12px",
  fontFamily: "var(--mono)",
  fontSize: 13,
  color: "var(--text)",
  outline: "none",
  transition: "border-color .2s",
};

// ─── FreightChips ─────────────────────────────────────────────────────────────
export function FreightChips({ type, dir }) {
  const dirStyle =
    dir === "Import"
      ? { background: "var(--green-dim)", color: "var(--green)" }
      : dir === "Export"
        ? { background: "var(--amber-dim)", color: "var(--amber)" }
        : { background: "var(--purple-dim)", color: "var(--purple)" };

  return (
    <span style={{ display: "inline-flex", gap: 6, flexWrap: "wrap" }}>
      {type && (
        <span
          style={{
            fontSize: 10,
            fontFamily: "var(--mono)",
            padding: "3px 8px",
            borderRadius: 2,
            fontWeight: 500,
            background:
              type === "Sea Freight" ? "var(--blue-dim)" : "var(--purple-dim)",
            color: type === "Sea Freight" ? "var(--blue)" : "var(--purple)",
          }}
        >
          {type}
        </span>
      )}
      {dir && (
        <span
          style={{
            fontSize: 10,
            fontFamily: "var(--mono)",
            padding: "3px 8px",
            borderRadius: 2,
            fontWeight: 500,
            ...dirStyle,
          }}
        >
          {dir}
        </span>
      )}
    </span>
  );
}

// ─── Modal ─────────────────────────────────────────────────────────────────────
export function Modal({ title, onClose, children, footer }) {
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,88,53,0.18)",
        backdropFilter: "blur(2px)",
        zIndex: 100,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderTop: "3px solid var(--primary)",
          borderRadius: "8px 8px 0 0",
          padding: "24px 20px",
          width: "100%",
          maxWidth: 480,
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 13,
            fontWeight: 600,
            color: "var(--primary)",
            marginBottom: 16,
            letterSpacing: "0.04em",
          }}
        >
          {title}
        </div>
        {children}
        {footer && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginTop: 16,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MetaTag ──────────────────────────────────────────────────────────────────
export function MetaTag({ children, primary, green, red, amber }) {
  return (
    <span
      style={{
        fontSize: 10,
        fontFamily: "var(--mono)",
        padding: "2px 8px",
        borderRadius: 2,
        fontWeight: 500,
        background: primary
          ? "var(--primary-dim)"
          : green
            ? "var(--green-dim)"
            : red
              ? "var(--red-dim)"
              : amber
                ? "var(--amber-dim)"
                : "var(--bg3)",
        color: primary
          ? "var(--primary)"
          : green
            ? "var(--green)"
            : red
              ? "var(--red)"
              : amber
                ? "var(--amber)"
                : "var(--text2)",
      }}
    >
      {children}
    </span>
  );
}

// ─── TaskCard ─────────────────────────────────────────────────────────────────
export function TaskCard({ task, onClick, clickable = true }) {
  return (
    <div
      onClick={clickable && onClick ? () => onClick(task) : undefined}
      style={{
        background: "var(--bg2)",
        border: "1px solid var(--border)",
        borderLeft: "3px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: 16,
        marginBottom: 10,
        cursor: clickable ? "pointer" : "default",
        transition: "border-color .15s, box-shadow .15s",
        boxShadow: "var(--shadow)",
      }}
      onMouseEnter={(e) => {
        if (clickable) {
          e.currentTarget.style.borderLeftColor = "var(--primary)";
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,88,53,0.12)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderLeftColor = "var(--border)";
        e.currentTarget.style.boxShadow = "var(--shadow)";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <div style={{ minWidth: 0, flex: 1, paddingRight: 10 }}>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: "var(--text3)",
              marginBottom: 2,
            }}
          >
            {task.name}
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--text)",
              lineHeight: 1.3,
            }}
          >
            {task.task_name}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 6,
            flexShrink: 0,
          }}
        >
          <StatusBadge status={task.status} />
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "var(--green-100)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: "var(--primary)",
              fontWeight: 600,
            }}
          >
            {task.sequence}
          </div>
        </div>
      </div>

      {task.order_customer && (
        <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 8 }}>
          {task.order_customer}
          {task.order_bl_no && (
            <span
              style={{
                color: "var(--text3)",
                marginLeft: 8,
                fontFamily: "var(--mono)",
                fontSize: 11,
              }}
            >
              {task.order_bl_no}
            </span>
          )}
          {task.order_ucr && (
            <span
              style={{
                color: "var(--text3)",
                marginLeft: 8,
                fontFamily: "var(--mono)",
                fontSize: 10,
              }}
            >
              UCR: {task.order_ucr}
            </span>
          )}
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {task.order_freight_type && (
          <FreightChips
            type={task.order_freight_type}
            dir={task.order_direction}
          />
        )}
        {task.order_service_type && (
          <MetaTag>{task.order_service_type}</MetaTag>
        )}
        {task.order_terminal && <MetaTag>{task.order_terminal}</MetaTag>}
        {task.is_external === 1 && <MetaTag primary>EXTERNAL</MetaTag>}
        {task.is_parallel === 1 && <MetaTag>PARALLEL</MetaTag>}
        {task.assigned_to_name && !task.order_customer && (
          <MetaTag>{task.assigned_to_name}</MetaTag>
        )}
        {task.started_at && (
          <MetaTag amber>▶ {task.started_at.slice(0, 16)}</MetaTag>
        )}
        {task.confirmed_at && (
          <MetaTag green>✓ {task.confirmed_at.slice(0, 16)}</MetaTag>
        )}
        {task.blocked_at && (
          <MetaTag red>✕ {task.blocked_at.slice(0, 16)}</MetaTag>
        )}
      </div>

      {task.blocked_reason && (
        <div
          style={{
            marginTop: 8,
            fontSize: 12,
            color: "var(--red)",
            fontFamily: "var(--mono)",
          }}
        >
          {task.blocked_reason}
        </div>
      )}
    </div>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
export function StatCard({ value, label, color = "primary" }) {
  const colors = {
    primary: "var(--primary)",
    green: "var(--green)",
    red: "var(--red)",
    blue: "var(--blue)",
    amber: "var(--amber)",
  };
  const c = colors[color] ?? colors.primary;
  return (
    <div
      style={{
        background: "var(--bg2)",
        border: "1px solid var(--border)",
        borderTop: `3px solid ${c}`,
        borderRadius: "var(--radius)",
        padding: "14px 8px",
        textAlign: "center",
        boxShadow: "var(--shadow)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: 28,
          fontWeight: 700,
          color: c,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: 9,
          color: "var(--text3)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginTop: 6,
        }}
      >
        {label}
      </div>
    </div>
  );
}
