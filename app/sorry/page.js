
"use client";

import { useState, useEffect, useRef, useMemo } from "react";

// ----------------------------------------------------
// WORD BANK – Sorry What?! (50 words per level)
// ----------------------------------------------------

const sorryWords = {
  easy: {
    tagalog: [
      "tadhana", "ngiti", "pahinga", "tagpuan", "liwanag",
      "ulan", "dumampi", "hawak", "suyo", "sinta",
      "muni", "alapaap", "liwayway", "payapa", "dahan",
      "tawag", "sindi", "kalmado", "habang", "salo",
      "bahaghari", "giliw", "pahiram", "sundo", "alaga"
    ],
    english: [
      "comfort", "heaven", "maybe", "always", "never",
      "magic", "rainfall", "daylight", "heartbeat", "calling",
      "broken", "forever", "shining", "slowly", "lullaby",
      "waiting", "memory", "falling", "touch", "carry",
      "ocean", "wander", "stay", "light", "breeze"
    ]
  },
  medium: {
    tagalog: [
      "pangako", "halaga", "tiwala", "pangarap", "nilisan",
      "patawad", "alalahanin", "minsan", "umibig", "sana",
      "pagtatapat", "hiling", "nakaraan", "tadhana", "luha",
      "balikan", "pagsamo", "tahanan", "hangarin", "ligawan",
      "tuwing", "sigaw", "habang", "panghabang", "babalik"
    ],
    english: [
      "promise", "reason", "brokenhearted", "missing", "sadness",
      "forevermore", "another", "goodbye", "lonely", "maybe",
      "hopeless", "distance", "believe", "somewhere", "dreaming",
      "waiting", "falling", "together", "memories", "tonight",
      "surrender", "silence", "inside", "again", "moment"
    ]
  },
  hard: {
    tagalog: [
      "himig", "gunita", "panaginip", "ligaya", "panaghoy",
      "dalisay", "munting", "pagtanaw", "sulyap", "pangungulila",
      "pahimakas", "habambuhay", "handog", "alinlangan", "pagsinta",
      "malamlam", "alay", "sukdulan", "hinagpis", "ligalig",
      "tanglaw", "gunam", "daluyong", "luningning", "dakila"
    ],
    english: [
      "eternity", "melody", "destiny", "solitude", "serenade",
      "tenderness", "heartache", "goodnight", "reminder", "longing",
      "beloved", "glorious", "whisper", "fading", "harmony",
      "essence", "gentle", "endless", "yesterday", "someday",
      "forevermore", "precious", "golden", "memory", "farewell"
    ]
  }
};

// ----------------------------------------------------
// Helpers
// ----------------------------------------------------

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ----------------------------------------------------
// Component
// ----------------------------------------------------

export default function SorryWhatPage() {
  const [level, setLevel] = useState("easy"); // easy | medium | hard
  const [language, setLanguage] = useState("mixed"); // tagalog | english | mixed

  const [currentWord, setCurrentWord] = useState("tadhana");
  const [displayWord, setDisplayWord] = useState("tadhana");
  const [isRolling, setIsRolling] = useState(false);

  const [baseDuration, setBaseDuration] = useState(60); // default 60s
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);

  const [soundsOn, setSoundsOn] = useState(true);
  const [copied, setCopied] = useState(false);

  const rollIntervalRef = useRef(null);
  const timerIntervalRef = useRef(null);

  const clickSoundRef = useRef(null);
  const tickSoundRef = useRef(null);
  const alarmSoundRef = useRef(null);

  // Load sounds once on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    clickSoundRef.current = new Audio("/sounds/click.mp3");
    tickSoundRef.current = new Audio("/sounds/roll.mp3"); // TikTok-ish tick (pwede mo palitan file)
    alarmSoundRef.current = new Audio("/sounds/ding.mp3");

    // Para di super lakas
    if (tickSoundRef.current) tickSoundRef.current.volume = 0.5;
    if (alarmSoundRef.current) alarmSoundRef.current.volume = 0.9;

    return () => {
      if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Build word pool based on level + language
  const wordPool = useMemo(() => {
    const lvl = sorryWords[level];
    if (!lvl) return [];

    if (language === "tagalog") return lvl.tagalog;
    if (language === "english") return lvl.english;
    return [...lvl.tagalog, ...lvl.english]; // mixed
  }, [level, language]);

  // Roll new word with mini slot animation
  const rollNewWord = () => {
    if (!wordPool.length || isRolling) return;

    setIsRolling(true);
    setCopied(false);

    const finalWord = getRandom(wordPool);

    // quick roll effect
    rollIntervalRef.current = setInterval(() => {
      setDisplayWord(getRandom(wordPool));
      if (soundsOn && tickSoundRef.current) {
        tickSoundRef.current.currentTime = 0;
        tickSoundRef.current.play().catch(() => {});
      }
    }, 70);

    setTimeout(() => {
      if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);
      setCurrentWord(finalWord);
      setDisplayWord(finalWord);
      setIsRolling(false);
      if (soundsOn && clickSoundRef.current) {
        clickSoundRef.current.currentTime = 0;
        clickSoundRef.current.play().catch(() => {});
      }
    }, 900);
  };

  // Timer logic
  const startTimer = () => {
    if (timerRunning) return;
    if (timeLeft <= 0) setTimeLeft(baseDuration);

    setTimerRunning(true);

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          if (soundsOn && alarmSoundRef.current) {
            alarmSoundRef.current.currentTime = 0;
            alarmSoundRef.current.play().catch(() => {});
          }
          return 0;
        }

        // subtle tick every second
        if (soundsOn && tickSoundRef.current) {
          tickSoundRef.current.currentTime = 0;
          tickSoundRef.current.play().catch(() => {});
        }

        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    setTimerRunning(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setTimeLeft(baseDuration);
  };

  const handleDurationChange = (seconds) => {
    setBaseDuration(seconds);
    setTimeLeft(seconds);
  };

  const copyWord = async () => {
    try {
      await navigator.clipboard.writeText(currentWord);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error(err);
    }
  };

  const levelButtonStyle = (active) => ({
    padding: "0.35rem 0.9rem",
    borderRadius: 999,
    border: active ? "none" : "1px solid #d4d4d8",
    fontSize: "0.78rem",
    fontWeight: 600,
    cursor: "pointer",
    background: active ? "#fb7185" : "#ffffff",
    color: active ? "#ffffff" : "#4b5563",
    boxShadow: active ? "0 4px 10px rgba(248, 113, 113, 0.5)" : "none"
  });

  const langButtonStyle = (active) => ({
    padding: "0.25rem 0.7rem",
    borderRadius: 999,
    border: active ? "none" : "1px solid #e5e7eb",
    fontSize: "0.72rem",
    fontWeight: 600,
    cursor: "pointer",
    background: active ? "#22c55e" : "#ffffff",
    color: active ? "#ffffff" : "#4b5563"
  });

  const timerButtonStyle = {
    padding: "0.3rem 0.7rem",
    borderRadius: 999,
    border: "1px solid #e5e7eb",
    fontSize: "0.72rem",
    cursor: "pointer",
    background: "#ffffff",
    color: "#4b5563"
  };

  return (
    <>
      <main className="page">
        <div className="board-card">
          {/* header */}
          <header className="header">
            <div className="title-wrapper">
              <h1>Sorry What?! 🎤</h1>
              <div className="underline" />
            </div>
            <p>
              Random lyric-style word. Kakantahin mo sya, hulaan ng iba kung ano.
              Perfect pang–barkada at pang–DGroup game night. 🎶
            </p>
          </header>

          {/* timer + settings bar */}
          <section className="timer-bar">
            <div className="timer-circle">
              <span className="timer-label">timer</span>
              <span className="timer-value">
                {formatTime(timeLeft)}
              </span>
              <div className="timer-controls">
                {!timerRunning ? (
                  <button onClick={startTimer}>Start</button>
                ) : (
                  <button onClick={pauseTimer}>Pause</button>
                )}
                <button onClick={resetTimer}>Reset</button>
              </div>
            </div>

            <div className="timer-settings">
              <div className="row">
                <span className="mini-label">Duration</span>
                <div className="chips">
                  {[30, 60, 90].map((sec) => (
                    <button
                      key={sec}
                      style={{
                        ...timerButtonStyle,
                        background:
                          baseDuration === sec ? "#fee2e2" : "#ffffff",
                        borderColor:
                          baseDuration === sec ? "#fb7185" : "#e5e7eb",
                        fontWeight: baseDuration === sec ? 700 : 500
                      }}
                      onClick={() => handleDurationChange(sec)}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>

              <div className="row">
                <span className="mini-label">Sounds</span>
                <button
                  style={{
                    ...timerButtonStyle,
                    background: soundsOn ? "#bbf7d0" : "#fee2e2",
                    borderColor: soundsOn ? "#22c55e" : "#f97316",
                    fontWeight: 700
                  }}
                  onClick={() => setSoundsOn((s) => !s)}
                >
                  {soundsOn ? "On 🔊" : "Muted 🤫"}
                </button>
              </div>
            </div>
          </section>

          {/* controls */}
          <section className="controls">
            <div className="control-group">
              <label>Difficulty</label>
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
            </div>

            <div className="control-group">
              <label>Language</label>
              <div className="level-group">
                <button
                  style={langButtonStyle(language === "tagalog")}
                  onClick={() => setLanguage("tagalog")}
                >
                  Tagalog
                </button>
                <button
                  style={langButtonStyle(language === "english")}
                  onClick={() => setLanguage("english")}
                >
                  English
                </button>
                <button
                  style={langButtonStyle(language === "mixed")}
                  onClick={() => setLanguage("mixed")}
                >
                  Halo-halo
                </button>
              </div>
            </div>
          </section>

          {/* word card */}
          <section className="word-area">
            <div className={isRolling ? "word-card rolling" : "word-card"}>
              <span className="paper-pin">📎</span>
              <span className="word-label">sing this word</span>
              <span className="word-text">{displayWord}</span>
            </div>
          </section>

          {/* action buttons */}
          <section className="buttons">
            <button
              className="primary-btn"
              onClick={rollNewWord}
              disabled={isRolling || !wordPool.length}
            >
              {isRolling ? "Nagro-roll..." : "New word 🎲"}
            </button>
            <button className="secondary-btn" onClick={copyWord}>
              {copied ? "Kinopya na! ✅" : "Copy word 📋"}
            </button>
          </section>

          <p className="footer-note">
            Mechanics idea: isa kakanta gamit ang word, bawal sabihin nang direkta.
            Team with most correct guesses wins. 💃🕺
          </p>
        </div>
      </main>

      {/* styles */}
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
          max-width: 720px;
          background: #fefeff;
          border-radius: 26px;
          padding: 1.7rem 1.6rem 1.3rem;
          box-shadow: 0 22px 60px rgba(148, 163, 184, 0.5);
          border: 1px solid #e4e4e7;
        }

        .header {
          margin-bottom: 1.2rem;
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
          background: #bfdbfe;
          opacity: 0.9;
          transform: rotate(-1deg);
        }

        .header p {
          margin: 0.5rem 0 0;
          font-size: 0.85rem;
          color: #6b7280;
        }

        /* timer bar */

        .timer-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: center;
          margin-bottom: 1.2rem;
        }

        .timer-circle {
          width: 180px;
          height: 180px;
          border-radius: 999px;
          background: radial-gradient(circle at top, #fee2e2, #fecaca);
          box-shadow: 0 18px 40px rgba(248, 113, 113, 0.5);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .timer-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: rgba(31, 41, 55, 0.7);
        }

        .timer-value {
          font-size: 2rem;
          font-weight: 900;
          margin-top: 0.1rem;
        }

        .timer-controls {
          display: flex;
          gap: 0.4rem;
          margin-top: 0.2rem;
        }

        .timer-controls button {
          border-radius: 999px;
          border: none;
          padding: 0.25rem 0.7rem;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          background: #f9fafb;
        }

        .timer-controls button:first-of-type {
          background: #22c55e;
          color: white;
        }

        .timer-settings {
          flex: 1;
          min-width: 220px;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.8rem;
        }

        .chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }

        .mini-label {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #9ca3af;
          white-space: nowrap;
        }

        /* controls */

        .controls {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.1rem;
        }

        .control-group {
          flex: 1 1 220px;
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

        .level-group {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        /* word area */

        .word-area {
          margin-bottom: 1rem;
        }

        .word-card {
          position: relative;
          min-height: 150px;
          border-radius: 18px;
          padding: 1rem 1.2rem 1.3rem;
          background: #fef9c3;
          box-shadow:
            0 16px 35px rgba(148, 163, 184, 0.6),
            inset 0 0 0 1px rgba(253, 224, 71, 0.7);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .word-card.rolling {
          animation: wobble 0.2s linear infinite;
        }

        .paper-pin {
          position: absolute;
          top: 0.4rem;
          right: 0.9rem;
          font-size: 1.1rem;
        }

        .word-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: rgba(55, 65, 81, 0.8);
          margin-bottom: 0.2rem;
        }

        .word-text {
          font-size: 2.1rem;
          font-weight: 900;
          text-transform: lowercase;
        }

        @keyframes wobble {
          0% {
            transform: translateY(3px) rotate(-1.5deg);
          }
          50% {
            transform: translateY(-3px) rotate(1.5deg);
          }
          100% {
            transform: translateY(3px) rotate(-1.5deg);
          }
        }

        .buttons {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          margin-bottom: 0.6rem;
        }

        .primary-btn {
          border: none;
          border-radius: 999px;
          padding: 0.9rem 1rem;
          font-size: 0.95rem;
          font-weight: 600;
          background: linear-gradient(135deg, #6366f1, #ec4899);
          color: #ffffff;
          cursor: pointer;
          box-shadow: 0 14px 30px rgba(129, 140, 248, 0.6);
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

        .footer-note {
          margin: 0;
          font-size: 0.78rem;
          color: #9ca3af;
          text-align: center;
        }

        @media (max-width: 720px) {
          .board-card {
            padding: 1.5rem 1.3rem 1.2rem;
          }

          .timer-bar {
            flex-direction: column;
            align-items: stretch;
          }

          .timer-circle {
            margin: 0 auto;
          }
        }
      `}</style>
    </>
  );
}
