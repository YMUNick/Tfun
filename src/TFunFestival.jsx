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

  const navLinks = [
    { href: "#lineup", label: t.nav.lineup, isAnchor: true },
    { href: "#info", label: t.nav.info, isAnchor: true },
    { href: "#credits", label: t.nav.credits, isAnchor: true },
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
        <a href="#hero" style={{ textDecoration: "none" }}>
          <span style={{
            fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 22,
            letterSpacing: "-0.5px",
            color: scrolled ? "var(--black)" : "var(--white)",
            transition: "color 0.3s ease",
          }}>
            T FUN
          </span>
        </a>

        <div className="nav-links-desktop" style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link"
              style={{ color: scrolled ? "var(--black)" : "var(--white)" }}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
          <a key={link.href} href={link.href} onClick={closeMenu}>
            {link.label}
          </a>
        ))}
      </div>

      {/* ─── HERO ─── */}
      <section
        id="hero"
        style={{
          minHeight: "100vh",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "linear-gradient(135deg, #39FF14 0%, #FFFF00 20%, #FF69B4 40%, #BF00FF 60%, #00FFFF 80%, #FF003C 100%)",
          backgroundSize: "300% 300%",
          animation: "gradientShift 8s ease infinite",
          position: "relative", overflow: "hidden",
          padding: "120px 24px 80px",
          textAlign: "center",
        }}
      >
        <div style={{
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

          <a
            href="#lineup"
            className="pill-btn pill-btn-ghost"
            style={{
              padding: "14px 40px", fontSize: 16, fontWeight: 480,
              textDecoration: "none",
              animation: "fadeInUp 0.8s ease 0.6s both",
            }}
          >
            {t.hero.cta}
          </a>
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
              {/* Color gradient background */}
              <div style={{
                position: "absolute", inset: 0,
                background: `linear-gradient(180deg, ${band.color}18 0%, ${band.color}50 100%)`,
              }} />
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

      {/* ─── INFO ─── */}
      <section id="info" style={{
        background: "var(--white)", color: "var(--black)",
        padding: "120px 24px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            ref={(el) => (sectionRefs.current.info = el)}
            data-section="info"
            className={`section-header ${visibleSections.has("info") ? "visible" : ""}`}
            style={{ marginBottom: 64, textAlign: "center" }}
          >
            <span className="mono-label" style={{ display: "block", marginBottom: 16 }}>
              {t.info.sectionLabel}
            </span>
            <h2 className="section-title">{t.info.sectionTitle}</h2>
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
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                    <circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="none" />
                  </svg>
                ),
              },
              {
                label: t.info.venueLabel,
                value: t.info.venueValue,
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                ),
              },
              {
                label: t.info.addressLabel,
                value: t.info.addressValue,
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21h18" />
                    <path d="M5 21V7l7-4 7 4v14" />
                    <rect x="9" y="13" width="6" height="8" />
                    <line x1="12" y1="9" x2="12" y2="11" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.label} className="info-card" style={{ textAlign: "center" }}>
                <div style={{ marginBottom: 16, opacity: 0.4 }}>{item.icon}</div>
                <span className="mono-label" style={{
                  display: "block", marginBottom: 12, opacity: 0.4,
                }}>
                  {item.label}
                </span>
                <p style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 18, fontWeight: 340,
                  letterSpacing: "-0.14px",
                  lineHeight: 1.5,
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
              className="pill-btn pill-btn-dark"
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
        borderTop: "1px solid rgba(0,0,0,0.08)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <div
            ref={(el) => (sectionRefs.current.credits = el)}
            data-section="credits"
            className={`section-header ${visibleSections.has("credits") ? "visible" : ""}`}
          >
            <span className="mono-label" style={{ display: "block", marginBottom: 16 }}>
              {t.credits.sectionLabel}
            </span>
            <h3 style={{
              fontFamily: "var(--font-sans)",
              fontSize: 24, fontWeight: 400,
              letterSpacing: "-0.26px",
              marginBottom: 32,
            }}>
              {t.credits.sectionTitle}
            </h3>
          </div>

          <div
            className="credits-list"
            style={{
              display: "flex", flexWrap: "wrap",
              justifyContent: "center", gap: "12px 24px",
            }}
          >
            {staff.map((s) => (
              <span
                key={s.name}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 14, fontWeight: 400,
                  letterSpacing: "0.6px",
                  textTransform: "uppercase",
                  opacity: 0.5,
                }}
              >
                {s.name}
              </span>
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
