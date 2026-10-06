import { useState, useEffect, useRef } from "react";

// ─── Cinematic intro overlay ───
// Sequence: full black → group photo fades in centered → photo slowly drifts
// upward & shrinks → the dedication lines fade in one after another → the whole
// overlay fades out to reveal the home page.
//
// Plays once on every page load / reload (skipped under prefers-reduced-motion).
// After the intro (or Skip), a short notice popup shows for ~2s before the
// home page is revealed. The notice still shows under prefers-reduced-motion.

// Timeline (seconds). Keep in sync with the @keyframes in styles.css.
const LINE_DELAYS = [5.0, 7.2, 9.4, 13.0, 14.6]; // line1..line4 + signature
const NOTICE_AT = 16.8;     // intro ends, notice popup appears
const NOTICE_HOLD = 2.0;    // how long the notice stays fully visible
const NOTICE_FADE = 0.5;    // notice overlay fade-out (match .tfun-notice transition)

const lines = [
  "給：所有參與活動的 T Fun 工作人員與表演者，還有來支持的朋友們。",
  "感謝大家的參與，沒有大家的熱情與努力，這個活動不會成功。",
  "希望大家都能享受音樂與舞蹈帶來的純粹與感動。不論多麼疲憊，在這個城市多麼迷惘，希望這個活動帶來的一點小小的喜悅，能給我們更多走下去的動力。",
  "This is for all of you，每一個在努力生活的我們。",
];

export default function Intro() {
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // "intro" → "notice" → "notice-fading" → "done"
  const [phase, setPhase] = useState(prefersReduced ? "notice" : "intro");
  const timers = useRef([]);

  const later = (fn, sec) => timers.current.push(setTimeout(fn, sec * 1000));

  const finish = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPhase("notice");
  };

  // Lock page scroll for the whole overlay sequence.
  const active = phase !== "done";
  useEffect(() => {
    if (!active) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  useEffect(() => {
    if (phase === "intro") later(() => setPhase("notice"), NOTICE_AT);
    if (phase === "notice") later(() => setPhase("notice-fading"), NOTICE_HOLD);
    if (phase === "notice-fading") later(() => setPhase("done"), NOTICE_FADE);
  }, [phase]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  if (phase === "done") return null;

  if (phase !== "intro") {
    return (
      <div
        className={`tfun-notice ${phase === "notice-fading" ? "fading" : ""}`}
        role="alertdialog"
        aria-live="assertive"
      >
        <div className="tfun-notice-box">工商協會絕無贊助(青商會有唷)</div>
      </div>
    );
  }

  return (
    <div
      className="tfun-intro"
      role="dialog"
      aria-label="開場致謝"
    >
      <div className="tfun-intro-imgwrap">
        <img
          src={import.meta.env.BASE_URL + "TfunGroup.jpg"}
          alt="T Fun 全體大合照"
          className="tfun-intro-img"
          draggable={false}
        />
      </div>

      <div className="tfun-intro-text">
        {lines.map((line, i) => (
          <p
            key={i}
            className={`tfun-intro-line ${i === 3 ? "en" : ""}`}
            style={{ animationDelay: `${LINE_DELAYS[i]}s` }}
          >
            {line}
          </p>
        ))}
        <p
          className="tfun-intro-sign"
          style={{ animationDelay: `${LINE_DELAYS[4]}s` }}
        >
          Nick
        </p>
      </div>

      <button className="tfun-intro-skip" onClick={finish}>
        跳過 Skip →
      </button>
    </div>
  );
}
