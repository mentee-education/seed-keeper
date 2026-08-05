#!/usr/bin/env node
/*
  Generate a photographic thumbnail for every resource in
  client/src/data/resources.ts using the Gemini image model, then upload
  each to R2 at seedkeeper/thumbs/<id>.webp (public bucket).

  Usage:
    GEMINI_API_KEY=... node scripts/generate-thumbs.mjs [--only id1,id2] [--force]

  - Skips resources whose thumbnail already exists on R2 (unless --force).
  - Requires: wrangler auth (CLOUDFLARE_ACCOUNT_ID is set below), `sips` (macOS).
*/
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, ".thumbs-work");
const R2_PUB = "https://pub-d9b63a5f579448e18f36563d7f73323f.r2.dev";
const BUCKET = "seedkeeper";
const MODEL = "gemini-2.5-flash-image";
const KEY = process.env.GEMINI_API_KEY;
if (!KEY) {
  console.error("Set GEMINI_API_KEY");
  process.exit(1);
}
process.env.CLOUDFLARE_ACCOUNT_ID ||= "166e99f62e33e3376505261c29ddc6c1";

const args = process.argv.slice(2);
const force = args.includes("--force");
const onlyArg = args.find((a) => a.startsWith("--only"));
const only = onlyArg ? (onlyArg.split("=")[1] ?? args[args.indexOf(onlyArg) + 1]).split(",") : null;

// ── Parse resources.ts (field-order agnostic) ─────────────────────────────────
const src = readFileSync(path.join(ROOT, "client/src/data/resources.ts"), "utf8");
const field = (chunk, name) => (chunk.match(new RegExp(`${name}: "([^"]*)"`)) || [])[1] ?? "";
const blocks = src
  .split(/\{\s*\n\s*id: "/)
  .slice(1)
  .map((chunk) => {
    chunk = `id: "` + chunk;
    return {
      id: field(chunk, "id"),
      title: field(chunk, "title"),
      organization: field(chunk, "organization"),
      summary: field(chunk, "summary"),
      category: field(chunk, "category"),
      gradeLevel: field(chunk, "gradeLevel"),
      subject: field(chunk, "subject"),
      resourceType: field(chunk, "resourceType"),
      focusArea: field(chunk, "focusArea"),
    };
  })
  .filter((r) => r.id && r.title && r.category);
console.log(`Parsed ${blocks.length} resources from resources.ts`);

// ── Prompt construction ───────────────────────────────────────────────────────
// Several distinct scenes per category + rotating light/composition, so
// same-category thumbnails read as a varied real photo library, not renders.
const SCENES = {
  "Food Systems": [
    "rows of heritage corn in a working desert field, drip irrigation line visible",
    "a wooden crate of freshly harvested squash and beans on red earth",
    "close detail of multicolored heritage corn kernels drying on a rack",
    "raised garden beds with young bean and squash plants, adobe wall behind",
    "wild desert food plants — prickly pear fruit, mesquite pods — growing naturally",
  ],
  "Water Systems": [
    "a shallow desert creek running over gravel, cottonwoods on the bank",
    "an irrigation acequia channel carrying water through farmland",
    "monsoon clouds building over dry rangeland, first rain visible in the distance",
    "a river winding through a canyon seen from the rim",
    "water sampling bottles and field notebook on a rock beside a stream",
  ],
  "Energy Systems": [
    "solar panels mounted above rows of crops on a working farm",
    "a small off-grid solar array beside a rural home, mountains behind",
    "detail of a solar panel surface reflecting clouds",
    "power lines and a wind turbine on open rangeland under a big sky",
    "a weather monitoring station on a desert plot",
  ],
  "Astronomy & Sky Knowledge": [
    "the Milky Way over a dark desert horizon",
    "a crescent moon and bright planets above mesa silhouettes at dusk",
    "star trails circling above a lone juniper tree",
    "a telescope set up on open desert ground at twilight",
    "constellations above a dimly glowing canyon at night",
  ],
  "Indigenous Pedagogy": [
    "an empty brush ramada shelter over a dirt floor classroom space",
    "a circle of log benches around a cold fire ring near a garden",
    "a footpath winding through sage brush toward mesas",
    "a woven blanket on the ground holding river stones, corn, and a hand drum",
    "a garden gate standing open onto rows of young plants",
  ],
  "Curriculum & Standards": [
    "printed lesson plans and a pencil on a worn wooden desk",
    "a stack of three-ring binders beside a potted plant on a classroom shelf",
    "index cards, sticky notes and a planner spread on a work table",
    "an open filing box of labeled folders in warm window light",
    "a chalkboard-side desk with papers, seeds in a dish, and a woven mat",
  ],
  "Learning Through Literature": [
    "a stack of well-used hardcover books on a wooden table",
    "an open picture book showing desert landscape illustrations",
    "a reading nook with a woven blanket and a shelf of books",
    "a single book lying on a porch rail with desert beyond",
    "library shelves in warm light, spines slightly worn",
  ],
};

const LIGHTS = [
  "soft overcast daylight, neutral color",
  "clear mid-morning light",
  "late-afternoon warm light, long shadows",
  "cool early-morning light, slight haze",
  "bright midday sun, honest contrast",
];
const COMPS = [
  "eye-level medium shot",
  "close detail shot, shallow depth of field",
  "wide establishing shot",
  "slightly elevated three-quarter view",
  "low angle from ground level",
];

// deterministic per-id hash so re-runs produce the same variety
function hashCode(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function promptFor(r) {
  const focus = [r.focusArea, r.subject !== "All" ? r.subject : ""].filter(Boolean).join(", ");
  const scenes = SCENES[r.category] || ["a Southwest desert landscape tied to land-based education"];
  const h = hashCode(r.id);
  const scene = scenes[h % scenes.length];
  const light = LIGHTS[Math.floor(h / 7) % LIGHTS.length];
  const comp = COMPS[Math.floor(h / 13) % COMPS.length];
  return [
    `Authentic documentary photograph for a K-12 education resource library rooted in Indigenous knowledge of the American Southwest.`,
    `Scene: ${scene}. ${comp}, ${light}.`,
    `This resource is about: "${r.title}"${focus ? ` (${focus})` : ""} — let that quietly inform the details.`,
    `Looks like a real photo from a working archive: natural color grading, realistic exposure, subtle imperfections, shot on 35mm film. NOT oversaturated, NOT HDR, NOT dreamy or cinematic, no fantasy elements.`,
    `Earthy palette bias: terracotta, sage, ochre, warm neutrals.`,
    `STRICTLY NO PEOPLE: no human figures, no faces, no hands, no silhouettes. No text, no words, no logos, no watermarks, no borders.`,
    `16:9 landscape composition.`,
  ].join(" ");
}

// ── Gemini call ───────────────────────────────────────────────────────────────
async function generate(prompt, attempt = 1) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { imageConfig: { aspectRatio: "16:9" } },
      }),
    }
  );
  if (res.status === 429 || res.status >= 500) {
    if (attempt > 5) throw new Error(`Giving up after ${attempt} attempts (${res.status})`);
    const wait = Math.min(60, 5 * 2 ** attempt);
    console.log(`  rate/server ${res.status}, retry in ${wait}s`);
    await new Promise((r) => setTimeout(r, wait * 1000));
    return generate(prompt, attempt + 1);
  }
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  const part = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part) throw new Error(`No image in response: ${JSON.stringify(data).slice(0, 300)}`);
  return Buffer.from(part.inlineData.data, "base64");
}

async function exists(url) {
  const res = await fetch(url, { method: "HEAD" });
  return res.ok;
}

// ── Main loop ─────────────────────────────────────────────────────────────────
mkdirSync(OUT, { recursive: true });
let queue = only ? blocks.filter((b) => only.includes(b.id)) : blocks;
let done = 0, skipped = 0, failed = [];

for (const r of queue) {
  const key = `thumbs/${r.id}.jpg`;
  const pub = `${R2_PUB}/${key}`;
  if (!force && (await exists(pub))) { skipped++; continue; }
  try {
    const png = path.join(OUT, `${r.id}.png`);
    const webp = path.join(OUT, `${r.id}.jpg`);
    if (force || !existsSync(webp)) {
      process.stdout.write(`[${done + skipped + failed.length + 1}/${queue.length}] ${r.id} ${r.title.slice(0, 50)}… `);
      const buf = await generate(promptFor(r));
      writeFileSync(png, buf);
      // resize to 800w and convert to webp
      execFileSync("sips", ["-Z", "800", "-s", "format", "jpeg", png, "--out", webp], { stdio: "pipe" });
    }
    execFileSync("npx", ["wrangler", "r2", "object", "put", `${BUCKET}/${key}`, "--file", webp, "--remote"], { stdio: "pipe", cwd: ROOT });
    console.log("✓");
    done++;
  } catch (e) {
    console.log(`✗ ${String(e).slice(0, 160)}`);
    failed.push(r.id);
  }
}
console.log(`\nDone: ${done} generated+uploaded, ${skipped} already existed, ${failed.length} failed`);
if (failed.length) console.log("Failed ids:", failed.join(","));
