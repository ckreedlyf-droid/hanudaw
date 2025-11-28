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

// ---------- WORD LISTS (by level, shared across genres) ----------

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

// ---------- GENRE WEIGHTS (favored words per genre) ----------

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

// Genre = weighted, hindi hard filter
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
  const lightness = 40 + Math.random() * 20; // 40–60
  const bg = `hsl(${hue} 85% ${lightness}%)`;
  const color = lightness > 55 ? "#111827" : "#f9fafb";
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
    padding: "0.4rem 1rem",
    borderRadius: 999,
    border: active ? "none" : "1px solid #e5e7eb",
    fontSize: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
    background: active ? "#111827" : "#ffffff",
    color: active ? "#f9fafb" : "#4b5563"
  });

  return (
    <>
      <main className="page">
        <div className="card">
          {/* Title */}
          <header className="header">
            <h1>Hanu Daw? 🤯</h1>
            <p>Taglish mashup generator. Pang-couple, pang-kids, pang-DGroup. 😆</p>
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

          {/* Squares */}
          <section className="square-row">
            <div
              className={
                isSpinning ? "square word-box slot-rolling" : "square word-box"
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
                isSpinning ? "square word-box slot-rolling" : "square word-box"
              }
              style={{
                background: subjectStyle.bg,
                color: subjectStyle.color
              }}
            >
              {displaySubject}
            </div>
          </section>

          {/* Details */}
          <section className="details">
            <p>
              <span className="label">Verb:</span> <b>{verb}</b> ·{" "}
              <span className="label">Subject:</span> <b>{subject}</b>
            </p>
            <p>
              <span className="label">Genre:</span>{" "}
              <b>{genres.find((g) => g.value === genre)?.label}</b> ·{" "}
              <span className="label">Level:</span>{" "}
              <b>{level.toUpperCase()}</b>
            </p>
          </section>

          {/* Buttons */}
          <section className="buttons">
            <button
              className="primary-btn"
              onClick={shuffle}
              disabled={isSpinning}
            >
              {isSpinning ? "Nagro-roll..." : "Hanu daw ulit? 🔁"}
            </button>
            <button className="secondary-btn" onClick={copyToClipboard}>
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
          background: radial-gradient(circle at top, #ffe4e6, #e0f2fe 35%, #f4f4f5 70%);
          font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .card {
          width: 100%;
          max-width: 620px;
          background: #ffffff;
          border-radius: 32px;
          padding: 1.8rem 1.8rem 1.6rem;
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.18);
        }

        .header {
          text-align: center;
          margin-bottom: 1.4rem;
        }

        .header h1 {
          margin: 0;
          font-size: 1.9rem;
          font-weight: 900;
          letter-spacing: 0.04em;
          color: #111827;
        }

        .header p {
          margin: 0.3rem 0 0;
          font-size: 0.85rem;
          color: #6b7280;
        }

        .controls {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: flex-end;
          margin-bottom: 1.4rem;
        }

        .control-group {
          flex: 1 1 170px;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .control-group label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #6b7280;
        }

        .control-group select {
          border-radius: 999px;
          border: 1px solid #e5e7eb;
          padding: 0.45rem 0.9rem;
          font-size: 0.85rem;
          background: #ffffff;
          color: #111827;
        }

        .level-group {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .square-row {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .square {
          aspect-ratio: 1 / 1;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          font-weight: 800;
          text-transform: lowercase;
          box-shadow: 0 14px 35px rgba(15, 23, 42, 0.35);
        }

        .details {
          text-align: center;
          font-size: 0.82rem;
          color: #4b5563;
          margin-bottom: 1.2rem;
        }

        .details p {
          margin: 0.15rem 0;
        }

        .label {
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 0.7rem;
          color: #9ca3af;
        }

        .buttons {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .primary-btn {
          border: none;
          border-radius: 999px;
          padding: 0.85rem 1rem;
          font-size: 0.95rem;
          font-weight: 600;
          background: linear-gradient(135deg, #f97316, #ec4899, #6366f1);
          color: #f9fafb;
          cursor: pointer;
        }

        .primary-btn:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .secondary-btn {
          border-radius: 999px;
          padding: 0.75rem 1rem;
          font-size: 0.9rem;
          font-weight: 500;
          border: 1px solid #e5e7eb;
          background: #ffffff;
          color: #111827;
          cursor: pointer;
        }

        .word-box.slot-rolling {
          animation: slot-spin 0.25s linear infinite;
        }

        @keyframes slot-spin {
          0% {
            transform: translateY(20px);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-20px);
            opacity: 1;
          }
          100% {
            transform: translateY(20px);
            opacity: 0.8;
          }
        }

        @media (max-width: 600px) {
          .card {
            padding: 1.4rem 1.2rem 1.3rem;
          }
          .square {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </>
  );
}
