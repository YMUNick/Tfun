import { useState, useEffect, useRef } from "react";

// ─── Cinematic intro overlay ───
// Sequence: full black → group photo fades in centered → photo slowly drifts
// upward & shrinks → the dedication lines fade in one after another → the whole
// overlay fades out to reveal the home page.
//
// Plays once per browser session (sessionStorage). To make it play on every
// load, remove the SEEN_KEY guard below.

const SEEN_KEY = "tfun-intro-seen";

// Timeline (seconds). Keep in sync with the @keyframes in styles.css.
const LINE_DELAYS = [5.0, 7.2, 9.4, 13.0, 14.6]; // line1..line4 + signature
const FADE_OUT_AT = 16.8;   // overlay starts fading to reveal the page
const DONE_AT = 18.1;       // overlay unmounts

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

  const alreadySeen =
    typeof window !== "undefined" && sessionStorage.getItem(SEEN_KEY);

  const [show, setShow] = useState(!alreadySeen && !prefersReduced);
  const [fadingOut, setFadingOut] = useState(false);
  const timers = useRef([]);

  const finish = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    try { sessionStorage.setItem(SEEN_KEY, "1"); } catch { /* ignore */ }
    setFadingOut(true);
    // allow the fade-out transition to play before unmounting
    setTimeout(() => setShow(false), 1300);
  };

  useEffect(() => {
    if (!show) return;
    sessionStorage.setItem(SEEN_KEY, "1");
    document.body.style.overflow = "hidden";
    timers.current.push(setTimeout(() => setFadingOut(true), FADE_OUT_AT * 1000));
    timers.current.push(setTimeout(() => setShow(false), DONE_AT * 1000));
    return () => {
      document.body.style.overflow = "";
      timers.current.forEach(clearTimeout);
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      className={`tfun-intro ${fadingOut ? "fading" : ""}`}
      role="dialog"
      aria-label="開場致謝"
    >
      <img
        src={import.meta.env.BASE_URL + "TfunGroup.jpg"}
        alt="T Fun 全體大合照"
        className="tfun-intro-img"
        draggable={false}
      />

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
