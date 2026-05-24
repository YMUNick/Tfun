import { useState, useEffect, useRef, useCallback } from "react";

// ─── i18n translations ───
const i18n = {
  zh: {
    nav: { lineup: "演出陣容", info: "活動資訊", credits: "工作人員" },
    hero: {
      title: "TAIWANESE FUN",
      titleShort: "T FUN",
      subtitle: "音樂祭",
      date: "2026 / 07 / 25（六）14:00 開始",
      venue: "GR.iD Singapore",
      address: "1 Selegie Road, B1-06, 188306",
      cta: "查看陣容",
    },
    lineup: {
      sectionLabel: "LINEUP",
      sectionTitle: "演出陣容",
      members: "成員",
      songs: "演出曲目",
    },
    info: {
      sectionLabel: "INFO",
      sectionTitle: "活動資訊",
      dateLabel: "日期",
      dateValue: "2026 年 7 月 25 日（週六）14:00 開始",
      venueLabel: "地點",
      venueValue: "GR.iD Singapore",
      addressLabel: "地址",
      addressValue: "1 Selegie Road, B1-06, 188306",
      mapLink: "在 Google Maps 中開啟",
    },
    credits: {
      sectionLabel: "CREDITS",
      sectionTitle: "工作人員",
    },
    menu: "選單",
    lang: "EN",
  },
  en: {
    nav: { lineup: "Lineup", info: "Info", credits: "Credits" },
    hero: {
      title: "TAIWANESE FUN",
      titleShort: "T FUN",
      subtitle: "MUSIC FEST",
      date: "2026 / 07 / 25 (SAT) from 2:00 PM",
      venue: "GR.iD Singapore",
      address: "1 Selegie Road, B1-06, 188306",
      cta: "View Lineup",
    },
    lineup: {
      sectionLabel: "LINEUP",
      sectionTitle: "Performing Artists",
      members: "Members",
      songs: "Setlist",
    },
    info: {
      sectionLabel: "INFO",
      sectionTitle: "Event Info",
      dateLabel: "Date",
      dateValue: "July 25, 2026 (Saturday) from 2:00 PM",
      venueLabel: "Venue",
      venueValue: "GR.iD Singapore",
      addressLabel: "Address",
      addressValue: "1 Selegie Road, B1-06, 188306",
      mapLink: "Open in Google Maps",
    },
    credits: {
      sectionLabel: "CREDITS",
      sectionTitle: "Staff",
    },
    menu: "Menu",
    lang: "中",
  },
};

// ─── Band data ───
const bands = [
  {
    id: 1,
    name: "Vivian",
    genre: "M-POP / J-ROCK",
    members: {
      zh: "Vocal: Vivian ／ Bass: Nick ／ Guitar: Kaho ／ Drum: Vivian",
      en: "Vocal: Vivian / Bass: Nick / Guitar: Kaho / Drum: Vivian",
    },
    songs: ["浪子回頭", "灌籃高手 - 好想大聲說喜歡你", "Without You"],
    color: "#39FF14",
  },
  {
    id: 2,
    name: "Jamie",
    genre: "MANDOPOP",
    members: {
      zh: "Vocal: Jamie ／ Guitar: Darren ／ Drum: Aries",
      en: "Vocal: Jamie / Guitar: Darren / Drum: Aries",
    },
    songs: [],
    color: "#FFFF00",
  },
  {
    id: 3,
    name: "Frida",
    genre: "MANDOPOP",
    members: {
      zh: "Vocal: Frida ／ Bass: Rui-Yi ／ Guitar: 鎮宇",
      en: "Vocal: Frida / Bass: Rui-Yi / Guitar: Zhen-Yu",
    },
    songs: [],
    color: "#FF69B4",
  },
  {
    id: 4,
    name: "毓峯 x8",
    genre: "DANCE",
    members: {
      zh: "Lynn / Sun / Dio — 熱舞社",
      en: "Lynn / Sun / Dio — Dance Crew",
    },
    songs: [],
    color: "#BF00FF",
  },
  {
    id: 5,
    name: "Swenson x5",
    genre: "STRINGS",
    members: {
      zh: "小提琴五重奏",
      en: "Violin Quintet",
    },
    songs: ["卡農 (Canon)"],
    color: "#00FFFF",
  },
  {
    id: 6,
    name: "PASH",
    genre: "ORIGINAL",
    members: {
      zh: "Vocal: PASH ／ Guitar: Kaho",
      en: "Vocal: PASH / Guitar: Kaho",
    },
    songs: [
      "我是一隻鹹魚嗎？ Am I a Salted Fish?",
      "有時 Sometimes",
      "揮霍 Squandering",
    ],
    color: "#FF6600",
  },
  {
    id: 7,
    name: "Yanrong",
    genre: "MANDOPOP",
    members: {
      zh: "Vocal: Yanrong ／ Guitar: Brian ／ Bass: Jason",
      en: "Vocal: Yanrong / Guitar: Brian / Bass: Jason",
    },
    songs: ["A-Lin - 摯友", "理想混蛋 - 不是因為天氣晴朗才愛你", "F.I.R - 月牙灣"],
    color: "#39FF14",
  },
  {
    id: 8,
    name: "Dean",
    genre: "PUNK / POP",
    members: {
      zh: "Vocal: Dean（暫代）／ Guitar: Dean ／ Bass: Darren ／ Drum: Perry",
      en: "Vocal: Dean (temp) / Guitar: Dean / Bass: Darren / Drum: Perry",
    },
    songs: [
      "透明雜誌 - 時速160公里的吉他、BASS和鼓",
      "拍謝少年 - 歹勢中年",
      "Hi Standard - Dear My Friend",
    ],
    color: "#FF003C",
  },
];

// ─── Staff ───
const staff = [{ name: "Nick" }];

// ─── Noise texture SVG for grain overlay ───
const noiseSVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`;

export default function TFunFestival() {
  const [lang, setLang] = useState("zh");
  const t = i18n[lang];
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [visibleCards, setVisibleCards] = useState(new Set());
  const [visibleSections, setVisibleSections] = useState(new Set());
  const cardRefs = useRef([]);
  const sectionRefs = useRef({});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // IntersectionObserver for band cards
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

  // IntersectionObserver for section titles
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

  const toggleLang = () => setLang((l) => (l === "zh" ? "en" : "zh"));

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const navLinks = [
    { href: "#lineup", label: t.nav.lineup },
    { href: "#info", label: t.nav.info },
    { href: "#credits", label: t.nav.credits },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--white)", color: "var(--black)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --black: #000000;
          --white: #ffffff;
          --glass-dark: rgba(0,0,0,0.08);
          --glass-light: rgba(255,255,255,0.16);
          --font-sans: 'Space Grotesk', system-ui, -apple-system, sans-serif;
          --font-mono: 'JetBrains Mono', 'SF Mono', monospace;
        }

        html { scroll-behavior: smooth; }
        body { font-family: var(--font-sans); background: var(--white); color: var(--black); overflow-x: hidden; }

        .pill-btn {
          display: inline-flex; align-items: center; justify-content: center;
          border-radius: 50px; border: 2px solid var(--black);
          font-family: var(--font-sans); font-weight: 480;
          letter-spacing: -0.14px; cursor: pointer;
          transition: all 0.2s ease;
        }
        .pill-btn:focus-visible {
          outline: 2px dashed var(--black);
          outline-offset: 3px;
        }
        .pill-btn-ghost {
          background: var(--glass-light); color: var(--white); border-color: rgba(255,255,255,0.3);
        }
        .pill-btn-ghost:hover { background: rgba(255,255,255,0.25); }

        .mono-label {
          font-family: var(--font-mono);
          font-size: 14px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 2px;
          opacity: 0.6;
        }

        .section-title {
          font-family: var(--font-sans);
          font-size: clamp(36px, 6vw, 64px);
          font-weight: 400;
          letter-spacing: -0.96px;
          line-height: 1.1;
        }

        .section-header {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .section-header.visible {
          opacity: 1;
          transform: translateY(0);
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulseGlow {
          0%, 100% { text-shadow: 0 0 20px rgba(57,255,20,0.3), 0 0 60px rgba(255,0,60,0.1); }
          50% { text-shadow: 0 0 40px rgba(57,255,20,0.5), 0 0 80px rgba(255,105,180,0.2); }
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); }
          40% { transform: translateY(-8px) translateX(-50%); }
          60% { transform: translateY(-4px) translateX(-50%); }
        }

        .band-card {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .band-card.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .band-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 12px 32px rgba(0,0,0,0.12);
        }
        .band-card:hover .card-glow {
          opacity: 1;
        }
        .card-glow {
          position: absolute; inset: -2px; border-radius: 10px;
          opacity: 0; transition: opacity 0.4s ease;
          pointer-events: none; z-index: 0;
        }

        .nav-link {
          color: var(--black); text-decoration: none;
          font-family: var(--font-sans); font-weight: 450;
          font-size: 15px; letter-spacing: -0.14px;
          position: relative; padding: 4px 0;
        }
        .nav-link::after {
          content: ''; position: absolute; bottom: 0; left: 0;
          width: 0; height: 1px; background: var(--black);
          transition: width 0.3s ease;
        }
        .nav-link:hover::after { width: 100%; }
        .nav-link:focus-visible { outline: 2px dashed var(--black); outline-offset: 3px; }

        .info-card {
          transition: transform 0.3s ease;
        }
        .info-card:hover {
          transform: translateY(-4px);
        }

        /* ─── Mobile menu ─── */
        .hamburger {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          z-index: 200;
        }
        .hamburger-line {
          display: block;
          width: 24px;
          height: 2px;
          margin: 5px 0;
          transition: all 0.3s ease;
        }
        .hamburger.open .hamburger-line:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }
        .hamburger.open .hamburger-line:nth-child(2) {
          opacity: 0;
        }
        .hamburger.open .hamburger-line:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }

        .mobile-menu {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.97);
          z-index: 150;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 40px;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.35s ease;
        }
        .mobile-menu.open {
          opacity: 1;
          pointer-events: all;
        }
        .mobile-menu a {
          color: var(--white);
          text-decoration: none;
          font-family: var(--font-sans);
          font-size: 32px;
          font-weight: 500;
          letter-spacing: -0.5px;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .mobile-menu.open a {
          opacity: 1;
          transform: translateY(0);
        }
        .mobile-menu.open a:nth-child(1) { transition-delay: 0.1s; }
        .mobile-menu.open a:nth-child(2) { transition-delay: 0.18s; }
        .mobile-menu.open a:nth-child(3) { transition-delay: 0.26s; }

        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .hamburger { display: block; }
          .hero-title { font-size: 56px !important; }
          .hero-subtitle { font-size: 28px !important; }
          .bands-grid { grid-template-columns: 1fr !important; }
          .info-grid { grid-template-columns: 1fr !important; }
          .credits-list { flex-direction: column !important; align-items: center !important; }
        }
        @media (max-width: 480px) {
          .hero-title { font-size: 42px !important; }
          .hero-subtitle { font-size: 22px !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          html { scroll-behavior: auto; }
          .band-card, .section-header { opacity: 1; transform: none; }
        }
      `}</style>

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
        {/* grain overlay */}
        <div style={{
          position: "absolute", inset: 0, backgroundImage: noiseSVG,
          backgroundRepeat: "repeat", opacity: 0.5, pointerEvents: "none",
        }} />
        {/* dark overlay for readability */}
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

        {/* Scroll indicator */}
        <div style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          animation: "bounce 2s ease infinite, fadeInUp 0.8s ease 0.8s both",
          opacity: 0.6,
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </section>

      {/* ─── LINEUP ─── */}
      <section id="lineup" style={{
        padding: "120px 24px",
        maxWidth: 1200, margin: "0 auto",
      }}>
        <div
          ref={(el) => (sectionRefs.current.lineup = el)}
          data-section="lineup"
          className={`section-header ${visibleSections.has("lineup") ? "visible" : ""}`}
          style={{ marginBottom: 64, textAlign: "center" }}
        >
          <span className="mono-label" style={{ display: "block", marginBottom: 16 }}>
            {t.lineup.sectionLabel}
          </span>
          <h2 className="section-title">{t.lineup.sectionTitle}</h2>
        </div>

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

      {/* ─── INFO ─── */}
      <section id="info" style={{
        background: "var(--black)", color: "var(--white)",
        padding: "120px 24px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            ref={(el) => (sectionRefs.current.info = el)}
            data-section="info"
            className={`section-header ${visibleSections.has("info") ? "visible" : ""}`}
            style={{ marginBottom: 64, textAlign: "center" }}
          >
            <span className="mono-label" style={{
              display: "block", marginBottom: 16, color: "var(--white)", opacity: 0.5,
            }}>
              {t.info.sectionLabel}
            </span>
            <h2 className="section-title" style={{ color: "var(--white)" }}>
              {t.info.sectionTitle}
            </h2>
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
                <div style={{ marginBottom: 16, color: "var(--white)", opacity: 0.5 }}>{item.icon}</div>
                <span className="mono-label" style={{
                  display: "block", marginBottom: 12,
                  color: "var(--white)", opacity: 0.4,
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
        borderTop: "1px solid rgba(0,0,0,0.08)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <div
            ref={(el) => (sectionRefs.current.credits = el)}
            data-section="credits"
            className={`section-header ${visibleSections.has("credits") ? "visible" : ""}`}
          >
            <span className="mono-label" style={{
              display: "block", marginBottom: 16,
            }}>
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
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "12px 24px",
            }}
          >
            {staff.map((s) => (
              <span
                key={s.name}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 14,
                  fontWeight: 400,
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
        padding: "32px 24px",
        textAlign: "center",
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
