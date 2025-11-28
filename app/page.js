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
    "status", "story", "feed", "reaction", "comment"
