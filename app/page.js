"use client";

import { useState, useRef, useEffect } from "react";

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

// ─── WORD LISTS ──────────────────────────────────

// easy verbs / subjects
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

// medium verbs / subjects
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

// hard verbs / subjects
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

// ─── HELPERS ─────────────────────────────────────

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// genre is decorative for now (no filter yet, para less bug-prone)

export default function Home() {
  const [genre, setGenre] = useState("all");
  const [level, setLevel] = useState("easy");

  const [verb, setVerb] = useState("laba");
  const [subject, setSubject] = useState("paa");
  const [displayVerb, setDisplayVerb] = useState("laba");
  const [displaySubject, setDisplaySubject] = useState("paa");

  const [copied, setCopied] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const spinIntervalRef = useRef(null);
  const spinTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
    };
  }, []);

  const getPools = () => {
    let verbs = easyVerbs;
    let subjects = easySubjects;

    if (level === "medium") {
      verbs = mediumVerbs;
      subjects = mediumSubjects;
    } else if (level === "hard") {
      verbs = hardVerbs;
      subjects = hardSubjects;
    }

    return { verbs, subjects };
  };

  const phrase = `${displayVerb} ${displaySubject}`;

  const shuffle = () => {
    if (isSpinning) return;

    const { verbs, subjects } = getPools();
    if (!verbs.length || !subjects.length) return;

    const finalVerb = getRandom(verbs);
    const finalSubject = getRandom(subjects);

    setIsSpinning(true);
    setCopied(false);

    spinIntervalRef.current = setInterval(() => {
      setDisplayVerb(getRandom(verbs));
      setDisplaySubject(getRandom(subjects));
    }, 60);

    spinTimeoutRef.current = setTimeout(() => {
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
      setVerb(finalVerb);
      setSubject(finalSubject);
      setDisplayVerb(finalVerb);
      setDisplaySubject(finalSubject);
      setIsSpinning(false);
    }, 700);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${verb} ${subject}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const levelButtonStyle = (active) => ({
    padding: "0.35rem 0.9rem",
    borderRadius: 999,
    border: active ? "none" : "1px solid #e5e7eb",
    fontSize: "0.75rem",
    fontWeight: 600,
    cursor: "pointer",
    background: active ? "#0f172a" : "#ffffff",
    color: active ? "#f9fafb" : "#4b5563"
  });

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f97316 0%, #ec4899 40%, #6366f1 100%)",
        display: "fxlex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1.5rem",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      <div
        style={{
          maxWidth: 540,
          width: "100%",
          background: "rgba(255,255,255,0.96)",
          borderRadius: 24,
          padding: "1.75rem 1.5rem 1.5rem",
          boxShadow: "0 20px 40px rgba(15, 23, 42, 0.25)"
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem"
          }}
        >
          <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>
            Hanu Daw? 🤯
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "#6b7280"
            }}
          >
            Taglish mashup generator
          </div>
        </div>

        {/* Genre + Level controls */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            marginBottom: "1rem"
          }}
        >
          <div style={{ flex: "1 1 140px" }}>
            <div
              style={{
                fontSize: "0.7rem",
                color: "#6b7280",
                marginBottom: "0.25rem"
              }}
            >
              Genre
            </div>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              style={{
                width: "100%",
                borderRadius: 999,
                border: "1px solid #e5e7eb",
                padding: "0.4rem 0.75rem",
                fontSize: "0.8rem",
                background: "#ffffff"
              }}
            >
              {genres.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              display: "flex",
              gap: "0.4rem",
              alignItems: "flex-end",
              flexWrap: "wrap"
            }}
          >
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

        {/* Phrase card */}
        <div
          style={{
            borderRadius: 20,
            padding: "1.75rem 1.25rem",
            marginBottom: "1.25rem",
            textAlign: "center",
            background: "#0f172a"
          }}
        >
          <div
            style={{
              fontSize: "2.1rem",
              fontWeight: 800,
              color: "#f9fafb",
              wordBreak: "break-word",
              lineHeight: 1.1
            }}
          >
            {phrase}
          </div>
          <div
            style={{
              marginTop: "0.75rem",
              fontSize: "0.8rem",
              color: "#e5e7eb"
            }}
          >
            Verb: <b>{verb}</b> • Subject: <b>{subject}</b>
          </div>
          <div
            style={{
              marginTop: "0.35rem",
              fontSize: "0.7rem",
              color: "#e5e7eb"
            }}
          >
            Genre: <b>{genres.find((g) => g.value === genre)?.label}</b> · Level:{" "}
            <b>{level.toUpperCase()}</b>
          </div>
        </div>

        {/* Buttons */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <button
            onClick={shuffle}
            disabled={isSpinning}
            style={{
              border: "none",
              borderRadius: 999,
              padding: "0.8rem 1rem",
              fontSize: "0.95rem",
              fontWeight: 600,
              background: isSpinning
                ? "#9ca3af"
                : "linear-gradient(135deg, #f97316 0%, #ec4899 50%, #6366f1 100%)",
              color: "#f9fafb",
              cursor: isSpinning ? "not-allowed" : "pointer"
            }}
          >
            {isSpinning ? "Nagro-roll..." : "Hanu daw ulit? 🔁"}
          </button>

          <button
            onClick={copyToClipboard}
            style={{
              borderRadius: 999,
              padding: "0.75rem 1rem",
              fontSize: "0.9rem",
              fontWeight: 500,
              border: "1px solid #e5e7eb",
              background: "#ffffff",
              color: "#111827",
              cursor: "pointer"
            }}
          >
            {copied ? "Kinopya na! ✅" : "Copy sa clipboard 📋"}
          </button>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "0.9rem",
            fontSize: "0.7rem",
            color: "#6b7280",
            textAlign: "center"
          }}
        >
          Pang-couple, pang-kids, pang-DGroup icebreaker. 😆
        </div>
      </div>
    </main>
  );
}
