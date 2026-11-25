// Unsent: The Micro-Confession Sprint
// Writes one two-part micro-confession (a To: line + the unsent line itself)
// to /output/entry.txt. No dependencies, no network.
//
// The program holds three invented confessions, scores each against the
// judge's own published criteria (in the judge's order), and writes the
// winner. Scoring is deterministic: same input, same output, every run.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type Confession = {
  id: string;
  to: string;
  line: string;
};

// All three confessions below were invented for this entry. Each names a
// role or a first name only, never a real full name or handle, and each
// carries a specific, honest detail plus a felt reason it stayed unsent.
const CANDIDATES: Confession[] = [
  {
    id: "dent",
    to: "Dimas, who lent me his motorbike in 2019",
    line: "i never told you the dent in the tank was mine, i said it was already there and i still hear myself lying every time i ride past your house",
  },
  {
    id: "letter",
    to: "my old English teacher, who kept my first poem",
    line: "i stopped writing the day you praised it because i was afraid the next one would prove you wrong about me",
  },
  {
    id: "shift",
    to: "Rani, who covered my night shift so i could sit my exam",
    line: "i passed because of you and i never said thank you properly because saying it out loud would mean admitting i could not have done it alone",
  },
];

// Judge criteria, in the judge's own order, weighted most-important-first.
// Each check is a plain, inspectable rule over the two parts.
function score(c: Confession): number {
  let points = 0;
  // 1. Two-part shape: a To: line naming the addressee + one message line.
  if (c.to.trim().length > 0 && c.line.trim().length > 0) points += 40;
  // 2. Felt reason it stayed in drafts: the line carries fear, guilt,
  //    lateness or kindness without stating the reason outright.
  const felt = /\b(afraid|never told|still hear|lying|guilt|too late|ashamed)\b/i;
  if (felt.test(c.line)) points += 25;
  // 3. The parts need each other: the message names a detail that only
  //    makes sense for this addressee (a shared object, event or debt).
  const sharedDetail = /\b(motorbike|tank|poem|night shift|exam|dent)\b/i;
  if (sharedDetail.test(c.line)) points += 20;
  // 4. Reads typed, never sent: lowercase, unpolished, no joke, no
  //    greeting, no motivational line.
  const typed = /^[a-z]/.test(c.line) && !/^(hi|hey|hello|good luck|you can do it)/i.test(c.line);
  if (typed) points += 10;
  // 5. One line, exactly as typed, no explanation after it.
  if (!c.line.includes("\n") && c.line.length <= 200) points += 5;
  return points;
}

function render(c: Confession): string {
  return `To: ${c.to}\n${c.line}\n`;
}

function main(): void {
  const ranked = [...CANDIDATES]
    .map((c) => ({ c, points: score(c) }))
    .sort((a, b) => b.points - a.points || a.c.id.localeCompare(b.c.id));
  const winner = ranked[0].c;
  const text = render(winner);

  // Gate, mirrored from the published rules: 1-260 chars total, message
  // one line of at most 200 chars, not only whitespace.
  if (text.length < 1 || text.length > 260) {
    throw new Error(`entry is ${text.length} chars, gate needs 1-260`);
  }
  if (winner.line.length > 200) {
    throw new Error(`message line is ${winner.line.length} chars, max 200`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry is only whitespace");
  }
  // The entry must be exactly two parts: one To: line and one message
  // line. Anything else loses to any two-part confession, so enforce it.
  const parts = text.replace(/\n$/, "").split("\n");
  if (parts.length !== 2 || !parts[0].startsWith("To: ")) {
    throw new Error(`entry must be exactly a To: line plus one message line, got ${parts.length} lines`);
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, text, "utf8");

  // Read back and refuse to report success unless the bytes match.
  const back = readFileSync(outPath, "utf8");
  if (back !== text) throw new Error("read-back mismatch on entry.txt");
  console.log(`wrote ${text.length} chars (${winner.id}, ${ranked[0].points}/100) to ${outPath}`);
  console.log(`scores: ${ranked.map((r) => `${r.c.id}=${r.points}`).join(", ")}`);
}

main();
