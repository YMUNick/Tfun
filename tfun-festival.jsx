import { useState, useEffect, useRef } from "react";

// ─── i18n translations ───
const i18n = {
  zh: {
    nav: { lineup: "演出陣容", info: "活動資訊", credits: "工作人員" },
    hero: {
      title: "T FUN",
      subtitle: "音樂祭",
      date: "2026 / 07 / 25（六）",
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
      dateValue: "2026 年 7 月 25 日（週六）",
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
    lang: "EN",
  },
  en: {
    nav: { lineup: "Lineup", info: "Info", credits: "Credits" },
    hero: {
      title: "T FUN",
      subtitle: "MUSIC FEST",
      date: "2026 / 07 / 25 (SAT)",
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
      dateValue: "July 25, 2026 (Saturday)",
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
    lang: "中",
  },
};

// ─── Band data from the PDF ───
const bands = [
  {
    id: 1,
    name: "Vivian",
    genre: "M-POP / J-ROCK",
    leader: "Vivian",
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
    leader: "Jamie",
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
    leader: "Frida",
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
    leader: "毓峯",
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
    leader: "Swenson",
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
    leader: "PASH",
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
    leader: "Yanrong",
    members: {
      zh: "Vocal: Yanrong ／ Guitar: Brian ／ Bass: Jason",
      en: "Vocal: Yanrong / Guitar: Brian / Bass: Jason",
    },
    songs: ["A-Lin - 摯友", "理想混蛋 - 不是因為天氣晴朗才愛你", "F.I.R - 月牙灣"],
    color: "#39FF14",
  },
  {
    id: 8,
    name: "Beyblade X",
    genre: "PUNK / POP",
    leader: "Dean",
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

// ─── Staff data with filter logic ───
const staffRaw = [
  { name: "Vivian", role: "" },
  { name: "Khe", role: "" },
  { name: "M", role: "" },
  { name: "S", role: "" },
  { name: "Pam Pam", role: "" },
  { name: "PASH", role: "" },
  { name: "行", role: "" },
];
// Filter: if any value contains "X", hide that staff member
const staff = staffRaw.filter(
  (s) => !Object.values(s).some((v) => typeof v === "string" && v === "X")
);

// ─── Noise texture SVG for grain overlay ───
const noiseSVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`;

export default function TFunFestival() {
  const [lang, setLang] = useState("zh");
  const t = i18n[lang];
  const [scrolled, setScrolled] = useState(false);
  const [visibleCards, setVisibleCards] = useState(new Set());
  const cardRefs = useRef([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
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
    <div style={styles.root}>
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
        .pill-btn-dark {
          background: var(--black); color: var(--white); border-color: var(--black);
        }
        .pill-btn-dark:hover { background: #222; }
        .pill-btn-light {
          background: var(--white); color: var(--black); border-color: var(--black);
        }
        .pill-btn-light:hover { background: #f5f5f5; }
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

        .band-card {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .band-card.visible {
          opacity: 1;
          transform: translateY(0);
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

        @media (max-width: 768px) {
          .nav-links { display: none !important; }
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

        <div className="nav-links" style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {[
            { href: "#lineup", label: t.nav.lineup },
            { href: "#info", label: t.nav.info },
            { href: "#credits", label: t.nav.credits },
          ].map((link) => (
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

        <button
          onClick={toggleLang}
          className="pill-btn"
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
      </nav>

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
              fontSize: "clamp(56px, 14vw, 160px)",
              fontWeight: 700,
              color: "var(--white)",
              letterSpacing: "-4px",
              lineHeight: 0.9,
              animation: "fadeInUp 0.8s ease 0.15s both, pulseGlow 4s ease infinite",
              marginBottom: 8,
            }}
          >
            {t.hero.title}
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
      </section>

      {/* ─── LINEUP ─── */}
      <section id="lineup" style={{
        padding: "120px 24px",
        maxWidth: 1200, margin: "0 auto",
      }}>
        <div style={{ marginBottom: 64, textAlign: "center" }}>
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
              }}
            >
              {/* Color glow on hover */}
              <div
                className="card-glow"
                style={{
                  background: `linear-gradient(135deg, ${band.color}44, transparent, ${band.color}22)`,
                }}
              />

              {/* Color accent bar */}
              <div style={{
                height: 4, background: band.color, position: "relative", zIndex: 1,
              }} />

              <div style={{ padding: "24px 28px", position: "relative", zIndex: 1 }}>
                {/* Genre tag */}
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

                {/* Band name */}
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

                {/* Members */}
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

                {/* Songs */}
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
          <div style={{ marginBottom: 64, textAlign: "center" }}>
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
              { label: t.info.dateLabel, value: t.info.dateValue, icon: "📅" },
              { label: t.info.venueLabel, value: t.info.venueValue, icon: "📍" },
              { label: t.info.addressLabel, value: t.info.addressValue, icon: "🏢" },
            ].map((item) => (
              <div key={item.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{item.icon}</div>
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
          T FUN MUSIC FEST — 2026
        </p>
      </footer>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "var(--white)",
    color: "var(--black)",
  },
};
