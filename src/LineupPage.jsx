import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { i18n, bands } from "./data";

export default function LineupPage() {
  const [lang, setLang] = useState(() => localStorage.getItem("tfun-lang") || "zh");
  const t = i18n[lang];
  const [searchParams] = useSearchParams();
  const targetBandId = searchParams.get("band") ? Number(searchParams.get("band")) : null;
  const [expandedId, setExpandedId] = useState(targetBandId);
  const bandRefs = useRef({});

  useEffect(() => {
    localStorage.setItem("tfun-lang", lang);
  }, [lang]);

  useEffect(() => {
    if (targetBandId && bandRefs.current[targetBandId]) {
      setTimeout(() => {
        bandRefs.current[targetBandId].scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [targetBandId]);

  const toggleLang = () => setLang((l) => (l === "zh" ? "en" : "zh"));

  return (
    <div style={{ minHeight: "100vh", background: "var(--black)", color: "var(--white)", overflowX: "hidden" }}>
      <style>{`
        .lineup-page { box-sizing: border-box; }
        .lineup-page *, .lineup-page *::before, .lineup-page *::after { box-sizing: border-box; }
        .lineup-artist {
          border-bottom: 1px solid rgba(255,255,255,0.08);
          transition: background 0.3s ease;
          cursor: pointer;
        }
        .lineup-artist:hover {
          background: rgba(255,255,255,0.03);
        }
        .lineup-artist-name {
          font-family: var(--font-sans);
          font-weight: 700;
          letter-spacing: -1px;
          line-height: 1;
          transition: color 0.3s ease;
          margin: 0;
          overflow-wrap: break-word;
          word-break: break-word;
        }
        .lineup-artist:hover .lineup-artist-name {
          color: var(--artist-color, #39FF14);
        }
        .lineup-genre {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          opacity: 0.4;
          transition: opacity 0.3s ease;
          flex-shrink: 0;
        }
        .lineup-artist:hover .lineup-genre {
          opacity: 0.7;
        }
        .lineup-index {
          font-family: var(--font-mono);
          font-size: 13px;
          opacity: 0.2;
          min-width: 28px;
          flex-shrink: 0;
        }
        .lineup-photos-scroll {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 8px;
          scroll-snap-type: x mandatory;
        }
        .lineup-photos-scroll::-webkit-scrollbar { height: 4px; }
        .lineup-photos-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 2px; }
        .lineup-photos-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }
        .lineup-photo-card {
          flex: 0 0 auto;
          scroll-snap-align: start;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
        }
        .lineup-photo-card img {
          height: 280px;
          width: auto;
          max-width: none;
          display: block;
        }
        .lineup-detail-content {
          padding: 0 0 32px 0;
        }
        .lineup-members-text {
          font-family: var(--font-sans);
          font-size: 15px;
          font-weight: 340;
          letter-spacing: -0.14px;
          line-height: 1.7;
          opacity: 0.7;
          overflow-wrap: break-word;
          word-break: break-word;
        }
        @media (max-width: 768px) {
          .lineup-artist-name { font-size: 28px !important; letter-spacing: -0.5px; }
          .lineup-row { flex-direction: column; gap: 4px !important; }
          .lineup-genre { margin-top: 2px; }
          .lineup-index { min-width: 24px; font-size: 12px; }
          .lineup-detail-grid { display: block !important; }
          .lineup-detail-spacer { display: none !important; }
          .lineup-photo-card img {
            height: auto !important;
            width: 75vw !important;
            max-height: 360px;
            object-fit: contain;
          }
        }
        @media (max-width: 480px) {
          .lineup-artist-name { font-size: 24px !important; }
          .lineup-photo-card img {
            width: 80vw !important;
            max-height: 300px;
          }
        }
      `}</style>

      {/* NAV */}
      <nav className="lineup-page" style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(0,0,0,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "16px 24px",
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
        padding: "80px 24px 48px",
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
          {t.lineup.sectionTitle}
        </h1>
        <p style={{
          fontFamily: "var(--font-mono)", fontSize: 14,
          color: "var(--white)", opacity: 0.25,
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}>
          {bands.length} ARTISTS / GROUPS
        </p>
      </header>

      {/* ARTIST LIST */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 120px" }}>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {bands.map((band, i) => {
            const isOpen = expandedId === band.id;
            return (
              <div
                key={band.id}
                ref={(el) => (bandRefs.current[band.id] = el)}
                className="lineup-artist"
                style={{ "--artist-color": band.color }}
              >
                {/* Main row - clickable */}
                <div
                  className="lineup-row"
                  onClick={() => setExpandedId(isOpen ? null : band.id)}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 16,
                    padding: "24px 0",
                  }}
                >
                  <span className="lineup-index">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2
                      className="lineup-artist-name"
                      style={{
                        fontSize: "clamp(28px, 6vw, 64px)",
                        color: isOpen ? band.color : "var(--white)",
                      }}
                    >
                      {band.name}
                    </h2>
                  </div>
                  <span className="lineup-genre">{band.genre}</span>
                  <svg
                    width="20" height="20" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"
                    style={{
                      opacity: 0.3,
                      transition: "transform 0.3s ease",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      flexShrink: 0,
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>

                {/* Detail - conditionally rendered, no overflow hidden */}
                {isOpen && (
                  <div className="lineup-detail-content">
                    <div className="lineup-detail-grid" style={{
                      display: "grid",
                      gridTemplateColumns: "28px 1fr",
                      gap: "0 16px",
                    }}>
                      <div className="lineup-detail-spacer" />
                      <div>
                        {/* Color accent bar */}
                        <div style={{
                          width: 40, height: 3,
                          background: band.color,
                          marginBottom: 20,
                          borderRadius: 2,
                        }} />

                        {/* Members */}
                        <div style={{ marginBottom: band.songs.length > 0 ? 24 : 0 }}>
                          <span style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 11, fontWeight: 500,
                            textTransform: "uppercase",
                            letterSpacing: "1.5px",
                            opacity: 0.35,
                            display: "block",
                            marginBottom: 8,
                          }}>
                            {t.lineup.members}
                          </span>
                          <p className="lineup-members-text">
                            {band.members[lang]}
                          </p>
                        </div>

                        {/* Songs */}
                        {band.songs.length > 0 && (
                          <div>
                            <span style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: 11, fontWeight: 500,
                              textTransform: "uppercase",
                              letterSpacing: "1.5px",
                              opacity: 0.35,
                              display: "block",
                              marginBottom: 10,
                            }}>
                              {t.lineup.songs}
                            </span>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                              {band.songs.map((song, si) => (
                                <span
                                  key={si}
                                  style={{
                                    fontFamily: "var(--font-sans)",
                                    fontSize: 13, fontWeight: 450,
                                    letterSpacing: "-0.1px",
                                    padding: "6px 14px",
                                    borderRadius: 50,
                                    border: `1px solid ${band.color}40`,
                                    background: `${band.color}10`,
                                    color: "var(--white)",
                                    opacity: 0.8,
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

                    {/* Photos - outside the grid, full width */}
                    {band.images && band.images.length > 0 && (
                      <div style={{ marginTop: 24 }}>
                        <div className="lineup-photos-scroll">
                          {band.images.map((img) => (
                            <div key={img} className="lineup-photo-card">
                              <img
                                src={import.meta.env.BASE_URL + img}
                                alt={band.name}
                              />
                              <div style={{
                                position: "absolute", inset: 0,
                                border: `1px solid ${band.color}30`,
                                borderRadius: 8,
                                pointerEvents: "none",
                              }} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
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
