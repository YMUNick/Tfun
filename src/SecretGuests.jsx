import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { i18n } from "./data";

const BASE = import.meta.env.BASE_URL;

const guests = [
  {
    name: "Lefthand Drive",
    nameEn: "Lefthand Drive",
    genre: "ROCK",
    color: "#FF2E00",
    image: BASE + "lefthanddrive.jpg",
    tag: "火爆天團",
    tagEn: "Red-Hot Band",
  },
  {
    name: "五月天",
    nameEn: "Mayday",
    genre: "ROCK",
    color: "#FF003C",
    image: BASE + "mayday.jpg",
    tag: "沒有邀請",
    tagEn: "Not Invited",
  },
  {
    name: "周杰倫",
    nameEn: "Jay Chou",
    genre: "MANDOPOP / R&B",
    color: "#FFD700",
    image: BASE + "jay.jpg",
    tag: "沒有經費",
    tagEn: "No Budget",
  },
  {
    name: "美秀集團",
    nameEn: "Amazing Show",
    genre: "INDIE ROCK",
    color: "#39FF14",
    image: BASE + "美秀.jpg",
    tag: "肯定不會來",
    tagEn: "Definitely Won't Come",
  },
  {
    name: "Genesa",
    nameEn: "Genesa",
    genre: "MC",
    color: "#FF6B35",
    image: BASE + "Genesa.jpg",
    tag: "重金禮聘 最辣MC",
    tagEn: "Big Money, Hottest MC",
  },
];

export default function SecretGuests() {
  const [lang, setLang] = useState(() => localStorage.getItem("tfun-lang") || "zh");
  const t = i18n[lang];
  const [revealedCards, setRevealedCards] = useState(new Set());

  useEffect(() => {
    localStorage.setItem("tfun-lang", lang);
  }, [lang]);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Staggered spotlight reveal from left to right
    guests.forEach((_, i) => {
      setTimeout(() => {
        setRevealedCards((prev) => new Set([...prev, i]));
      }, 800 + i * 600);
    });
  }, []);

  const toggleLang = () => setLang((l) => (l === "zh" ? "en" : "zh"));

  return (
    <div style={{ minHeight: "100vh", background: "var(--black)", color: "var(--white)" }}>
      <style>{`
        .guest-card {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          cursor: default;
          opacity: 0;
          transform: scale(0.95);
          filter: brightness(0);
          transition: opacity 0.8s ease, transform 0.8s ease, filter 1s ease, box-shadow 0.4s ease;
        }
        .guest-card.revealed {
          opacity: 1;
          transform: scale(1);
          filter: brightness(1);
        }
        .guest-card.revealed:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        }
        .guest-spotlight {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.25) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.6s ease 0.3s;
          pointer-events: none;
          z-index: 2;
        }
        .guest-card.revealed .guest-spotlight {
          opacity: 1;
          animation: spotlightFade 1.5s ease 0.5s forwards;
        }
        @keyframes spotlightFade {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        .guest-photo {
          transition: transform 0.5s ease;
        }
        .guest-card.revealed:hover .guest-photo {
          transform: scale(1.05);
        }
        @media (max-width: 768px) {
          .guests-grid { grid-template-columns: 1fr !important; }
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
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 24,
          }}
        >
          {guests.map((guest, i) => (
            <div key={guest.name} className={`guest-card ${revealedCards.has(i) ? "revealed" : ""}`}>
              {/* Spotlight flash overlay */}
              <div className="guest-spotlight" />
              <div style={{
                position: "relative",
                aspectRatio: "9/16",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                overflow: "hidden",
              }}>
                {/* Photo background */}
                <img
                  src={guest.image}
                  alt={guest.name}
                  className="guest-photo"
                  style={{
                    position: "absolute", inset: 0,
                    width: "100%", height: "100%",
                    objectFit: "cover",
                    objectPosition: "top center",
                  }}
                />
                {/* Dark gradient overlay for text readability */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.1) 100%)",
                }} />

                {/* Content */}
                <div style={{ position: "relative", zIndex: 1, padding: "60px 32px 40px" }}>
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
                    {lang === "zh" ? guest.tag : guest.tagEn}
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
