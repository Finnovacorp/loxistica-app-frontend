import { usePwaInstall } from "../hooks/usePwaInstall.js";

export default function InstallBanner() {
  const { canInstall, promptInstall, dismiss } = usePwaInstall();

  if (!canInstall) return null;

  return (
    <>
      {/* Backdrop — tap to dismiss */}
      <div
        onClick={dismiss}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,88,53,0.15)",
          backdropFilter: "blur(2px)",
          zIndex: 900,
          animation: "fadeIn .25s ease",
        }}
      />

      {/* Bottom sheet */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 480,
          background: "#ffffff",
          borderTop: "3px solid #005835",
          borderRadius: "16px 16px 0 0",
          padding: "20px 20px 32px",
          zIndex: 901,
          boxShadow: "0 -8px 40px rgba(0,88,53,0.18)",
          animation: "slideUp .3s cubic-bezier(0.32,0.72,0,1)",
        }}
      >
        {/* Drag handle */}
        <div
          style={{
            width: 40,
            height: 4,
            borderRadius: 2,
            background: "#d1ddd6",
            margin: "0 auto 20px",
          }}
        />

        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 14,
          }}
        >
          <img
            src="/icons/icon-72x72.png"
            alt="Loxistica"
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,88,53,0.2)",
              flexShrink: 0,
            }}
          />
          <div>
            <div
              style={{
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontWeight: 700,
                fontSize: 16,
                color: "#005835",
                lineHeight: 1.2,
              }}
            >
              Loxistica
            </div>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10,
                color: "#7a9485",
                marginTop: 2,
                letterSpacing: "0.06em",
              }}
            >
              NIGERIA LIMITED
            </div>
          </div>
        </div>

        <p
          style={{
            fontSize: 13,
            color: "#3d5c4a",
            lineHeight: 1.65,
            marginBottom: 20,
            fontFamily: "'IBM Plex Sans', sans-serif",
          }}
        >
          Add Loxistica to your home screen
        </p>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 5,
          }}
        >
          {/* {["⚡ Instant launch", "📋 Task management", "🔔 Stays updated"].map(
            (f) => (
              <span
                key={f}
                style={{
                  fontSize: 11,
                  fontFamily: "'IBM Plex Mono', monospace",
                  padding: "4px 10px",
                  borderRadius: 20,
                  background: "#e6f4ee",
                  color: "#005835",
                  border: "1px solid #b8cfc5",
                }}
              >
                {f}
              </span>
            ),
          )} */}
        </div>

        {/* Buttons */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 10 }}
        >
          <button
            onClick={dismiss}
            style={{
              padding: "12px",
              background: "transparent",
              border: "1px solid #d1ddd6",
              borderRadius: 6,
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 12,
              color: "#7a9485",
              cursor: "pointer",
            }}
          >
            Not now
          </button>

          <button
            onClick={promptInstall}
            style={{
              padding: "12px",
              background: "#005835",
              border: "none",
              borderRadius: 6,
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 13,
              fontWeight: 700,
              color: "#ffffff",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,88,53,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            + Add to Home Screen
          </button>
        </div>
      </div>

      <style>{`
                @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
                @keyframes slideUp { from { transform: translateX(-50%) translateY(100%) } to { transform: translateX(-50%) translateY(0) } }
            `}</style>
    </>
  );
}
