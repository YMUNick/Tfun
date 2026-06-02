import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { i18n, bands, staff, noiseSVG } from "./data";

export default function TFunFestival() {
  const [lang, setLang] = useState(() => localStorage.getItem("tfun-lang") || "zh");
  const t = i18n[lang];
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const sectionRefs = useRef({});
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    localStorage.setItem("tfun-lang", lang);
  }, [lang]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.dataset.section]));
          }
        });
      },
      { threshold: 0.2 }
    );
    Object.values(sectionRefs.current).forEach((ref) => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  // Drag-to-scroll for the horizontal strip
  const onMouseDown = useCallback((e) => {
    isDragging.current = true;
    dragStart.current = { x: e.pageX, scrollLeft: scrollRef.current.scrollLeft };
    scrollRef.current.style.cursor = "grabbing";
  }, []);
  const onMouseMove = useCallback((e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const dx = e.pageX - dragStart.current.x;
    scrollRef.current.scrollLeft = dragStart.current.scrollLeft - dx;
  }, []);
  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  }, []);

  const toggleLang = () => setLang((l) => (l === "zh" ? "en" : "zh"));
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const scrollTo = useCallback((id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  const navLinks = [
    { id: "lineup", label: t.nav.lineup },
    { id: "info", label: t.nav.info },
    { id: "credits", label: t.nav.credits },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--white)", color: "var(--black)" }}>

      {/* ─── NAV ─── */}
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: scrolled ? "rgba(255,255,255,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(0,0,0,0.08)" : "none",
          transition: "all 0.3s ease",
          padding: "16px 32px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
      >
        <button
          onClick={() => scrollTo("hero")}
          style={{
            background: "none", border: "none", cursor: "pointer", padding: 0,
            animation: "fadeInUp 0.8s ease both",
          }}
        >
          <span style={{
            fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 22,
            letterSpacing: "-0.5px",
            color: scrolled ? "var(--black)" : "var(--white)",
            transition: "color 0.3s ease",
          }}>
            T FUN
          </span>
        </button>

        <div className="nav-links-desktop" style={{ display: "flex", gap: 32, alignItems: "center", animation: "fadeInUp 0.8s ease 0.15s both" }}>
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="nav-link"
              style={{
                color: scrolled ? "var(--black)" : "var(--white)",
                background: "none", border: "none", cursor: "pointer",
                font: "inherit",
              }}
            >
              {link.label}
            </button>
          ))}
          <Link
            to="/schedule"
            className="nav-link"
            style={{
              textDecoration: "none",
              color: scrolled ? "var(--black)" : "var(--white)",
              background: "none", border: "none", cursor: "pointer",
              font: "inherit",
            }}
          >
            {t.nav.schedule}
          </Link>
          <Link
            to="/secret"
            className="pill-btn"
            style={{
              padding: "5px 16px", fontSize: 12, fontWeight: 540,
              textDecoration: "none",
              background: "rgba(255,215,0,0.15)",
              color: "#FFD700",
              borderColor: "rgba(255,215,0,0.3)",
              letterSpacing: "0.5px",
            }}
          >
            {lang === "zh" ? "隱藏嘉賓" : "Secret"}
          </Link>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, animation: "fadeInUp 0.8s ease 0.3s both" }}>
          <button
            onClick={toggleLang}
            className="pill-btn"
            aria-label={lang === "zh" ? "Switch to English" : "切換為中文"}
            style={{
              padding: "6px 20px", fontSize: 14, fontWeight: 540,
              background: scrolled ? "var(--black)" : "var(--glass-light)",
              color: "var(--white)",
              borderColor: scrolled ? "var(--black)" : "rgba(255,255,255,0.3)",
              minWidth: 56,
            }}
          >
            {t.lang}
          </button>
          <button
            className={`hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : t.menu}
            aria-expanded={menuOpen}
          >
            <span className="hamburger-line" style={{ background: scrolled ? "var(--black)" : "var(--white)" }} />
            <span className="hamburger-line" style={{ background: scrolled ? "var(--black)" : "var(--white)" }} />
            <span className="hamburger-line" style={{ background: scrolled ? "var(--black)" : "var(--white)" }} />
          </button>
        </div>
      </nav>

      {/* ─── MOBILE MENU OVERLAY ─── */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => scrollTo(link.id)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--white)", font: "inherit",
              fontSize: 32, fontWeight: 500, letterSpacing: "-0.5px",
            }}
          >
            {link.label}
          </button>
        ))}
        <Link
          to="/schedule"
          onClick={closeMenu}
          style={{
            textDecoration: "none",
            color: "var(--white)",
            font: "inherit",
            fontSize: 32, fontWeight: 500, letterSpacing: "-0.5px",
          }}
        >
          {t.nav.schedule}
        </Link>
        <Link
          to="/secret"
          onClick={closeMenu}
          style={{
            textDecoration: "none",
            color: "#FFD700",
            font: "inherit",
            fontSize: 32, fontWeight: 500, letterSpacing: "-0.5px",
          }}
        >
          {lang === "zh" ? "隱藏嘉賓" : "Secret"}
        </Link>
      </div>

      {/* ─── HERO ─── */}
      <section
        id="hero"
        style={{
          minHeight: "100vh",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "#000",
          position: "relative", overflow: "hidden",
          padding: "120px 24px 80px",
          textAlign: "center",
        }}
      >
        {/* GPU-accelerated gradient layer using transform instead of background-position */}
        <div style={{
          position: "absolute", top: 0, left: 0,
          width: "300%", height: "300%",
          background: "linear-gradient(135deg, #39FF14 0%, #FFFF00 20%, #FF69B4 40%, #BF00FF 60%, #00FFFF 80%, #FF003C 100%)",
          animation: "gradientShift 8s ease infinite",
          willChange: "transform",
          pointerEvents: "none",
        }} />
        <div className="hero-noise" style={{
          position: "absolute", inset: 0, backgroundImage: noiseSVG,
          backgroundRepeat: "repeat", opacity: 0.5, pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(0,0,0,0.25)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="mono-label" style={{
            color: "var(--white)", opacity: 0.8, marginBottom: 24,
            animation: "fadeInUp 0.8s ease both",
          }}>
            2026.07.25 — GR.ID SINGAPORE
          </div>

          <h1
            className="hero-title"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              color: "var(--white)",
              lineHeight: 0.9,
              animation: "fadeInUp 0.8s ease 0.15s both, pulseGlow 4s ease infinite",
              marginBottom: 8,
            }}
          >
            <span style={{
              display: "block",
              fontSize: "clamp(20px, 4vw, 40px)",
              letterSpacing: "4px",
              fontWeight: 400,
              opacity: 0.85,
              marginBottom: 12,
            }}>
              {t.hero.title}
            </span>
            <span style={{
              display: "block",
              fontSize: "clamp(56px, 14vw, 160px)",
              letterSpacing: "-4px",
            }}>
              {t.hero.titleShort}
            </span>
          </h1>

          <h2
            className="hero-subtitle"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(24px, 5vw, 48px)",
              fontWeight: 320,
              color: "var(--white)",
              letterSpacing: "6px",
              lineHeight: 1.2,
              animation: "fadeInUp 0.8s ease 0.3s both",
              marginBottom: 48,
            }}
          >
            {t.hero.subtitle}
          </h2>

          <div style={{ animation: "fadeInUp 0.8s ease 0.45s both" }}>
            <p style={{
              fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 340,
              color: "var(--white)", letterSpacing: "-0.14px",
              lineHeight: 1.5, marginBottom: 8, opacity: 0.9,
            }}>
              {t.hero.date}
            </p>
            <p style={{
              fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 320,
              color: "var(--white)", letterSpacing: "-0.14px",
              lineHeight: 1.5, opacity: 0.7, marginBottom: 40,
            }}>
              {t.hero.venue} — {t.hero.address}
            </p>
          </div>

        </div>

        <div style={{
          position: "absolute", bottom: 32, left: "50%",
          transform: "translateX(-50%)",
          animation: "bounce 2s ease infinite, fadeInUp 0.8s ease 0.8s both",
          opacity: 0.6,
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </section>

      {/* ─── LINEUP — Horizontal Scroll Strip ─── */}
      <section id="lineup" style={{ background: "var(--black)", overflow: "hidden" }}>
        <div
          ref={(el) => (sectionRefs.current.lineup = el)}
          data-section="lineup"
          className={`section-header ${visibleSections.has("lineup") ? "visible" : ""}`}
          style={{ textAlign: "center", padding: "80px 24px 40px" }}
        >
          <span className="mono-label" style={{ display: "block", marginBottom: 16, color: "var(--white)", opacity: 0.5 }}>
            {t.lineup.sectionLabel}
          </span>
          <h2 className="section-title" style={{ color: "var(--white)" }}>{t.lineup.sectionTitle}</h2>
        </div>

        <div style={{ position: "relative" }}>
          {/* Left arrow */}
          <button
            className="scroll-arrow scroll-arrow-left"
            onClick={() => { scrollRef.current.scrollBy({ left: -320, behavior: "smooth" }); }}
            aria-label="Scroll left"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Right arrow */}
          <button
            className="scroll-arrow scroll-arrow-right"
            onClick={() => { scrollRef.current.scrollBy({ left: 320, behavior: "smooth" }); }}
            aria-label="Scroll right"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <div
            ref={scrollRef}
            className="scroll-strip"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            {bands.map((band) => (
              <Link
                key={band.id}
                to="/lineup"
                className="scroll-card"
                draggable={false}
                onClick={(e) => { if (isDragging.current) e.preventDefault(); }}
              >
                {/* Background: photo carousel or color gradient */}
                {band.images ? (
                  <>
                    {band.images.map((img, i) => (
                      <img
                        key={img}
                        src={import.meta.env.BASE_URL + img}
                        alt={band.name}
                        draggable={false}
                        className={band.images.length > 1 ? "carousel-img" : undefined}
                        style={{
                          position: "absolute", inset: 0,
                          width: "100%", height: "100%",
                          objectFit: "cover",
                          ...(band.images.length > 1 ? { animationDelay: `${i * (6 / band.images.length)}s` } : {}),
                        }}
                      />
                    ))}
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.1) 100%)",
                      zIndex: 1,
                    }} />
                  </>
                ) : (
                  <div style={{
                    position: "absolute", inset: 0,
                    background: `linear-gradient(180deg, ${band.color}18 0%, ${band.color}50 100%)`,
                  }} />
                )}
                {/* Bottom accent line */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  height: 3, background: band.color,
                }} />

                <div className="scroll-card-inner">
                  {/* Genre pill */}
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10, fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    color: band.color,
                    marginBottom: 12,
                    display: "block",
                  }}>
                    {band.genre}
                  </span>

                  {/* Band name */}
                  <h3 style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "clamp(32px, 5vw, 44px)",
                    fontWeight: 700,
                    letterSpacing: "-0.5px",
                    lineHeight: 1.05,
                    marginBottom: 12,
                    color: "var(--white)",
                  }}>
                    {band.name}
                  </h3>

                  {/* Members preview */}
                  <p style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 13, fontWeight: 340,
                    letterSpacing: "-0.14px",
                    lineHeight: 1.5,
                    color: "var(--white)",
                    opacity: 0.5,
                  }}>
                    {band.members[lang]}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* View full lineup CTA */}
        <div style={{ textAlign: "center", padding: "48px 24px 80px" }}>
          <Link
            to="/lineup"
            className="pill-btn pill-btn-ghost"
            style={{
              padding: "12px 36px", fontSize: 15, fontWeight: 480,
              textDecoration: "none",
            }}
          >
            {t.lineup.viewAll} →
          </Link>
        </div>
      </section>

      {/* ─── POSTER ─── */}
      <section style={{
        background: "var(--black)",
        padding: "0 24px 80px",
        display: "flex",
        justifyContent: "center",
      }}>
        <div style={{ maxWidth: 900, width: "100%" }}>
          <img
            src={import.meta.env.BASE_URL + "tfunpost.png"}
            alt="T FUN 音樂祭海報"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: 12,
              boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
            }}
          />
        </div>
      </section>

      {/* ─── INFO ─── */}
      <section id="info" style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
        color: "var(--white)",
        padding: "120px 24px",
        position: "relative",
      }}>
        {/* Subtle gradient accent */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, #39FF14 0%, #FF69B4 50%, #00FFFF 100%)",
          opacity: 0.4,
        }} />
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            ref={(el) => (sectionRefs.current.info = el)}
            data-section="info"
            className={`section-header ${visibleSections.has("info") ? "visible" : ""}`}
            style={{ marginBottom: 64, textAlign: "center" }}
          >
            <span className="mono-label" style={{ display: "block", marginBottom: 16, color: "var(--white)", opacity: 0.4 }}>
              {t.info.sectionLabel}
            </span>
            <h2 className="section-title" style={{ color: "var(--white)" }}>{t.info.sectionTitle}</h2>
          </div>

          <div
            className="info-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 48,
              maxWidth: 900,
              margin: "0 auto",
            }}
          >
            {[
              {
                label: t.info.dateLabel,
                value: t.info.dateValue,
                color: "#39FF14",
                icon: (
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="3" fill="#39FF14" opacity="0.15" />
                    <rect x="3" y="4" width="18" height="18" rx="3" stroke="#39FF14" strokeWidth="1.5" />
                    <rect x="3" y="4" width="18" height="8" rx="3" fill="#39FF14" opacity="0.3" />
                    <line x1="16" y1="2" x2="16" y2="6" stroke="#39FF14" strokeWidth="2" />
                    <line x1="8" y1="2" x2="8" y2="6" stroke="#39FF14" strokeWidth="2" />
                    <text x="12" y="19" textAnchor="middle" fill="#39FF14" fontSize="7" fontWeight="700" fontFamily="system-ui">25</text>
                  </svg>
                ),
              },
              {
                label: t.info.venueLabel,
                value: t.info.venueValue,
                color: "#FF69B4",
                icon: (
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#FF69B4" opacity="0.15" stroke="#FF69B4" strokeWidth="1.5" />
                    <circle cx="12" cy="9" r="3" fill="#FF69B4" opacity="0.4" />
                    <circle cx="12" cy="9" r="1.5" fill="#FF69B4" />
                  </svg>
                ),
              },
              {
                label: t.info.addressLabel,
                value: t.info.addressValue,
                color: "#00FFFF",
                icon: (
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="8" width="16" height="14" rx="2" fill="#00FFFF" opacity="0.1" stroke="#00FFFF" strokeWidth="1.5" />
                    <path d="M4 8l8-5 8 5" stroke="#00FFFF" strokeWidth="1.5" fill="#00FFFF" opacity="0.2" />
                    <rect x="9" y="14" width="6" height="8" rx="1" fill="#00FFFF" opacity="0.3" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.label} className="info-card" style={{ textAlign: "center" }}>
                <div style={{
                  marginBottom: 20,
                  width: 64, height: 64,
                  borderRadius: 16,
                  background: `${item.color}0A`,
                  border: `1px solid ${item.color}20`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 20px",
                }}>{item.icon}</div>
                <span className="mono-label" style={{
                  display: "block", marginBottom: 12, opacity: 0.35,
                  color: "var(--white)",
                }}>
                  {item.label}
                </span>
                <p style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 18, fontWeight: 340,
                  letterSpacing: "-0.14px",
                  lineHeight: 1.5,
                  color: "var(--white)",
                }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 56 }}>
            <a
              href="https://maps.google.com/?q=GR.iD+Singapore+1+Selegie+Road+B1-06+188306"
              target="_blank"
              rel="noopener noreferrer"
              className="pill-btn pill-btn-ghost"
              style={{
                padding: "12px 36px", fontSize: 15, fontWeight: 480,
                textDecoration: "none",
              }}
            >
              {t.info.mapLink} ↗
            </a>
          </div>
        </div>
      </section>

      {/* ─── CREDITS ─── */}
      <section id="credits" style={{
        padding: "80px 24px",
        background: "#0d0d0d",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <div
            ref={(el) => (sectionRefs.current.credits = el)}
            data-section="credits"
            className={`section-header ${visibleSections.has("credits") ? "visible" : ""}`}
          >
            <span className="mono-label" style={{ display: "block", marginBottom: 16, color: "var(--white)", opacity: 0.3 }}>
              {t.credits.sectionLabel}
            </span>
            <h3 style={{
              fontFamily: "var(--font-sans)",
              fontSize: 24, fontWeight: 400,
              letterSpacing: "-0.26px",
              marginBottom: 32,
              color: "var(--white)",
            }}>
              {t.credits.sectionTitle}
            </h3>
          </div>

          <div
            className="credits-list"
            style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: 40,
            }}
          >
            {staff.map((s) => (
              <div key={s.name} style={{ textAlign: "center" }}>
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 13, fontWeight: 500,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  opacity: 0.4,
                  color: "var(--white)",
                  display: "block",
                  marginBottom: 8,
                }}>
                  {lang === "zh" ? s.role : s.roleEn}
                </span>
                <span style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 28, fontWeight: 500,
                  letterSpacing: "-0.5px",
                  color: "var(--white)",
                  opacity: 0.8,
                }}>
                  {s.name}
                </span>
              </div>
            ))}
          </div>
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
