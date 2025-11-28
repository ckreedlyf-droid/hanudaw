"use client";

import { useState, useMemo, useRef, useEffect } from "react";

// ------------------ GENRES ------------------

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

// ------------------ WORD LISTS ------------------
// 50 easy verbs (daily / wholesome Taglish)
const easyVerbs = [
  "laba", "hugas", "linis", "ayos", "tiklop",
  "timpla", "kain", "inom", "tulog", "gising",
  "lakad", "takbo", "love", "kuha", "hatid",
  "sundo", "bili", "tapon", "pulot", "punas",
  "walis", "ligpit", "ligo", "suklay", "text",
  "tawag", "chat", "like", "share", "comment",
  "save", "follow", "send", "smile", "tawa",
  "yakap", "halik", "lambing", "asikaso", "alaga",
  "aruga", "bantay", "tulong", "pray", "kanta",
  "sayaw", "laro", "basa", "sulat", "kapit"
];

// 50 medium verbs (mas emotional / relational)
const mediumVerbs = [
  "kulitan", "asar", "tukso", "tiis", "intindi",
  "unawa", "tanggap", "salo", "buhat", "hatak",
  "tulak", "ipagluto", "ipagkape", "ipaghain", "makinig",
  "usap", "cheer", "comfort", "advise", "encourage",
  "support", "protect", "defend", "kampi", "bati",
  "bawi", "bantay", "sundo", "hatid", "sabay",
  "date", "kulong", "yakap-tight", "harot", "harana",
  "kulong-netflix", "surprise", "kulitan-chat", "paalala", "remind",
  "schedule", "plan", "organize", "budget", "ipon",
  "bayad", "invest", "delegate", "mentor", "coach"
];

// 50 hard verbs (weird / social / internet chaos)
const hardVerbs = [
  "screenshot", "screenrecord", "stalk", "ghost", "seenzone",
  "block", "unfollow", "mute", "react", "rant",
  "subtweet", "spill", "lurk", "doomscroll", "overthink",
  "panic-buy", "ubos-salary", "flex", "hagulgol", "singhot",
  "dakma", "pitik", "paamoy", "sampal-hangin", "sapak-joke",
  "tusok-fork", "harbat", "nakaw-kiss", "tusok-tanong", "paasa",
  "balik-ligo", "ulit-chat", "spam", "double-text", "triple-text",
  "left-on-read", "zoom-in", "crop", "filter", "auto-tune",
  "slowmo", "fastforward", "rewind", "pause", "skip",
  "repeat", "remix", "lag", "buffer", "cringe"
];

// 50 easy subjects (body + daily objects)
const easySubjects = [
  "paa", "kamay", "ulo", "puso", "pisngi",
  "tenga", "ilong", "buhok", "mata", "ngipin",
  "tuhod", "siko", "likod", "tiyan", "balikat",
  "palad", "kilay", "braso", "binti", "talampakan",
  "kumot", "unan", "kape", "tinapay", "kanin",
  "ulam", "sabaw", "baso", "tasa", "pinggan",
  "kutsara", "tinidor", "tabo", "walis", "medyas",
  "sapatos", "tsinelas", "bag", "payong", "keys",
  "wallet", "cellphone", "charger", "earphones", "notebook",
  "ballpen", "jacket", "towel", "remote", "id"
];

// 50 medium subjects (feelings / life stuff)
const mediumSubjects = [
  "feelings", "emotions", "tampuhan", "lambing", "tiwala",
  "oras", "pasensya", "pangarap", "plano", "lagay",
  "schedule", "deadline", "konsensya", "ego", "pride",
  "sikmura", "pagod", "gutom", "antok", "sweldo",
  "budget", "ipon", "gastos", "utang", "resibo",
  "allowance", "baon", "project", "task", "message",
  "inbox", "notification", "password", "account", "profile",
  "status", "story", "feed", "reaction", "comment",
  "like", "share", "struggle", "progress", "victory",
  "lesson", "habit", "routine", "secret", "goal"
];

// 50 hard subjects (social media / chismis / chaos)
const hardSubjects = [
  "ex", "thirdparty", "marites", "chismis", "issue",
  "tea", "screenshot", "receipts", "dm", "seen",
  "ghost", "blocklist", "mute-list", "timeline", "algorithm",
  "filter", "preset", "clout", "cancel", "toxic",
  "crush", "situationship", "delulu", "fantasy", "rizz",
  "aura", "vibes", "ego-trip", "mid", "stan",
  "fandom", "ship", "meme", "cringe", "ghosto",
  "lag", "buffer", "update", "patch", "archive",
  "draft", "spam", "scam", "phishing", "virus",
  "bug", "glitch", "drama", "tsismis", "timeline-war"
];

// ------------------ GENRE FILTERS ------------------
// these are "preferred words" per genre; if none match, we fall back to full list

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
    "kulitan", "asar", "tukso", "harot", "cheer"
  ]),
  christian: new Set([
    "pray", "kanta", "encourage", "support", "comfort",
    "advise", "unawa", "tanggap", "protect", "share",
    "basa", "sulat", "organize", "mentor", "coach"
  ]),
  social: new Set([
    "text", "tawag", "chat", "like", "share",
    "comment", "follow", "send", "screenshot", "screenrecord",
    "react", "subtweet", "spill", "lurk", "flex",
    "spam", "double-text", "triple-text", "zoom-in", "crop",
    "filter", "auto-tune", "slowmo", "fastforward", "remix"
  ]),
  genz: new Set([
    "flex", "doomscroll", "overthink", "panic-buy", "ubos-salary",
    "ghost", "seenzone", "block", "unfollow", "paasa",
    "spam", "double-text", "triple-text", "cringe", "remix"
  ]),
  millennial: new Set([
    "budget", "ipon", "bayad", "invest", "delegate",
    "mentor", "coach", "plan", "organize", "hatid",
    "sundo", "work", "pray", "kape", "tulog"
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
    "oras", "pasensya", "status", "story", "plano",
    "goal", "secret", "habit", "routine"
  ]),
  kids: new Set([
    "paa", "kamay", "ulo", "kape", // joke for parents
    "tinapay", "kanin", "ulam", "laruan", "gutom",
    "antok"
  ]),
  christian: new Set([
    "puso", "feelings", "konsensya", "ego", "pride",
    "lesson", "habit", "routine", "pangarap", "goal",
    "pray", "status"
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
    "resibo", "deadline", "project", "task", "coffee",
    "kape", "status"
  ]),
  boomer: new Set([
    "wallet", "keys", "resibo", "landline", "payong",
    "baon", "allowance", "sweldo", "utang", "drama"
  ])
};

// ------------------ HELPERS ------------------

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function filterByGenre(base, genreValue, map) {
  if (genreValue === "all") return base;
  const set = map[genreValue];
  if (!set) return base;
  const filtered = base.filter((word) => set.has(word));
  return filtered.length ? filtered : base;
}

function getRandomCardBg() {
  const hue = Math.floor(Math.random() * 360);
  const hue2 = (hue + 40) % 360;
  // dark-ish gradient so light text always readable
  return `linear-gradient(135deg, hsl(${hue} 80%% 20%%), hsl(${hue2} 80%% 30%%))`;
}

// ------------------ COMPONENT ------------------

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

  const spinIntervalRef = useRef(null);
  const spinTimeoutRef = useRef(null);

  useEffect(() => {
    // cleanup intervals on unmount
    return () => {
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
    };
  }, []);

  const currentVerbs = useMemo(() => {
    const base =
      level === "easy"
        ? easyVerbs
        : level === "medium"
        ? mediumVerbs
        : hardVerbs;
    return filterByGenre(base, genre, genreVerbMap);
  }, [level, genre]);

  const currentSubjects = useMemo(() => {
    const base =
      level === "easy"
        ? easySubjects
        : level === "medium"
        ? mediumSubjects
        : hardSubjects;
    return filterByGenre(base, genre, genreSubjectMap);
  }, [level, genre]);

  const phrase = `${displayVerb} ${displaySubject}`;

  const shuffle = () => {
    if (isSpinning) return;
    if (!currentVerbs.length || !currentSubjects.length) return;

    const finalVerb = getRandom(currentVerbs);
    const finalSubject = getRandom(currentSubjects);

    setIsSpinning(true);
    setCopied(false);

    // start "slot machine" roll
    spinIntervalRef.current = setInterval(() => {
      setDisplayVerb(getRandom(currentVerbs));
      setDisplaySubject(getRandom(currentSubjects));
    }, 60);

    spinTimeoutRef.current = setTimeout(() => {
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);

      setVerb(finalVerb);
      setSubject(finalSubject);
      setDisplayVerb(finalVerb);
      setDisplaySubject(finalSubject);
      setIsSpinning(false);
      setCardBg(getRandomCardBg());
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
            background: cardBg,
            transition: "background 0.3s ease"
            style={{
  background: cardBg,
  transition: "background 0.3s ease",
  color: "white",
  mixBlendMode: "normal",
  isolation: "isolate", // fixes blend bugs
}}

          }}
        >
       <div
  style={{
    fontSize: "2.1rem",
    fontWeight: 800,
    color: "white",
    mixBlendMode: "difference",
    wordBreak: "break-word",
    lineHeight: 1.1
  }}
>
  {phrase}
<div
  style={{
    marginTop: "0.75rem",
    fontSize: "0.8rem",
    color: "white",
    mixBlendMode: "difference"
  }}
>
  Verb: <b>{verb}</b> • Subject: <b>{subject}</b>
</div>

<div
  style={{
    marginTop: "0.35rem",
    fontSize: "0.7rem",
    color: "white",
    mixBlendMode: "difference"
  }}
>
  Genre: <b>{genres.find((g) => g.value === genre)?.label}</b> · Level:{" "}
  <b>{level.toUpperCase()}</b>
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
