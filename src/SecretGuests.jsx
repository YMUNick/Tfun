import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { i18n } from "./data";

const guests = [
  {
    name: "五月天",
    nameEn: "Mayday",
    genre: "ROCK",
    color: "#FF003C",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #e94560 50%, #0f3460 100%)",
    initial: "五",
  },
  {
    name: "周杰倫",
    nameEn: "Jay Chou",
    genre: "MANDOPOP / R&B",
    color: "#FFD700",
    gradient: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    initial: "J",
  },
  {
    name: "美秀集團",
    nameEn: "Amazing Show",
    genre: "INDIE ROCK",
    color: "#39FF14",
    gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 50%, #0f3443 100%)",
    initial: "美",
  },
];

export default function SecretGuests() {
  const [lang, setLang] = useState(() => localStorage.getItem("tfun-lang") || "zh");
  const t = i18n[lang];

  useEffect(() => {
    localStorage.setItem("tfun-lang", lang);
  }, [lang]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleLang = () => setLang((l) => (l === "zh" ? "en" : "zh"));

  return (
    <div style={{ minHeight: "100vh", background: "var(--black)", color: "var(--white)" }}>
      <style>{`
        .guest-card {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          transition: transform 0.4s ease, box-shadow 0.4s ease;
          cursor: default;
        }
        .guest-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        }
        .guest-card:hover .guest-initial {
          transform: scale(1.1);
          opacity: 0.15;
        }
        .guest-initial {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: var(--font-sans);
          font-size: 180px;
          font-weight: 700;
          opacity: 0.08;
          pointer-events: none;
          transition: transform 0.4s ease, opacity 0.4s ease;
          line-height: 1;
        }
        @media (max-width: 768px) {
          .guests-grid { grid-template-columns: 1fr !important; }
          .guest-initial { font-size: 120px; }
        }
      `}</style>

      {/* ─── NAV ─── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(0,0,0,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "16px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--white)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span style={{
            fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 22,
            letterSpacing: "-0.5px", color: "var(--white)",
          }}>
            T FUN
          </span>
        </Link>

        <button
          onClick={toggleLang}
          className="pill-btn"
          aria-label={lang === "zh" ? "Switch to English" : "切換為中文"}
          style={{
            padding: "6px 20px", fontSize: 14, fontWeight: 540,
            background: "transparent", color: "var(--white)",
            borderColor: "rgba(255,255,255,0.3)", minWidth: 56,
          }}
        >
          {t.lang}
        </button>
      </nav>

      {/* ─── HEADER ─── */}
      <header style={{
        padding: "100px 32px 60px",
        maxWidth: 1200, margin: "0 auto",
        textAlign: "center",
      }}>
        <span style={{
          display: "inline-block",
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "2px",
          padding: "6px 16px",
          borderRadius: 50,
          border: "1px solid rgba(255,215,0,0.3)",
          background: "rgba(255,215,0,0.08)",
          color: "#FFD700",
          marginBottom: 32,
        }}>
          {lang === "zh" ? "TOP SECRET" : "TOP SECRET"}
        </span>
        <h1 style={{
          fontFamily: "var(--font-sans)",
          fontSize: "clamp(48px, 10vw, 100px)",
          fontWeight: 700,
          letterSpacing: "-2px",
          lineHeight: 0.95,
          color: "var(--white)",
          marginBottom: 16,
        }}>
          {lang === "zh" ? "隱藏嘉賓" : "Secret Guests"}
        </h1>
        <p style={{
          fontFamily: "var(--font-sans)", fontSize: 16,
          color: "var(--white)", opacity: 0.35,
          fontWeight: 340, letterSpacing: "-0.14px",
        }}>
          {lang === "zh" ? "如果可以的話..." : "If only we could..."}
        </p>
      </header>

      {/* ─── GUEST CARDS ─── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px 120px" }}>
        <div
          className="guests-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {guests.map((guest) => (
            <div key={guest.name} className="guest-card">
              {/* Background gradient */}
              <div style={{
                background: guest.gradient,
                padding: "60px 32px 40px",
                minHeight: 380,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                position: "relative",
              }}>
                {/* Large initial letter */}
                <span className="guest-initial" style={{ color: guest.color }}>
                  {guest.initial}
                </span>

                {/* Content */}
                <div style={{ position: "relative", zIndex: 1 }}>
                  {/* Genre */}
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10, fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    color: guest.color,
                    display: "block",
                    marginBottom: 12,
                  }}>
                    {guest.genre}
                  </span>

                  {/* Name */}
                  <h2 style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "clamp(36px, 5vw, 52px)",
                    fontWeight: 700,
                    letterSpacing: "-1px",
                    lineHeight: 1.05,
                    color: "var(--white)",
                    marginBottom: 4,
                  }}>
                    {guest.name}
                  </h2>
                  <p style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 16, fontWeight: 340,
                    color: "var(--white)",
                    opacity: 0.5,
                    marginBottom: 20,
                  }}>
                    {guest.nameEn}
                  </p>

                  {/* "沒有邀請" tag */}
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: "1px",
                    color: "var(--white)",
                    opacity: 0.3,
                    display: "inline-block",
                    padding: "4px 12px",
                    borderRadius: 50,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.05)",
                  }}>
                    {lang === "zh" ? "沒有邀請" : "Not Invited"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "32px 24px", textAlign: "center",
      }}>
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12, fontWeight: 400,
          letterSpacing: "0.6px",
          textTransform: "uppercase",
          opacity: 0.2,
        }}>
          TAIWANESE FUN (T FUN) MUSIC FEST — 2026
        </p>
      </footer>
    </div>
  );
}
