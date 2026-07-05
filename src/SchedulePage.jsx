import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { i18n, bands } from "./data";

// Official performance order (by band id)
const performanceOrder = [5, 6, 9, 2, 4, 3, 1, 7, 8, 11, 10];

export default function SchedulePage() {
  const [lang, setLang] = useState(() => localStorage.getItem("tfun-lang") || "zh");
  const t = i18n[lang];

  useEffect(() => {
    localStorage.setItem("tfun-lang", lang);
  }, [lang]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleLang = () => setLang((l) => (l === "zh" ? "en" : "zh"));

  const schedule = useMemo(() => {
    const ordered = performanceOrder
      .map((id) => bands.find((b) => b.id === id))
      .filter(Boolean);
    const startHour = 14;
    const startMinute = 0;
    const defaultDuration = 25;
    let elapsed = 0;

    return ordered.map((band, i) => {
      const totalMinutes = startHour * 60 + startMinute + elapsed;
      const duration = band.duration || defaultDuration;
      elapsed += duration;
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;
      const endTotal = totalMinutes + duration;
      const eh = Math.floor(endTotal / 60);
      const em = endTotal % 60;
      return {
        ...band,
        order: i + 1,
        startTime: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
        endTime: `${String(eh).padStart(2, "0")}:${String(em).padStart(2, "0")}`,
      };
    });
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--black)", color: "var(--white)" }}>
      <style>{`
        .schedule-list {
          perspective: 1200px;
        }
        .schedule-row {
          border-bottom: 1px solid rgba(255,255,255,0.08);
          transition: background 0.3s ease;
          padding: 24px 0;
          display: grid;
          grid-template-columns: 56px 120px 1fr auto;
          align-items: center;
          gap: 20px;
        }
        .schedule-row:hover {
          background: rgba(255,255,255,0.03);
        }
        .schedule-row.flip-in {
          transform-origin: top center;
          backface-visibility: hidden;
          opacity: 0;
          animation: rowFlipIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes rowFlipIn {
          0% {
            opacity: 0;
            transform: rotateX(-85deg);
          }
          60% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            transform: rotateX(0deg);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .schedule-row.flip-in {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
        @media (max-width: 768px) {
          .schedule-row {
            grid-template-columns: 40px 90px 1fr;
            gap: 12px;
            padding: 20px 0;
          }
          .schedule-genre { display: none; }
          .schedule-name { font-size: 22px !important; }
        }
        @media (max-width: 480px) {
          .schedule-name { font-size: 18px !important; }
          .schedule-time { font-size: 13px !important; }
        }
      `}</style>

      {/* NAV */}
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

      {/* HEADER */}
      <header style={{
        padding: "100px 32px 60px",
        maxWidth: 1200, margin: "0 auto",
      }}>
        <span className="mono-label" style={{
          display: "block", marginBottom: 20, color: "var(--white)", opacity: 0.3,
        }}>
          2026.07.25 — GR.ID SINGAPORE (CLUB MIAMI)
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
          {lang === "zh" ? "演出時間表" : "Schedule"}
        </h1>
        <p style={{
          fontFamily: "var(--font-mono)", fontSize: 14,
          color: "var(--white)", opacity: 0.25,
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}>
          {bands.length} ARTISTS / {lang === "zh" ? "演出順序" : "PERFORMANCE ORDER"}
        </p>
      </header>

      {/* SCHEDULE LIST */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px 120px" }}>
        <div className="schedule-list" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {schedule.map((band, i) => (
            <div
              key={band.id}
              className="schedule-row flip-in"
              style={{ animationDelay: `${i * 0.45}s` }}
            >
              {/* Order number */}
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                opacity: 0.2,
              }}>
                {String(band.order).padStart(2, "0")}
              </span>

              {/* Time */}
              <span className="schedule-time" style={{
                fontFamily: "var(--font-mono)",
                fontSize: 15,
                fontWeight: 500,
                color: band.color,
                letterSpacing: "0.5px",
              }}>
                {band.startTime} – {band.endTime}
              </span>

              {/* Name */}
              <div>
                <h2 className="schedule-name" style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: "-0.5px",
                  lineHeight: 1.2,
                  color: "var(--white)",
                  margin: 0,
                }}>
                  {band.name}
                </h2>
                <p style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 13, fontWeight: 340,
                  opacity: 0.4,
                  marginTop: 4,
                  lineHeight: 1.4,
                }}>
                  {band.members[lang]}
                </p>
              </div>

              {/* Genre */}
              <span className="schedule-genre" style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                opacity: 0.35,
              }}>
                {band.genre}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
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
