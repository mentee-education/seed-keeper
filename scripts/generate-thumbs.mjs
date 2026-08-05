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
const SCENES = {
  "Food Systems": "a thriving Indigenous Three Sisters garden — corn, beans and squash — or heritage seeds, traditional foods, or hands working desert farmland",
  "Water Systems": "a desert river, irrigation acequia, water testing in a stream, monsoon rain over mesas, or hands cupping clear water",
  "Energy Systems": "solar panels above desert crops (agrivoltaics), golden sunlight on renewable energy infrastructure in Southwest tribal landscapes",
  "Astronomy & Sky Knowledge": "a brilliant night sky over desert mesas — the Milky Way, constellations, or a warm campfire under the stars",
  "Indigenous Pedagogy": "outdoor land-based learning — an educator and students in a garden, on desert land, or gathered in a learning circle",
  "Curriculum & Standards": "a warm teacher's workspace — printed lesson plans, woven textiles, natural materials, cornmeal and seeds arranged on a wooden desk",
  "Learning Through Literature": "beautifully bound books, storytelling by warm light, or an open illustrated book with Southwest desert motifs",
};

function promptFor(r) {
  const focus = [r.focusArea, r.subject !== "All" ? r.subject : ""].filter(Boolean).join(", ");
  return [
    `Warm documentary-style editorial photograph for a K-12 education resource library rooted in Indigenous knowledge of the American Southwest.`,
    `Depict: ${SCENES[r.category] || "desert land-based education"}.`,
    `This specific resource is about: "${r.title}"${focus ? ` (${focus})` : ""}. Let that guide the scene's details.`,
    `Golden-hour desert light. Earthy palette: terracotta, sage green, turquoise, ochre, warm cream.`,
    `Respectful, natural, grounded. No text, no words, no logos, no watermarks, no borders. No close-up identifiable faces.`,
    `16:9 landscape composition, shallow depth of field, professional photography.`,
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
