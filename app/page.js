"use client";

import { useState, useMemo } from "react";

const easyVerbs = [
  "laba",
  "hugas",
  "linis",
  "ayos",
  "tiklop",
  "timpla",
  "pulot",
  "hatid",
  "sundo",
  "love",
  "alaga",
  "lambing",
  "unawa",
  "patawad",
  "respect",
  "protect",
  "yakap",
  "halik"
];

const mediumVerbs = [
  ...easyVerbs,
  "asikaso",
  "aruga",
  "kulitan",
  "sabay",
  "usap",
  "cheer",
  "tiis",
  "piglas",
  "bati",
  "kampi"
];

const hardVerbs = [
  ...mediumVerbs,
  "screenshot",
  "tago",
  "singhot",
  "pitik",
  "dakma",
  "kindat",
  "paamoy",
  "pa-charge",
  "supsup"
];

const easySubjects = [
  "paa",
  "kamay",
  "ulo",
  "puso",
  "pisngi",
  "tuhod",
  "likod",
  "tiyan",
  "buhok",
  "mata",
  "ngipin",
  "kilay",
  "feelings",
  "tampuhan",
  "trust",
  "time",
  "lambing quota",
  "playlist",
  "snacks",
  "kape",
  "kumot",
  "unan",
  "sinampay"
];

const mediumSubjects = [
  ...easySubjects,
  "grocery list",
  "love language",
  "hugot",
  "date plans",
  "kulitan session",
  "sermon",
  "pasensya",
  "pangarap"
];

const hardSubjects = [
  ...mediumSubjects,
  "kilikili",
  "siko",
  "pusod",
  "kiliti spot",
  "medyas",
  "walis",
  "tabo",
  "kutsara",
  "baso",
  "suka",
  "creamer",
  "radish"
];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function Home() {
  const [level, setLevel] = useState("easy");

  const [customVerbsInput, setCustomVerbsInput] = useState("laba, hugas, yakap");
  const [customSubjectsInput, setCustomSubjectsInput] = useState(
    "paa, feelings, tampuhan"
  );

  const [verb, setVerb] = useState("laba");
  const [subject, setSubject] = useState("kilay");
  const [copied, setCopied] = useState(false);

  const phrase = `${verb} ${subject}`;

  const customVerbs = useMemo(
    () =>
      customVerbsInput
        .split(/[,|\n]/)
        .map((v) => v.trim())
        .filter(Boolean),
    [customVerbsInput]
  );

  const customSubjects = useMemo(
    () =>
      customSubjectsInput
        .split(/[,|\n]/)
        .map((v) => v.trim())
        .filter(Boolean),
    [customSubjectsInput]
  );

  const getCurrentVerbs = () => {
    if (level === "easy") return easyVerbs;
    if (level === "medium") return mediumVerbs;
    if (level === "hard") return hardVerbs;
    return customVerbs.length ? customVerbs : easyVerbs;
  };

  const getCurrentSubjects = () => {
    if (level === "easy") return easySubjects;
    if (level === "medium") return mediumSubjects;
    if (level === "hard") return hardSubjects;
    return customSubjects.length ? customSubjects : easySubjects;
  };

  const shuffle = () => {
    const verbs = getCurrentVerbs();
    const subjects = getCurrentSubjects();
    setVerb(getRandom(verbs));
    setSubject(getRandom(subjects));
    setCopied(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(phrase);
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

  const isCustomEmpty =
    level === "custom" && (customVerbs.length === 0 || customSubjects.length === 0);

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
          maxWidth: 520,
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
            Taglish couple mashups
          </div>
        </div>

        {/* Level selector */}
        <div
          style={{
            display: "flex",
            gap: "0.4rem",
            marginBottom: "1rem",
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
          <button
            style={levelButtonStyle(level === "custom")}
            onClick={() => setLevel("custom")}
          >
            Custom
          </button>
        </div>

        {/* Phrase card */}
        <div
          style={{
            background: "#0f172a",
            borderRadius: 20,
            padding: "1.75rem 1.25rem",
            marginBottom: "1.25rem",
            textAlign: "center"
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
              color: "#9ca3af"
            }}
          >
            Verb: <b>{verb}</b> • Subject: <b>{subject}</b>
          </div>
          <div
            style={{
              marginTop: "0.35rem",
              fontSize: "0.7rem",
              color: "#6b7280"
            }}
          >
            Level: <b>{level.toUpperCase()}</b>
          </div>
        </div>

        {/* Custom editor */}
        {level === "custom" && (
          <div
            style={{
              marginBottom: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem"
            }}
          >
            <div style={{ fontSize: "0.8rem", color: "#4b5563" }}>
              Lagyan mo ng sarili mong words. Separate by comma or new line.
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.6rem"
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.7rem",
                    marginBottom: "0.25rem",
                    color: "#6b7280"
                  }}
                >
                  Custom Verbs
                </label>
                <textarea
                  value={customVerbsInput}
                  onChange={(e) => setCustomVerbsInput(e.target.value)}
                  rows={4}
                  style={{
                    width: "100%",
                    fontSize: "0.8rem",
                    borderRadius: 10,
                    border: "1px solid #e5e7eb",
                    padding: "0.4rem 0.5rem",
                    resize: "vertical"
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.7rem",
                    marginBottom: "0.25rem",
                    color: "#6b7280"
                  }}
                >
                  Custom Subjects
                </label>
                <textarea
                  value={customSubjectsInput}
                  onChange={(e) => setCustomSubjectsInput(e.target.value)}
                  rows={4}
                  style={{
                    width: "100%",
                    fontSize: "0.8rem",
                    borderRadius: 10,
                    border: "1px solid #e5e7eb",
                    padding: "0.4rem 0.5rem",
                    resize: "vertical"
                  }}
                />
              </div>
            </div>
            {isCustomEmpty && (
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "#b91c1c",
                  marginTop: "0.2rem"
                }}
              >
                Maglagay ka muna ng at least 1 verb at 1 subject para gumana ang
                shuffle.
              </div>
            )}
          </div>
        )}

        {/* Buttons */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <button
            onClick={shuffle}
            disabled={isCustomEmpty}
            style={{
              border: "none",
              borderRadius: 999,
              padding: "0.8rem 1rem",
              fontSize: "0.95rem",
              fontWeight: 600,
              background: isCustomEmpty
                ? "#9ca3af"
                : "linear-gradient(135deg, #f97316 0%, #ec4899 50%, #6366f1 100%)",
              color: "#f9fafb",
              cursor: isCustomEmpty ? "not-allowed" : "pointer"
            }}
          >
            Hanu daw ulit? 🔁
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

        {/* Footer text */}
        <div
          style={{
            marginTop: "0.9rem",
            fontSize: "0.7rem",
            color: "#6b7280",
            textAlign: "center"
          }}
        >
          Pang-couple, pang-barkada, pang-DGroup icebreaker. 😆
        </div>
      </div>
    </main>
  );
}
