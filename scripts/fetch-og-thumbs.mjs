#!/usr/bin/env node
/*
  Fetch each resource's REAL og:image / twitter:image from its source page
  and upload to R2 at seedkeeper/thumbs/<id>.jpg. Authentic photos only —
  no AI. MD5-dedupes across the run so the same site-wide banner is never
  used for two resources (rule: every image appears once on the site).

  Usage: node scripts/fetch-og-thumbs.mjs [--force]
*/
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, ".og-thumbs-work");
const R2_PUB = "https://pub-d9b63a5f579448e18f36563d7f73323f.r2.dev";
process.env.CLOUDFLARE_ACCOUNT_ID ||= "166e99f62e33e3376505261c29ddc6c1";
const force = process.argv.includes("--force");
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

const src = readFileSync(path.join(ROOT, "client/src/data/resources.ts"), "utf8");
const field = (chunk, name) => (chunk.match(new RegExp(`${name}: "([^"]*)"`)) || [])[1] ?? "";
const items = src.split(/\{\s*\n\s*id: "/).slice(1).map((c) => {
  c = `id: "` + c;
  return { id: field(c, "id"), url: field(c, "url"), youtubeId: field(c, "youtubeId") };
}).filter((r) => r.id && r.url.startsWith("http") && !r.youtubeId && !r.id.startsWith("yt-"));
console.log(`Candidates: ${items.length}`);

mkdirSync(OUT, { recursive: true });
const seenHashes = new Set();
let ok = 0, skipped = 0, nores = 0;

async function fetchText(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetch(url, { signal: ctrl.signal, redirect: "follow", headers: { "User-Agent": UA, Accept: "text/html,*/*" } });
    if (!res.ok) return null;
    return { text: await res.text(), base: res.url };
  } catch { return null; } finally { clearTimeout(t); }
}

function extractOgImage(html, base) {
  const metas = [
    /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
  ];
  for (const re of metas) {
    const m = html.match(re);
    if (m) { try { return new URL(m[1].replace(/&amp;/g, "&"), base).href; } catch {} }
  }
  return null;
}

for (const r of items) {
  const key = `thumbs/${r.id}.jpg`;
  try {
    if (!force) {
      const head = await fetch(`${R2_PUB}/${key}`, { method: "HEAD" });
      if (head.ok) { skipped++; continue; }
    }
    const page = await fetchText(r.url);
    if (!page) { nores++; continue; }
    const imgUrl = extractOgImage(page.text, page.base);
    if (!imgUrl) { nores++; continue; }
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 25000);
    const imgRes = await fetch(imgUrl, { signal: ctrl.signal, headers: { "User-Agent": UA } }).catch(() => null);
    clearTimeout(t);
    if (!imgRes || !imgRes.ok) { nores++; continue; }
    const buf = Buffer.from(await imgRes.arrayBuffer());
    if (buf.length < 8000) { nores++; continue; } // tiny logo/placeholder
    const hash = createHash("md5").update(buf).digest("hex");
    if (seenHashes.has(hash)) { nores++; continue; } // duplicate banner — never reuse
    const raw = path.join(OUT, `${r.id}.raw`);
    const jpg = path.join(OUT, `${r.id}.jpg`);
    writeFileSync(raw, buf);
    // validate dimensions + convert
    let w = 0, h = 0;
    try {
      const info = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", raw], { stdio: "pipe" }).toString();
      w = parseInt((info.match(/pixelWidth: (\d+)/) || [])[1] || "0");
      h = parseInt((info.match(/pixelHeight: (\d+)/) || [])[1] || "0");
    } catch { nores++; continue; }
    if (w < 480 || h < 240 || w / h > 3.2 || w / h < 0.8) { nores++; continue; }
    execFileSync("sips", ["-Z", "800", "-s", "format", "jpeg", raw, "--out", jpg], { stdio: "pipe" });
    execFileSync("npx", ["wrangler", "r2", "object", "put", `seedkeeper/${key}`, "--file", jpg, "--remote"], { stdio: "pipe", cwd: ROOT });
    seenHashes.add(hash);
    ok++;
    console.log(`✓ ${r.id} (${w}x${h})`);
  } catch (e) {
    nores++;
    console.log(`✗ ${r.id} ${String(e).slice(0, 80)}`);
  }
}
console.log(`\nDone: ${ok} uploaded, ${skipped} already existed, ${nores} no usable image`);
