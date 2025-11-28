"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";

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

function getWeightedPool(base, genreValue, map) {
  if (genreValue === "all") return base;
  const set = map[genreValue];
  if (!set) return base;

  const inGenre = base.filter((w) => set.has(w));
  const outGenre = base.filter((w) => !set.has(w));

  if (!inGenre.length) return base;

  // 3x weight for genre-matching words
  return [...inGenre, ...inGenre, ...inGenre, ...outGenre];
}

function getRandomNoteStyle() {
  const hue = Math.floor(Math.random() * 360);
  const lightness = 80 + Math.random() * 10; // pastel 80–90
  const bg = `hsl(${hue} 95% ${lightness}%)`;
  const color = "#111827";
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
  const [verbStyle, setVerbStyle] = useState(getRandomNoteStyle());
  const [subjectStyle, setSubjectStyle] = useState(getRandomNoteStyle());

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [countdown, setCountdown] = useState(0);

  const spinIntervalRef = useRef(null);
  const spinTimeoutRef = useRef(null);

  const clickSoundRef = useRef(null);
  const rollSoundRef = useRef(null);
  const dingSoundRef = useRef(null);

  // Setup & cleanup
  useEffect(() => {
    // Setup audio only on client
    if (typeof window !== "undefined") {
      clickSoundRef.current = new Audio("/sounds/click.mp3");
      rollSoundRef.current = new Audio("/sounds/roll.mp3");
      rollSoundRef.current.loop = true;
      dingSoundRef.current = new Audio("/sounds/ding.mp3");
    }

    return () => {
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);

      [clickSoundRef, rollSoundRef, dingSoundRef].forEach((ref) => {
        if (ref.current) {
          ref.current.pause();
        }
      });
    };
  }, []);

  const playSound = useCallback(
    (type) => {
      if (!soundEnabled) return;
      let audioRef = null;
      if (type === "click") audioRef = clickSoundRef;
      if (type === "roll") audioRef = rollSoundRef;
      if (type === "ding") audioRef = dingSoundRef;
      const audio = audioRef?.current;
      if (!audio) return;
      try {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } catch {
        // ignore
      }
    },
    [soundEnabled]
  );

  const stopRollSound = useCallback(() => {
    const audio = rollSoundRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
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

  const shuffle = useCallback(() => {
    if (isSpinning) return;
    if (!verbPool.length || !subjectPool.length) return;

    const finalVerb = getRandom(verbPool);
    const finalSubject = getRandom(subjectPool);

    setIsSpinning(true);
    setCopied(false);

    playSound("click");
    playSound("roll");

    spinIntervalRef.current = setInterval(() => {
      setDisplayVerb(getRandom(verbPool));
      setDisplaySubject(getRandom(subjectPool));
    }, 80);

    spinTimeoutRef.current = setTimeout(() => {
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
      stopRollSound();

      setVerb(finalVerb);
      setSubject(finalSubject);
      setDisplayVerb(finalVerb);
      setDisplaySubject(finalSubject);
      setIsSpinning(false);
      setVerbStyle(getRandomNoteStyle());
      setSubjectStyle(getRandomNoteStyle());
      playSound("ding");
    }, 900);
  }, [
    isSpinning,
    verbPool,
    subjectPool,
    playSound,
    stopRollSound
  ]);

  // Auto-roll timer
  useEffect(() => {
    if (!countdown || countdown <= 0) return;

    const id = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // trigger auto shuffle
          shuffle();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [countdown, shuffle]);

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
    padding: "0.4rem 0.9rem",
    borderRadius: 999,
    border: active ? "none" : "1px solid #d4d4d8",
    fontSize: "0.78rem",
    fontWeight: 600,
    cursor: "pointer",
    background: active ? "#fb7185" : "#ffffff",
    color: active ? "#ffffff" : "#4b5563",
    boxShadow: active ? "0 4px 10px rgba(248, 113, 113, 0.5)" : "none"
  });

  const startPresetTimer = (seconds) => {
    if (seconds <= 0) return;
    setCountdown(seconds);
  };

  const applyCustomTimer = () => {
    if (!timerSeconds || timerSeconds <= 0) return;
    setCountdown(timerSeconds);
  };

  return (
    <>
      <main className="page">
        <div className="board-card">
          {/* Header */}
          <header className="header">
            <div className="title-wrapper">
              <h1>Hanu Daw? 🤯</h1>
              <div className="underline" />
            </div>
            <p>
              Taglish mashup generator na parang sticky notes sa ref. Pang-couple,
              pang-kids, pang-DGroup icebreaker. 🧸
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

          {/* Sticky notes area */}
          <section className="notes-area">
            <div
              className={
                isSpinning ? "note note-left note-rolling" : "note note-left"
              }
              style={{
                background: verbStyle.bg,
                color: verbStyle.color
              }}
            >
              <span className="note-pin">📌</span>
              <span className="note-label">verb</span>
              <span className="note-word">{displayVerb}</span>
            </div>

            <div
              className={
                isSpinning
                  ? "note note-right note-rolling"
                  : "note note-right"
              }
              style={{
                background: subjectStyle.bg,
                color: subjectStyle.color
              }}
            >
              <span className="note-pin">📌</span>
              <span className="note-label">subject</span>
              <span className="note-word">{displaySubject}</span>
            </div>
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
              className="primary-btn"
              onClick={shuffle}
              disabled={isSpinning}
            >
              {isSpinning ? "Nagpapalit ng notes..." : "Hanu daw ulit? 🔁"}
            </button>
            <button className="secondary-btn" onClick={copyToClipboard}>
              {copied ? "Kinopya na! ✅" : "Copy sa clipboard 📋"}
            </button>
          </section>

          {/* Timer & Sound controls */}
          <section className="timer-sound-wrapper">
            <div className="timer-controls">
              <div className="timer-header">
                <span className="timer-title">⏱ Timer</span>
                <span className="timer-sub">
                  Auto-roll para di kayo maubusan ng tanong
                </span>
              </div>

              <div className="timer-buttons">
                <button onClick={() => startPresetTimer(10)}>10s</button>
                <button onClick={() => startPresetTimer(20)}>20s</button>
                <button onClick={() => startPresetTimer(30)}>30s</button>
              </div>

              <div className="timer-custom">
                <input
                  type="number"
                  min="1"
                  placeholder="Custom seconds..."
                  value={timerSeconds || ""}
                  onChange={(e) =>
                    setTimerSeconds(Number(e.target.value) || 0)
                  }
                />
                <button onClick={applyCustomTimer}>Set Timer</button>
              </div>

              {countdown > 0 && (
                <p className="timer-countdown">
                  Next auto-roll in <b>{countdown}s</b> ⏳
                </p>
              )}
            </div>

            <div className="sound-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={() => setSoundEnabled((v) => !v)}
                />
                <span className="sound-label">
                  {soundEnabled ? "🔊 Sound ON" : "🔇 Sound OFF"}
                </span>
              </label>
              <p className="sound-hint">
                Tip: I-mute kung nasa church, office, or tulog na si baby. 😅
              </p>
            </div>
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
          background:
            radial-gradient(circle at top left, #fee2e2, transparent 55%),
            radial-gradient(circle at bottom right, #bfdbfe, transparent 55%),
            #fefce8;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
          color: #111827;
        }

        .board-card {
          width: 100%;
          max-width: 640px;
          background: #fefeff;
          border-radius: 26px;
          padding: 1.8rem 1.6rem 1.5rem;
          box-shadow: 0 22px 60px rgba(148, 163, 184, 0.5);
          border: 1px solid #e4e4e7;
        }

        .header {
          margin-bottom: 1.4rem;
          text-align: left;
        }

        .title-wrapper {
          display: inline-block;
          position: relative;
          padding-bottom: 0.35rem;
        }

        .header h1 {
          margin: 0;
          font-size: 1.9rem;
          font-weight: 900;
          letter-spacing: 0.02em;
        }

        .underline {
          position: absolute;
          left: -0.2rem;
          right: -0.2rem;
          bottom: 0;
          height: 8px;
          border-radius: 999px;
          background: #fef08a;
          opacity: 0.9;
          transform: rotate(-1deg);
        }

        .header p {
          margin: 0.5rem 0 0;
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
          font-size: 0.7rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #9ca3af;
        }

        .control-group select {
          border-radius: 999px;
          border: 1px solid #d4d4d8;
          padding: 0.45rem 0.85rem;
          font-size: 0.85rem;
          background: #ffffff;
          color: #111827;
          outline: none;
        }

        .control-group select:focus {
          border-color: #fb7185;
          box-shadow: 0 0 0 2px rgba(248, 113, 113, 0.25);
        }

        .level-group {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .notes-area {
          position: relative;
          padding: 1.1rem 0.6rem 1rem;
          margin-bottom: 1.1rem;
          border-radius: 20px;
          background: linear-gradient(135deg, #f9fafb, #fefce8);
          box-shadow: inset 0 0 0 1px #e5e7eb;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.9rem;
        }

        .note {
          position: relative;
          min-height: 140px;
          border-radius: 12px;
          padding: 0.7rem 0.8rem 0.9rem;
          box-shadow: 0 14px 28px rgba(148, 163, 184, 0.7);
          transform-origin: center top;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-end;
        }

        .note-left {
          transform: rotate(-3deg);
        }

        .note-right {
          transform: rotate(2.5deg);
        }

        .note-pin {
          position: absolute;
          top: 0.4rem;
          left: 50%;
          transform: translateX(-50%);
          font-size: 1rem;
        }

        .note-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(55, 65, 81, 0.7);
        }

        .note-word {
          font-size: 1.5rem;
          font-weight: 800;
          text-transform: lowercase;
          margin-top: 0.2rem;
        }

        .note-rolling {
          animation: note-slide 0.22s linear infinite;
        }

        @keyframes note-slide {
          0% {
            transform: translateY(8px) rotate(-2deg);
            opacity: 0.9;
          }
          50% {
            transform: translateY(-8px) rotate(2deg);
            opacity: 1;
          }
          100% {
            transform: translateY(8px) rotate(-2deg);
            opacity: 0.9;
          }
        }

        .details {
          text-align: center;
          font-size: 0.83rem;
          color: #4b5563;
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
          gap: 0.6rem;
          margin-bottom: 1rem;
        }

        .primary-btn {
          border: none;
          border-radius: 999px;
          padding: 0.85rem 1rem;
          font-size: 0.95rem;
          font-weight: 600;
          background: linear-gradient(135deg, #fb7185, #f97316);
          color: #ffffff;
          cursor: pointer;
          box-shadow: 0 14px 30px rgba(248, 113, 113, 0.5);
        }

        .primary-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          box-shadow: none;
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

        .timer-sound-wrapper {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 0.4rem;
        }

        .timer-controls {
          flex: 2 1 230px;
          border-radius: 16px;
          padding: 0.75rem 0.9rem;
          background: #f9fafb;
          border: 1px dashed #e5e7eb;
        }

        .timer-header {
          margin-bottom: 0.4rem;
        }

        .timer-title {
          font-size: 0.8rem;
          font-weight: 700;
        }

        .timer-sub {
          display: block;
          font-size: 0.72rem;
          color: #6b7280;
        }

        .timer-buttons {
          display: flex;
          gap: 0.35rem;
          margin-bottom: 0.5rem;
          flex-wrap: wrap;
        }

        .timer-buttons button {
          border-radius: 999px;
          border: 1px solid #e5e7eb;
          background: #ffffff;
          padding: 0.3rem 0.7rem;
          font-size: 0.78rem;
          cursor: pointer;
        }

        .timer-buttons button:hover {
          border-color: #fb7185;
        }

        .timer-custom {
          display: flex;
          gap: 0.4rem;
          align-items: center;
          margin-bottom: 0.3rem;
        }

        .timer-custom input {
          flex: 1;
          border-radius: 999px;
          border: 1px solid #e5e7eb;
          padding: 0.3rem 0.7rem;
          font-size: 0.78rem;
        }

        .timer-custom button {
          border-radius: 999px;
          border: none;
          background: #f97316;
          color: #ffffff;
          padding: 0.35rem 0.8rem;
          font-size: 0.78rem;
          cursor: pointer;
        }

        .timer-countdown {
          font-size: 0.78rem;
          color: #4b5563;
        }

        .sound-toggle {
          flex: 1 1 160px;
          border-radius: 16px;
          padding: 0.75rem 0.9rem;
          background: #fff7ed;
          border: 1px dashed #fed7aa;
        }

        .sound-toggle label {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.82rem;
          font-weight: 600;
        }

        .sound-toggle input[type="checkbox"] {
          width: 16px;
          height: 16px;
        }

        .sound-label {
          user-select: none;
        }

        .sound-hint {
          margin: 0.35rem 0 0;
          font-size: 0.72rem;
          color: #92400e;
        }

        @media (max-width: 640px) {
          .board-card {
            padding: 1.5rem 1.3rem 1.3rem;
          }
          .notes-area {
            grid-template-columns: 1fr;
          }
          .note {
            min-height: 120px;
          }
          .timer-sound-wrapper {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}
