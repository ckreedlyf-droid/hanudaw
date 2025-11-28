
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

function getWeightedPool(base, genreValue, map) {
  if (genreValue === "all") return base;
  const set = map[genreValue];
  if (!set) return base;

  const inGenre = base.filter((w) => set.has(w));
  const outGenre = base.filter((w) => !set.has(w));

  if (!inGenre.length) return base;

  // bias words that match the genre
  return [...inGenre, ...inGenre, ...inGenre, ...outGenre];
}

function getRandomNoteStyle() {
  const hue = Math.floor(Math.random() * 360);
  const lightness = 80 + Math.random() * 10; // pastel 80–90
  const bg = `hsl(${hue} 95% ${lightness}%)`;
  const color = "#111827";
  return { bg, color };
}

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
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

  // sounds
  const [soundOn, setSoundOn] = useState(true);
  const clickSoundRef = useRef(null);
  const rollSoundRef = useRef(null);
  const dingSoundRef = useRef(null);
  const tickSoundRef = useRef(null);
  const alarmSoundRef = useRef(null);

  // slot-machine spin
  const spinIntervalRef = useRef(null);
  const spinTimeoutRef = useRef(null);

  // timer
  const [timerSeconds, setTimerSeconds] = useState(30); // base duration
  const [remainingSeconds, setRemainingSeconds] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [customMinutes, setCustomMinutes] = useState("0.5");
  const timerIntervalRef = useRef(null);

  // init sounds once
  useEffect(() => {
    if (typeof Audio !== "undefined") {
      clickSoundRef.current = new Audio("/sounds/click.mp3");
      rollSoundRef.current = new Audio("/sounds/roll.mp3");
      dingSoundRef.current = new Audio("/sounds/ding.mp3");
      tickSoundRef.current = new Audio("/sounds/tick.mp3");   // tiktok style tick
      alarmSoundRef.current = new Audio("/sounds/alarm.mp3"); // alarm pag time's up
    }
  }, []);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (tickSoundRef.current) tickSoundRef.current.pause();
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

  // ---------- SOUND HELPERS ----------

  const playOnce = (ref) => {
    if (!soundOn || !ref?.current) return;
    try {
      ref.current.currentTime = 0;
      ref.current.play();
    } catch {
      // ignore
    }
  };

  const startTick = () => {
    if (!soundOn || !tickSoundRef.current) return;
    try {
      tickSoundRef.current.currentTime = 0;
      tickSoundRef.current.loop = true;
      tickSoundRef.current.play();
    } catch {
      // ignore
    }
  };

  const stopTick = () => {
    if (!tickSoundRef.current) return;
    tickSoundRef.current.pause();
    tickSoundRef.current.currentTime = 0;
  };

  // ---------- TIMER LOGIC ----------

  const clearTimerInterval = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const startTimer = () => {
    if (isTimerRunning) return;

    // kung zero na, reset muna sa base
    if (remainingSeconds <= 0) {
      setRemainingSeconds(timerSeconds || 30);
    }

    clearTimerInterval();
    setIsTimerRunning(true);
    startTick();

    timerIntervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearTimerInterval();
          setIsTimerRunning(false);
          stopTick();
          playOnce(alarmSoundRef);
          playOnce(dingSoundRef);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    clearTimerInterval();
    setIsTimerRunning(false);
    stopTick();
  };

  const resetTimer = () => {
    clearTimerInterval();
    setIsTimerRunning(false);
    stopTick();
    setRemainingSeconds(timerSeconds);
  };

  const setPresetSeconds = (secs) => {
    clearTimerInterval();
    setIsTimerRunning(false);
    stopTick();
    setTimerSeconds(secs);
    setRemainingSeconds(secs);
  };

  const applyCustomMinutes = () => {
    const mins = parseFloat(customMinutes);
    if (Number.isNaN(mins) || mins <= 0) return;
    const secs = Math.round(mins * 60);
    setPresetSeconds(secs);
  };

  // ---------- SHUFFLE LOGIC ----------

  const shuffle = () => {
    if (isSpinning) return;
    if (!verbPool.length || !subjectPool.length) return;

    const finalVerb = getRandom(verbPool);
    const finalSubject = getRandom(subjectPool);

    setIsSpinning(true);
    setCopied(false);

    playOnce(clickSoundRef);

    spinIntervalRef.current = setInterval(() => {
      setDisplayVerb(getRandom(verbPool));
      setDisplaySubject(getRandom(subjectPool));
    }, 80);

    playOnce(rollSoundRef);

    spinTimeoutRef.current = setTimeout(() => {
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);

      setVerb(finalVerb);
      setSubject(finalSubject);
      setDisplayVerb(finalVerb);
      setDisplaySubject(finalSubject);
      setIsSpinning(false);
      setVerbStyle(getRandomNoteStyle());
      setSubjectStyle(getRandomNoteStyle());

      playOnce(dingSoundRef);
    }, 900);
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

  const toggleSound = () => {
    setSoundOn((prev) => {
      const next = !prev;
      if (!next) {
        stopTick();
        // stop other looping-ish sounds just in case
        rollSoundRef.current?.pause();
      }
      return next;
    });
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

          {/* Genre + Level */}
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

          {/* Timer + Sound row (always visible) */}
          <section className="settings-row">
            <div className="timer-box">
              <div className="timer-header">
                <span>Timer</span>
                <span className="timer-sub">pang round / turn 😆</span>
              </div>
              <div className="timer-display">
                {formatTime(remainingSeconds)}
              </div>

              <div className="timer-controls">
                <div className="timer-presets">
                  <button
                    className="chip"
                    onClick={() => setPresetSeconds(30)}
                  >
                    30s
                  </button>
                  <button
                    className="chip"
                    onClick={() => setPresetSeconds(60)}
                  >
                    1 min
                  </button>
                  <button
                    className="chip"
                    onClick={() => setPresetSeconds(90)}
                  >
                    1:30
                  </button>
                </div>

                <div className="timer-custom">
                  <span className="timer-custom-label">Custom min</span>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(e.target.value)}
                  />
                  <button className="tiny-btn" onClick={applyCustomMinutes}>
                    Set
                  </button>
                </div>
              </div>

              <div className="timer-actions">
                <button
                  className="timer-main-btn"
                  onClick={isTimerRunning ? pauseTimer : startTimer}
                >
                  {isTimerRunning ? "Pause ⏸️" : "Start ▶️"}
                </button>
                <button className="timer-reset-btn" onClick={resetTimer}>
                  Reset
                </button>
              </div>
            </div>

            <div className="sound-box">
              <div className="sound-title">Sound</div>
              <button
                className={soundOn ? "sound-toggle on" : "sound-toggle off"}
                onClick={toggleSound}
              >
                {soundOn ? "🔊 On" : "🔇 Silent mode"}
              </button>
              <p className="sound-hint">
                May click, TikTok-style tick at alarm pag naka-on.
              </p>
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
          max-width: 680px;
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
          margin-bottom: 1.0rem;
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

        /* Timer + Sound row */

        .settings-row {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.3rem;
        }

        .timer-box {
          flex: 2 1 260px;
          background: #f9fafb;
          border-radius: 18px;
          padding: 0.9rem 1rem;
          box-shadow: inset 0 0 0 1px #e5e7eb;
        }

        .timer-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 0.35rem;
        }

        .timer-header span:first-child {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #6b7280;
        }

        .timer-sub {
          font-size: 0.7rem;
          color: #9ca3af;
        }

        .timer-display {
          font-size: 2.1rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-align: center;
          padding: 0.35rem 0.5rem;
          border-radius: 14px;
          background: #ffffff;
          border: 1px dashed #e5e7eb;
          margin-bottom: 0.7rem;
        }

        .timer-controls {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          align-items: center;
          justify-content: space-between;
        }

        .timer-presets {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .chip {
          border-radius: 999px;
          border: 1px solid #e5e7eb;
          padding: 0.25rem 0.6rem;
          font-size: 0.75rem;
          background: #ffffff;
          cursor: pointer;
        }

        .chip:hover {
          border-color: #fb7185;
        }

        .timer-custom {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
        }

        .timer-custom-label {
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .timer-custom input {
          width: 3.2rem;
          border-radius: 999px;
          border: 1px solid #e5e7eb;
          padding: 0.25rem 0.4rem;
          font-size: 0.75rem;
          text-align: right;
        }

        .tiny-btn {
          border-radius: 999px;
          border: none;
          padding: 0.25rem 0.6rem;
          font-size: 0.7rem;
          background: #fb7185;
          color: #ffffff;
          cursor: pointer;
        }

        .timer-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.7rem;
        }

        .timer-main-btn {
          flex: 1;
          border-radius: 999px;
          border: none;
          padding: 0.45rem 0.6rem;
          font-size: 0.85rem;
          font-weight: 600;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: #ffffff;
          cursor: pointer;
        }

        .timer-reset-btn {
          border-radius: 999px;
          border: 1px solid #e5e7eb;
          padding: 0.45rem 0.6rem;
          font-size: 0.8rem;
          background: #ffffff;
          cursor: pointer;
        }

        .sound-box {
          flex: 1 1 160px;
          background: #fff7ed;
          border-radius: 18px;
          padding: 0.8rem 0.9rem;
          box-shadow: inset 0 0 0 1px #fed7aa;
        }

        .sound-title {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #92400e;
          margin-bottom: 0.4rem;
        }

        .sound-toggle {
          width: 100%;
          border-radius: 999px;
          padding: 0.45rem 0.6rem;
          font-size: 0.85rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          margin-bottom: 0.3rem;
        }

        .sound-toggle.on {
          background: #22c55e;
          color: #ffffff;
        }

        .sound-toggle.off {
          background: #e5e7eb;
          color: #4b5563;
        }

        .sound-hint {
          font-size: 0.7rem;
          color: #92400e;
          margin: 0;
        }

        /* Notes */

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

          .settings-row {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}
