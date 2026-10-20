// Edge password gate: blocks every request before the static files are served,
// so the site's bundle is not readable without the password.
import { next } from "@vercel/functions";

// The password is the SITE_PASSWORD env var on Vercel; with none set, nobody gets in.
const PASSWORD = (process.env.SITE_PASSWORD || "").trim().toUpperCase();
const COOKIE = "seedkeeper_access";

// Cookie value is a hash of the password, so it cannot be guessed and changing the password logs everyone out.
async function token() {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`seedkeeper:${PASSWORD}`));
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function loginPage(status = 401, message = "") {
  return new Response(
    `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>SeedKeeper</title>
<style>
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0a0a0a;font-family:system-ui,sans-serif;color:#eee}
  form{display:flex;flex-direction:column;gap:16px;padding:48px;border-radius:12px;background:#111;border:1px solid #222;width:100%;max-width:360px;box-sizing:border-box;margin:16px}
  .t{font-size:14px;color:#888;letter-spacing:2px;text-transform:uppercase;text-align:center}
  input{padding:12px 16px;border-radius:8px;border:1px solid #333;background:#0a0a0a;color:#fff;font-size:16px}
  button{padding:12px;border:0;border-radius:8px;background:#fff;color:#000;font-size:15px;font-weight:600;cursor:pointer}
  .err{margin:0;color:#ef4444;font-size:14px;text-align:center}
</style></head>
<body>
  <form method="POST" action="/">
    <div class="t">Password Required</div>
    <input name="password" type="password" placeholder="Enter password" aria-label="Password" autocomplete="current-password" autofocus required>
    <button type="submit">Enter</button>
    ${message ? `<p class="err" role="alert">${message}</p>` : ""}
  </form>
</body></html>`,
    { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex, nofollow" } },
  );
}

async function hasCookie(request) {
  if (!PASSWORD) return false;
  const cookies = request.headers.get("cookie") || "";
  return cookies.split(/;\s*/).includes(`${COOKIE}=${await token()}`);
}

export default async function middleware(request) {
  if (await hasCookie(request)) return next();
  if (request.method !== "POST") return loginPage();

  let submitted = "";
  try {
    submitted = String((await request.formData()).get("password") || "");
  } catch {
    submitted = "";
  }
  if (!PASSWORD || submitted.trim().toUpperCase() !== PASSWORD) return loginPage(401, "Incorrect password. Please try again.");

  const url = new URL(request.url);
  const isHttps = url.protocol === "https:" || request.headers.get("x-forwarded-proto") === "https";
  const res = new Response(null, { status: 303, headers: { location: new URL("/", request.url).toString() } });
  res.headers.append("set-cookie", `${COOKIE}=${await token()}; Path=/; HttpOnly;${isHttps ? " Secure;" : ""} SameSite=Lax; Max-Age=604800`);
  return res;
}

export const config = {
  matcher: ["/((?!robots.txt).*)"],
};
