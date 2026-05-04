import https from "https";

const TARGET_BASE = (process.env.TARGET_DOMAIN || "").replace(/\/$/, "");
const agent = new https.Agent({ rejectUnauthorized: false });

const STRIP_HEADERS = new Set([
  "host", "connection", "keep-alive",
  "proxy-authenticate", "proxy-authorization",
  "te", "trailer", "transfer-encoding", "upgrade",
  "forwarded", "x-forwarded-host", "x-forwarded-proto",
  "x-forwarded-port",
]);

export default async function handler(req, res) {
  if (!TARGET_BASE) {
    return res.status(500).send("Misconfigured: TARGET_DOMAIN is not set");
  }

  try {
    const url = new URL(req.url, `https://${req.headers.host}`);
    const targetUrl = TARGET_BASE + url.pathname + url.search;

    const out = {};
    for (const [k, v] of Object.entries(req.headers)) {
      if (STRIP_HEADERS.has(k)) continue;
      if (k.startsWith("x-vercel-")) continue;
      out[k] = v;
    }

    const method = req.method;
    const hasBody = method !== "GET" && method !== "HEAD";

    const response = await fetch(targetUrl, {
      method,
      headers: out,
      body: hasBody ? req : undefined,
      redirect: "manual",
      agent,
    });

    res.status(response.status);
    response.headers.forEach((v, k) => res.setHeader(k, v));
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));

  } catch (err) {
    console.error("relay error:", err);
    res.status(502).send("Bad Gateway: " + err.message);
  }
}
