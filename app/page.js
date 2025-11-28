"use client";

import { useState, useRef, useEffect, useMemo } from "react";

const genres = [
  { value: "all", label: "All" },
  { value: "couples", label: "Couples" },
  { value: "kids", label: "Kids" },
  { value: "christian", label: "Christian" },
  { value: "social", label: "Social Media" },
  { value: "genz", label: "Gen Z" },
  { value: "millennial", label: "Millennial" },
  { value: "boomer", label: "Boomer" }
];

// ---------- WORD LISTS (by level) ----------

const easyVerbs = [
  "laba", "hugas", "linis", "ayos", "tiklop",
  "timpla", "kain", "inom", "tulog", "gising",
  "lakad", "takbo", "love", "kuha", "hatid",
  "sundo", "bili", "tapon", "pulot", "punas",
  "walis", "ligpit", "ligo", "suklay", "smile",
  "tawa", "yakap", "halik", "lambing", "asikaso",
  "alaga", "aruga", "bantay", "tulong", "pray",
  "kanta", "sayaw", "laro", "basa", "sulat"
];

const easySubjects = [
  "paa", "kamay", "ulo", "puso", "pisngi",
  "tenga", "ilong", "buhok", "mata", "ngipin",
  "tuhod", "siko", "likod", "tiyan", "balikat",
  "palad", "kilay", "braso", "binti", "talampakan",
  "kumot", "unan", "kape", "tinapay", "kanin",
  "ulam", "sabaw", "baso", "tasa", "pinggan",
  "kutsara", "tinidor", "walis", "medyas", "sapatos",
  "tsinelas", "bag", "payong", "wallet", "cellphone"
];

const mediumVerbs = [
  "kulitan", "asar", "tukso", "tiis", "intindi",
  "unawa", "tanggap", "salo", "buhat", "hatak",
  "tulak", "ipagluto", "ipagkape", "ipaghain", "makinig",
  "usap", "cheer", "comfort", "advise", "encourage",
  "support", "protect", "defend", "kampi", "bati",
  "bawi", "date", "yakap-tight", "harot", "harana",
  "surprise", "paalala", "remind", "plan", "organize",
  "budget", "ipon", "bayad", "invest", "mentor"
];

const mediumSubjects = [
  "feelings", "emotions", "tampuhan", "lambing", "tiwala",
  "oras", "pasensya", "pangarap", "plano", "konsensya",
  "ego", "pride", "pagod", "gutom", "antok",
  "sweldo", "budget", "ipon", "gastos", "utang",
  "resibo", "project", "task", "message", "inbox",
  "notification", "status", "story", "feed", "reaction",
  "comment", "like", "share", "struggle", "progress",
  "victory", "lesson", "habit", "routine", "secret"
];

const hardVerbs = [
  "screenshot", "screenrecord", "stalk", "ghost", "seenzone",
  "block", "unfollow", "mute", "react", "rant",
  "subtweet", "spill", "lurk", "doomscroll", "overthink",
  "panic-buy", "ubos-salary", "flex", "singhot", "dakma",
  "pitik", "paamoy", "paasa", "spam", "double-text",
  "triple-text", "left-on-read", "zoom-in", "crop", "filter",
  "slowmo", "fastforward", "rewind", "pause", "skip",
  "repeat", "remix", "lag", "buffer", "cringe"
];

const hardSubjects = [
  "ex", "thirdparty", "marites", "chismis", "issue",
  "tea", "dm", "seen", "ghost", "blocklist",
  "timeline", "algorithm", "clout", "cancel", "toxic",
  "crush", "situationship", "delulu", "fantasy", "rizz",
  "aura", "vibes", "mid", "meme", "drama",
  "tsismis", "comment-section", "thread", "groupchat", "live",
  "archive", "draft", "spam", "scam", "virus",
  "bug", "glitch", "update", "patch", "feed"
];

// ---------- GENRE WEIGHTS ----------

const genreVerbMap = {
  couples: new Set([
    "love", "yakap", "halik", "lambing", "asikaso",
    "alaga", "aruga", "kulitan", "tiis", "intindi",
    "unawa", "tanggap", "salo", "ipagluto", "ipagkape",
    "makinig", "usap", "protect", "defend", "date",
    "harana", "surprise", "yakap-tight", "remind", "support"
  ]),
  kids: new Set([
    "kain", "inom", "tulog", "gising", "laro",
    "takbo", "sayaw", "kanta", "basa", "sulat",
    "kulitan", "asar", "tukso", "cheer"
  ]),
  christian: new Set([
    "pray", "kanta", "encourage", "support", "comfort",
    "advise", "unawa", "tanggap", "protect", "share",
    "basa", "sulat", "organize", "mentor"
  ]),
  social: new Set([
    "text", "tawag", "chat", "react", "share",
    "comment", "follow", "send", "screenshot", "screenrecord",
    "subtweet", "spill", "lurk", "flex", "spam",
    "double-text", "triple-text", "remix"
  ]),
  genz: new Set([
    "flex", "doomscroll", "overthink", "panic-buy", "ubos-salary",
    "ghost", "seenzone", "block", "unfollow", "paasa",
    "spam", "double-text", "triple-text", "remix", "cringe"
  ]),
  millennial: new Set([
    "budget", "ipon", "bayad", "invest", "plan",
    "organize", "hatid", "sundo", "pray", "work"
  ]),
  boomer: new Set([
    "tawag", "text", "hatid", "sundo", "walis",
    "laba", "hugas", "linis", "ligo", "ayos",
    "sermon", "advise", "pray", "bantay", "alaga"
  ])
};

const genreSubjectMap = {
  couples: new Set([
    "puso", "pisngi", "buhok", "mata", "feelings",
    "emotions", "tampuhan", "lambing", "tiwala", "pangarap",
    "oras", "pasensya", "status", "story", "goal",
    "habit", "routine", "secret"
  ]),
  kids: new Set([
    "paa", "kamay", "ulo", "tinapay", "kanin",
    "ulam", "laro", "gutom", "antok"
  ]),
  christian: new Set([
    "puso", "feelings", "konsensya", "ego", "pride",
    "lesson", "habit", "routine", "pangarap", "goal"
  ]),
  social: new Set([
    "message", "inbox", "notification", "account", "profile",
    "status", "story", "feed", "reaction", "comment",
    "like", "share", "meme", "drama"
  ]),
  genz: new Set([
    "crush", "situationship", "delulu", "fantasy", "rizz",
    "aura", "vibes", "mid", "meme", "cringe"
  ]),
  millennial: new Set([
    "sweldo", "budget", "ipon", "gastos", "utang",
    "resibo", "deadline", "project", "task", "kape",
    "status"
  ]),
  boomer: new Set([
    "wallet", "keys", "resibo", "payong", "baon",
    "allowance", "sweldo", "utang", "drama"
  ])
};

// ---------- HELPERS ----------

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Genre = weighted, not hard filtered
function getWeightedPool(base, genreValue, map) {
  if (genreValue === "all") return base;
  const set = map[genreValue];
  if (!set) return base;

  const inGenre = base.filter((w) => set.has(w));
  const outGenre = base.filter((w) => !set.has(w));

  if (!inGenre.length) return base;

  return [...inGenre, ...inGenre, ...inGenre, ...outGenre];
}

function getRandomWordStyle() {
  const hue = Math.floor(Math.random() * 360);
  const lightness = 45 + Math.random() * 20; // 45–65
  const bg = `hsl(${hue} 90% ${lightness}%)`;
  const color = lightness > 55 ? "#020617" : "#f9fafb";
  return { bg, color };
}

// ---------- COMPONENT ----------

export default function Home() {
  const [genre, setGenre] = useState("all");
  const [level, setLevel] = useState("easy");

  const [verb, setVerb] = useState("laba");
  const [subject, setSubject] = useState("paa");
  const [displayVerb, setDisplayVerb] = useState("laba");
  const [displaySubject, setDisplaySubject] = useState("paa");

  const [copied, setCopied] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [verbStyle, setVerbStyle] = useState(getRandomWordStyle());
  const [subjectStyle, setSubjectStyle] = useState(getRandomWordStyle());

  const spinIntervalRef = useRef(null);
  const spinTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
    };
  }, []);

  const { verbPool, subjectPool } = useMemo(() => {
    let baseVerbs = easyVerbs;
    let baseSubjects = easySubjects;

    if (level === "medium") {
      baseVerbs = mediumVerbs;
      baseSubjects = mediumSubjects;
    } else if (level === "hard") {
      baseVerbs = hardVerbs;
      baseSubjects = hardSubjects;
    }

    const verbs = getWeightedPool(baseVerbs, genre, genreVerbMap);
    const subjects = getWeightedPool(baseSubjects, genre, genreSubjectMap);

    return { verbPool: verbs, subjectPool: subjects };
  }, [level, genre]);

  const shuffle = () => {
    if (isSpinning) return;
    if (!verbPool.length || !subjectPool.length) return;

    const finalVerb = getRandom(verbPool);
    const finalSubject = getRandom(subjectPool);

    setIsSpinning(true);
    setCopied(false);

    spinIntervalRef.current = setInterval(() => {
      setDisplayVerb(getRandom(verbPool));
      setDisplaySubject(getRandom(subjectPool));
    }, 70);

    spinTimeoutRef.current = setTimeout(() => {
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);

      setVerb(finalVerb);
      setSubject(finalSubject);
      setDisplayVerb(finalVerb);
      setDisplaySubject(finalSubject);
      setIsSpinning(false);
      setVerbStyle(getRandomWordStyle());
      setSubjectStyle(getRandomWordStyle());
    }, 800);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${verb} ${subject}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error(err);
    }
  };

  const levelButtonStyle = (active) => ({
    padding: "0.35rem 0.9rem",
    borderRadius: 999,
    border: active ? "none" : "1px solid #4b5563",
    fontSize: "0.78rem",
    fontWeight: 600,
    cursor: "pointer",
    background: active ? "#facc15" : "transparent",
    color: active ? "#111827" : "#e5e7eb"
  });

  return (
    <>
      <main className="page">
        <div className="machine">
          {/* Header */}
          <header className="machine-header">
            <div className="title-row">
              <span className="title-glow">Hanu Daw?</span>
              <span className="badge">🎰 Arcade</span>
            </div>
            <p className="subtitle">
              Taglish mashup generator. Pull the lever, tapos bahala na si
              slot machine. 😆
            </p>
          </header>

          {/* Controls */}
          <section className="controls">
            <div className="control-group">
              <label>Genre</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              >
                {genres.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="level-group">
              <button
                style={levelButtonStyle(level === "easy")}
                onClick={() => setLevel("easy")}
              >
                Easy
              </button>
              <button
                style={levelButtonStyle(level === "medium")}
                onClick={() => setLevel("medium")}
              >
                Medium
              </button>
              <button
                style={levelButtonStyle(level === "hard")}
                onClick={() => setLevel("hard")}
              >
                Hard
              </button>
            </div>
          </section>

          {/* Slot machine window */}
          <section className="slot-panel">
            <div className="slot-top-glow" />
            <div className="slot-window">
              <div
                className={
                  isSpinning
                    ? "slot-column slot-rolling"
                    : "slot-column"
                }
                style={{
                  background: verbStyle.bg,
                  color: verbStyle.color
                }}
              >
                {displayVerb}
              </div>
              <div
                className={
                  isSpinning
                    ? "slot-column slot-rolling"
                    : "slot-column"
                }
                style={{
                  background: subjectStyle.bg,
                  color: subjectStyle.color
                }}
              >
                {displaySubject}
              </div>
            </div>
            <div className="slot-bottom-bar" />
          </section>

          {/* Details */}
          <section className="details">
            <p>
              <span className="label">Verb</span> <b>{verb}</b> ·{" "}
              <span className="label">Subject</span> <b>{subject}</b>
            </p>
            <p>
              <span className="label">Genre</span>{" "}
              <b>{genres.find((g) => g.value === genre)?.label}</b> ·{" "}
              <span className="label">Level</span>{" "}
              <b>{level.toUpperCase()}</b>
            </p>
          </section>

          {/* Buttons */}
          <section className="buttons">
            <button
              className="lever-btn"
              onClick={shuffle}
              disabled={isSpinning}
            >
              {isSpinning ? "Rolling..." : "Hanu daw ulit? 🔁"}
            </button>
            <button className="copy-btn" onClick={copyToClipboard}>
              {copied ? "Kinopya na! ✅" : "Copy sa clipboard 📋"}
            </button>
          </section>
        </div>
      </main>

      <style jsx>{`
        .page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          background: radial-gradient(
              circle at top,
              rgba(59, 130, 246, 0.35),
              transparent 55%
            ),
            radial-gradient(
              circle at bottom left,
              rgba(236, 72, 153, 0.45),
              transparent 55%
            ),
            #020617;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
          color: #e5e7eb;
        }

        .machine {
          width: 100%;
          max-width: 640px;
          background: radial-gradient(circle at top, #0b1120, #020617);
          border-radius: 28px;
          padding: 1.7rem 1.6rem 1.4rem;
          box-shadow: 0 28px 80px rgba(0, 0, 0, 0.8);
          border: 1px solid rgba(148, 163, 184, 0.15);
        }

        .machine-header {
          text-align: left;
          margin-bottom: 1.4rem;
        }

        .title-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .title-glow {
          font-size: 1.7rem;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          background: linear-gradient(120deg, #f97316, #ec4899, #6366f1);
          -webkit-background-clip: text;
          color: transparent;
          text-shadow: 0 0 18px rgba(236, 72, 153, 0.6);
        }

        .badge {
          font-size: 0.75rem;
          padding: 0.25rem 0.6rem;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(251, 191, 36, 0.8);
          color: #facc15;
        }

        .subtitle {
          margin-top: 0.35rem;
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .controls {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: flex-end;
          margin-bottom: 1.3rem;
        }

        .control-group {
          flex: 1 1 170px;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .control-group label {
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9ca3af;
        }

        .control-group select {
          border-radius: 999px;
          border: 1px solid #4b5563;
          padding: 0.45rem 0.9rem;
          background: #020617;
          color: #e5e7eb;
          font-size: 0.82rem;
          outline: none;
        }

        .control-group select:focus {
          border-color: #f97316;
          box-shadow: 0 0 0 1px rgba(249, 115, 22, 0.5);
        }

        .level-group {
          display: flex;
          gap: 0.45rem;
          flex-wrap: wrap;
        }

        /* SLOT MACHINE */

        .slot-panel {
          margin-bottom: 1.1rem;
          padding: 0.9rem 0.9rem 1rem;
          border-radius: 20px;
          background: radial-gradient(
            circle at top,
            rgba(59, 130, 246, 0.35),
            rgba(15, 23, 42, 0.95)
          );
          box-shadow: 0 0 25px rgba(129, 140, 248, 0.45);
          border: 1px solid rgba(148, 163, 184, 0.5);
          position: relative;
        }

        .slot-top-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at top,
            rgba(251, 191, 36, 0.35),
            transparent 60%
          );
          opacity: 0.8;
          pointer-events: none;
        }

        .slot-window {
          position: relative;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.5rem;
          padding: 0.6rem;
          border-radius: 18px;
          background: radial-gradient(circle at center, #020617, #000000);
          box-shadow: inset 0 0 20px rgba(15, 23, 42, 1);
        }

        .slot-column {
          aspect-ratio: 3 / 4;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.7rem;
          font-weight: 800;
          text-transform: lowercase;
          text-shadow: 0 0 14px rgba(15, 23, 42, 0.9);
          box-shadow: 0 0 16px rgba(15, 23, 42, 0.8);
          border: 2px solid rgba(15, 23, 42, 0.9);
        }

        .slot-bottom-bar {
          margin-top: 0.7rem;
          height: 6px;
          border-radius: 999px;
          background: linear-gradient(
            90deg,
            #f97316,
            #facc15,
            #22c55e,
            #38bdf8,
            #a855f7
          );
          box-shadow: 0 0 12px rgba(236, 72, 153, 0.7);
        }

        .slot-rolling {
          animation: slot-spin 0.18s linear infinite;
        }

        @keyframes slot-spin {
          0% {
            transform: translateY(30px);
            filter: blur(1px);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-30px);
            filter: blur(0.5px);
            opacity: 1;
          }
          100% {
            transform: translateY(30px);
            filter: blur(1px);
            opacity: 0.8;
          }
        }

        .details {
          text-align: center;
          font-size: 0.82rem;
          color: #cbd5f5;
          margin-bottom: 1.1rem;
        }

        .details p {
          margin: 0.15rem 0;
        }

        .label {
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 0.68rem;
          color: #9ca3af;
        }

        .buttons {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }

        .lever-btn {
          border: none;
          border-radius: 999px;
          padding: 0.85rem 1rem;
          font-size: 0.95rem;
          font-weight: 700;
          background: linear-gradient(135deg, #f97316, #ec4899, #6366f1);
          color: #f9fafb;
          cursor: pointer;
          text-shadow: 0 0 10px rgba(15, 23, 42, 0.9);
          box-shadow: 0 18px 40px rgba(236, 72, 153, 0.5);
        }

        .lever-btn:disabled {
          cursor: not-allowed;
          opacity: 0.7;
          box-shadow: none;
        }

        .copy-btn {
          border-radius: 999px;
          padding: 0.75rem 1rem;
          font-size: 0.9rem;
          font-weight: 500;
          border: 1px solid rgba(148, 163, 184, 0.6);
          background: rgba(15, 23, 42, 0.8);
          color: #e5e7eb;
          cursor: pointer;
        }

        @media (max-width: 640px) {
          .machine {
            padding: 1.4rem 1.2rem 1.2rem;
          }
          .slot-column {
            font-size: 1.4rem;
          }
        }
      `}</style>
    </>
  );
}
