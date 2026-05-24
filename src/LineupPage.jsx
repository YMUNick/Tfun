import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { i18n, bands } from "./data";

export default function LineupPage() {
  const [lang, setLang] = useState(() => localStorage.getItem("tfun-lang") || "zh");
  const t = i18n[lang];
  const [visibleCards, setVisibleCards] = useState(new Set());
  const cardRefs = useRef([]);

  useEffect(() => {
    localStorage.setItem("tfun-lang", lang);
  }, [lang]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) => new Set([...prev, entry.target.dataset.id]));
          }
        });
      },
      { threshold: 0.15 }
    );
    cardRefs.current.forEach((ref) => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  const toggleLang = () => setLang((l) => (l === "zh" ? "en" : "zh"));

  return (
    <div style={{ minHeight: "100vh", background: "var(--white)", color: "var(--black)" }}>

      {/* ─── NAV ─── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        padding: "16px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--black)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span style={{
            fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 22,
            letterSpacing: "-0.5px", color: "var(--black)",
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
            background: "var(--black)", color: "var(--white)",
            borderColor: "var(--black)", minWidth: 56,
          }}
        >
          {t.lang}
        </button>
      </nav>

      {/* ─── HEADER ─── */}
      <header style={{
        background: "var(--black)", color: "var(--white)",
        padding: "80px 24px",
        textAlign: "center",
      }}>
        <span className="mono-label" style={{
          display: "block", marginBottom: 16, color: "var(--white)", opacity: 0.5,
        }}>
          {t.lineup.sectionLabel}
        </span>
        <h1 className="section-title" style={{ color: "var(--white)" }}>
          {t.lineup.sectionTitle}
        </h1>
        <p style={{
          fontFamily: "var(--font-mono)", fontSize: 13,
          color: "var(--white)", opacity: 0.35,
          marginTop: 16, letterSpacing: "1px",
        }}>
          {bands.length} ARTISTS
        </p>
      </header>

      {/* ─── BAND CARDS ─── */}
      <section style={{
        padding: "64px 24px 120px",
        maxWidth: 1200, margin: "0 auto",
      }}>
        <div
          className="bands-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 24,
          }}
        >
          {bands.map((band, i) => (
            <div
              key={band.id}
              ref={(el) => (cardRefs.current[i] = el)}
              data-id={String(band.id)}
              className={`band-card ${visibleCards.has(String(band.id)) ? "visible" : ""}`}
              style={{
                position: "relative",
                background: "var(--white)",
                border: "1.5px solid var(--black)",
                borderRadius: 8,
                padding: 0,
                overflow: "hidden",
                transitionDelay: `${i * 0.08}s`,
                cursor: "default",
              }}
            >
              <div
                className="card-glow"
                style={{
                  background: `linear-gradient(135deg, ${band.color}44, transparent, ${band.color}22)`,
                }}
              />

              <div style={{
                height: 4, background: band.color, position: "relative", zIndex: 1,
              }} />

              <div style={{ padding: "24px 28px", position: "relative", zIndex: 1 }}>
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11, fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  background: "var(--black)",
                  color: "var(--white)",
                  padding: "3px 10px",
                  borderRadius: 50,
                  display: "inline-block",
                  marginBottom: 16,
                }}>
                  {band.genre}
                </span>

                <h3 style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "clamp(28px, 4vw, 36px)",
                  fontWeight: 700,
                  letterSpacing: "-0.5px",
                  lineHeight: 1.1,
                  marginBottom: 16,
                  color: "var(--black)",
                }}>
                  {band.name}
                </h3>

                <p style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 14, fontWeight: 340,
                  letterSpacing: "-0.14px",
                  lineHeight: 1.6,
                  color: "var(--black)",
                  opacity: 0.65,
                  marginBottom: band.songs.length > 0 ? 20 : 0,
                }}>
                  {band.members[lang]}
                </p>

                {band.songs.length > 0 && (
                  <div>
                    <span className="mono-label" style={{
                      fontSize: 11, display: "block", marginBottom: 8,
                      letterSpacing: "1.5px",
                    }}>
                      {t.lineup.songs}
                    </span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {band.songs.map((song, si) => (
                        <span
                          key={si}
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: 12, fontWeight: 450,
                            letterSpacing: "-0.1px",
                            padding: "4px 12px",
                            borderRadius: 50,
                            border: "1px solid rgba(0,0,0,0.15)",
                            background: "rgba(0,0,0,0.03)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {song}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{
        background: "var(--black)", color: "var(--white)",
        padding: "32px 24px", textAlign: "center",
      }}>
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12, fontWeight: 400,
          letterSpacing: "0.6px",
          textTransform: "uppercase",
          opacity: 0.35,
        }}>
          TAIWANESE FUN (T FUN) MUSIC FEST — 2026
        </p>
      </footer>
    </div>
  );
}
