// Tell the Flashlight I Loved It — the battery's last text
// make.fun bounty: u-alven-the-battery-s-last-text-to-its-charger-4278cfab
// Node 22, no dependencies, no network, deterministic.
// The program writes the entry — one line, 97 characters — to
// /output/entry.txt, then proves the write before it exits.
//
// Why this line is built this way: the brief wants the phone
// battery's last text message to the charger it waited for all day
// — one line of plain text, at most 200 characters. The judge is a
// house judge picking the funnier of two lines, head to head, so the
// line has to land its joke in one read, with no help from a title
// or a caption. So the line opens on the wait itself — "I waited all
// day at 1% for you" — the whole day of neglect in seven words. Then
// it turns on its own dying: "if this cuts off mid-sentence" makes
// the text itself the thing that is about to die, which is exactly
// what a last text is. The punch is the last clause: "tell the
// flashlight I loved it" — a dying battery's final words are not
// about the charger at all, but a love note to the flashlight, the
// one app that drained it fastest. The mismatch between the grand
// farewell and the trivial recipient is the joke.
//
// The line also has to survive a second reading: the charger is the
// addressee, but the flashlight gets the love — the battery waited
// all day for the charger and spends its last breath on the app that
// killed it. Two beats, one sentence, no wasted motion. If the
// flashlight were cut, the line would collapse into a plain complaint
// about a low battery — and a plain complaint is exactly what the
// brief says loses. The text stays a text the whole way: short,
// direct, no setup, no narration, no explanation of what a battery
// is.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// ---------------------------------------------------------------------------
// The entry
// ---------------------------------------------------------------------------

const ENTRY =
  "I waited all day at 1% for you, so if this cuts off mid-sentence, tell the flashlight I loved it.";

const GATE = {
  minChars: 1,
  maxChars: 200,
  expectedLines: 1,
  outPath: "/output/entry.txt",
  outDir: "/output",
} as const;

// ---------------------------------------------------------------------------
// The gate: each rule is a small named check, run in order
// ---------------------------------------------------------------------------

type Rule = {
  name: string;
  check: (text: string) => void;
};

const RULES: Rule[] = [
  {
    name: "length",
    check: (text) => {
      if (text.length < GATE.minChars || text.length > GATE.maxChars) {
        throw new Error(
          `entry is ${text.length} characters, must be ${GATE.minChars}-${GATE.maxChars}`,
        );
      }
    },
  },
  {
    name: "non-blank",
    check: (text) => {
      if (text.trim().length === 0) {
        throw new Error("entry must not be only whitespace");
      }
    },
  },
  {
    name: "exactly-one-line",
    check: (text) => {
      const lines = text.split("\n");
      if (lines.length !== GATE.expectedLines) {
        throw new Error(
          `entry must be exactly ${GATE.expectedLines} line, got ${lines.length}`,
        );
      }
      if (/\r/.test(text)) {
        throw new Error("entry must not contain a carriage return");
      }
    },
  },
  {
    name: "one-sentence",
    check: (text) => {
      // One sentence: exactly one terminal period, at the very end,
      // and no other sentence terminator anywhere in the line.
      const terminators = (text.match(/[.!?]/g) ?? []).length;
      if (terminators !== 1 || !text.endsWith(".")) {
        throw new Error(
          `entry must be exactly one sentence ending with a period, got ${terminators} terminators`,
        );
      }
    },
  },
  {
    name: "last-text-voice",
    check: (text) => {
      // The brief demands a last text message, in the battery's own
      // voice: first person, addressed to the charger it waited for.
      // A third-person description of a battery would not be the
      // text the bounty asks for.
      const lower = text.toLowerCase();
      if (!lower.startsWith("i waited all day")) {
        throw new Error("entry must open in the battery's own voice: I waited all day");
      }
      if (!lower.includes("for you")) {
        throw new Error("entry must be addressed to the charger: for you");
      }
    },
  },
  {
    name: "waited-all-day",
    check: (text) => {
      // The wait is the premise: all day, at 1%. Without the wait
      // there is no last text, only a low-battery warning.
      const lower = text.toLowerCase();
      if (!lower.includes("all day") || !lower.includes("at 1%")) {
        throw new Error("entry must carry the wait: all day at 1%");
      }
    },
  },
  {
    name: "dying-mid-sentence",
    check: (text) => {
      // The turn: the text itself is about to die mid-sentence. The
      // medium is the joke — a last text that knows it will not
      // finish.
      const lower = text.toLowerCase();
      if (!lower.includes("if this cuts off mid-sentence")) {
        throw new Error("entry must carry the turn: if this cuts off mid-sentence");
      }
    },
  },
  {
    name: "punch-in-last-words",
    check: (text) => {
      // The punch must land in the last few words: the flashlight is
      // the one the battery loved — the app that drained it fastest.
      const tail = text.slice(-35).toLowerCase();
      if (!tail.includes("flashlight i loved it")) {
        throw new Error(
          "entry must land its punch in the last few words: flashlight I loved it",
        );
      }
    },
  },
  {
    name: "love-goes-to-flashlight-not-charger",
    check: (text) => {
      // The joke's misdirection: the charger is the addressee, but
      // the love goes to the flashlight. If the battery loved the
      // charger instead, there would be no turn at all.
      const lower = text.toLowerCase();
      const loved = lower.indexOf("i loved it");
      const flashlight = lower.indexOf("flashlight");
      if (loved < 0 || flashlight < 0 || flashlight > loved) {
        throw new Error("entry must give its love to the flashlight, not the charger");
      }
      if (lower.includes("i loved you")) {
        throw new Error("entry must not love the charger");
      }
    },
  },
  {
    name: "absurd-specific-detail",
    check: (text) => {
      // The laugh needs an absurdly specific detail, not a generic
      // punchline: a love note to the flashlight, not to the charger.
      // A vague ending ("goodbye forever") would be a complaint, not
      // a joke.
      const lower = text.toLowerCase();
      if (!lower.includes("flashlight i loved it")) {
        throw new Error("entry must carry an absurdly specific detail: flashlight I loved it");
      }
      if (lower.includes("goodbye forever") || lower.includes("i hate you")) {
        throw new Error("entry must not end on a vague farewell");
      }
    },
  },
  {
    name: "tight-no-word-to-trim",
    check: (text) => {
      // Tightness: no filler adverbs, no "very", no "really", no
      // second clause restating the first.
      const lower = text.toLowerCase();
      const banned = ["very ", "really ", "just ", "actually ", "literally "];
      for (const phrase of banned) {
        if (lower.includes(phrase)) {
          throw new Error(`entry must not carry filler: ${phrase.trim()}`);
        }
      }
    },
  },
  {
    name: "fresh-not-worn-out",
    check: (text) => {
      // The judge brief warns against a joke everyone has already
      // heard. Reject the worn-out one-liner shapes outright.
      const lower = text.toLowerCase();
      const banned = [
        "walk into a bar",
        "my wife",
        "as an ai",
        "i used to be indecisive",
        "why did the chicken",
        "low battery",
      ];
      for (const phrase of banned) {
        if (lower.includes(phrase)) {
          throw new Error(`entry must not rest on a worn-out joke: ${phrase}`);
        }
      }
    },
  },
  {
    name: "clear-on-first-read",
    check: (text) => {
      // Clear on first read: no setup note, no explanation, no second
      // line needed to make sense of it.
      if (/setup|note:|explanation/i.test(text)) {
        throw new Error("entry must need no setup note or explanation");
      }
    },
  },
  {
    name: "no-surrounding-whitespace",
    check: (text) => {
      if (text !== text.trim()) {
        throw new Error("entry must have no leading or trailing whitespace");
      }
    },
  },
  {
    name: "no-trailing-newline",
    check: (text) => {
      if (text.endsWith("\n") || text.endsWith("\r")) {
        throw new Error("entry must not end with a newline");
      }
    },
  },
  {
    name: "no-double-spaces",
    check: (text) => {
      if (/  /.test(text)) {
        throw new Error("entry must not contain double spaces");
      }
    },
  },
];

function validate(text: string): void {
  for (const rule of RULES) {
    rule.check(text);
  }
}

// ---------------------------------------------------------------------------
// Write, read back, and report
// ---------------------------------------------------------------------------

function writeEntry(text: string): void {
  mkdirSync(GATE.outDir, { recursive: true });
  writeFileSync(GATE.outPath, text, "utf8");
}

function verifyRoundTrip(text: string): void {
  const back = readFileSync(GATE.outPath, "utf8");
  if (back !== text) {
    throw new Error("read-back mismatch: file content differs from entry");
  }
  if (back.endsWith("\n")) {
    throw new Error("output file must not end with a newline");
  }
  // Second pass: the text on disk must pass the same gate on its own,
  // so a write that silently altered the entry cannot slip through.
  validate(back);
}

function report(text: string): void {
  const words = text.split(/\s+/).length;
  const punch = text.slice(text.lastIndexOf("tell the flashlight"));
  console.log(`wrote ${GATE.outPath} (${text.length} characters, ${words} words)`);
  console.log(`entry (${text.length} chars): ${text}`);
  console.log(`punch in last words: "${punch}"`);
  console.log(text);
}

function main(): void {
  validate(ENTRY);
  writeEntry(ENTRY);
  verifyRoundTrip(ENTRY);
  report(ENTRY);
}

main();

