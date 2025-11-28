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

// ---------- WORD LISTS (shared across genres per level) ----------

// easy
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

// medium
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

// hard
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

// ---------- GENRE "PREFERRED WORDS" (used as weights) ----------

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

// instead of hard filter, genre words get WEIGHTED (mas madalas lumabas pero hindi lang sila)
function getWeightedPool(base, genreValue, map) {
  if (genreValue === "all") return base;
  const set = map[genreValue];
  if (!set) return base;

  const inGenre = base.filter((w) => set.has(w));
  const outGenre = base.filter((w) => !set.has(w));

  if (!inGenre.length) return base;

  // triple the in-genre items para mas mataas chance
  return [...inGenre, ...inGenre, ...inGenre, ...outGenre];
}

function getRandomCardBg() {
  const hue = Math.floor(Math.random() * 360);
  const hue2 = (hue + 40) % 360;
  return `linear-gradient(135deg, hsl(${hue} 80% 15%), hsl(${hue2} 80% 25%))`;
}

function getRandomWordStyle() {
  const hue = Math.floor(Math.random() * 360);
  const lightness = 35 + Math.random() * 30; // 35–65
  const bg = `hsl(${hue} 85% ${lightness}%)`;
  const color = lightness > 55 ? "#111827" : "#f9fafb"; // auto-contrast
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
  const [cardBg, setCardBg] = useState(getRandomCardBg());
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
      setCardBg(getRandomCardBg());
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
    }
  };

  const levelButtonStyle = (active) => ({
    padding: "0.4rem 1rem",
    borderRadius: 999,
    border: active ? "none" : "1px solid #e5e7eb",
    fontSize: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
    background: active ? "#0f172a" : "#ffffff",
    color: active ? "#f9fafb" : "#4b5563"
  });

  return (
    <>
      <main
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #f97316 0%, #ec4899 40%, #6366f1 100%)",
          display: "flex",
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
          {/* Title */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "1.25rem"
            }}
          >
            <div
              style={{
                fontWeight: 900,
                fontSize: "1.7rem",
                letterSpacing: "0.03em",
                background:
                  "linear-gradient(120deg, #f97316, #ec4899, #6366f1)",
                WebkitBackgroundClip: "text",
                color: "transparent"
              }}
            >
              Hanu Daw? 🤯
            </div>
            <div
              style={{
                fontSize: "0.8rem",
                color: "#6b7280",
                marginTop: "0.25rem"
              }}
            >
              Taglish mashup generator para sa mga walang kausap sa gabi. 😆
            </div>
          </div>

          {/* Genre + Level controls */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              marginBottom: "1.25rem"
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
                  padding: "0.45rem 0.75rem",
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
              padding: "1.6rem 1.25rem",
              marginBottom: "1.25rem",
              textAlign: "center",
              background: cardBg,
              transition: "background 0.3s ease"
            }}
          >
            {/* slot-style squares */}
            <div
              style={{
                display: "flex",
                gap: "0.2rem",
                justifyContent: "center",
                marginBottom: "0.75rem",
                flexWrap: "wrap"
              }}
            >
              <div
                className={isSpinning ? "word-box slot-rolling" : "word-box"}
                style={{
                  background: verbStyle.bg,
                  color: verbStyle.color
                }}
              >
                {displayVerb}
              </div>
              <div
                className={isSpinning ? "word-box slot-rolling" : "word-box"}
                style={{
                  background: subjectStyle.bg,
                  color: subjectStyle.color
                }}
              >
                {displaySubject}
              </div>
            </div>

            <div
              style={{
                fontSize: "0.8rem",
                color: "#e5e7eb",
                marginBottom: "0.25rem"
              }}
            >
              Verb: <b>{verb}</b> • Subject: <b>{subject}</b>
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                color: "#e5e7eb"
              }}
            >
              Genre: <b>{genres.find((g) => g.value === genre)?.label}</b> ·
              Level: <b>{level.toUpperCase()}</b>
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
                padding: "0.85rem 1rem",
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

      {/* slot-machine animation */}
      <style jsx>{`
        .word-box {
          width: 150px;
          height: 150px;
          border-radius: 0px;
          display: flex;
          align-items: center;
          justifyContent: center;
          font-size: 1.6rem;
          font-weight: 800;
          text-transform: lowercase;
        }

        .slot-rolling {
          animation: slot-spin 0.25s linear infinite;
        }

        @keyframes slot-spin {
          0% {
            transform: translateY(25px);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-25px);
            opacity: 1;
          }
          100% {
            transform: translateY(25px);
            opacity: 0.8;
          }
        }
      `}</style>
    </>
  );
}
