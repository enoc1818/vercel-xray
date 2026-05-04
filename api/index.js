process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import https from "https";
import http from "http";

const TARGET_BASE = (process.env.TARGET_DOMAIN || "").replace(/\/$/, "");

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
    const targetUrl = new URL(TARGET_BASE + url.pathname + url.search);

    const outHeaders = {};
    for (const [k, v] of Object.entries(req.headers)) {
      if (STRIP_HEADERS.has(k)) continue;
      if (k.startsWith("x-vercel-")) continue;
      outHeaders[k] = v;
    }

    const method = req.method;
    const hasBody = method !== "GET" && method !== "HEAD";
    const lib = targetUrl.protocol === "https:" ? https : http;

    await new Promise((resolve, reject) => {
      const proxyReq = lib.request({
        hostname: targetUrl.hostname,
        port: targetUrl.port || (targetUrl.protocol === "https:" ? 443 : 80),
        path: targetUrl.pathname + targetUrl.search,
        method,
        headers: outHeaders,
        rejectUnauthorized: false,
      }, (proxyRes) => {
        res.status(proxyRes.statusCode);
        for (const [k, v] of Object.entries(proxyRes.headers)) {
          res.setHeader(k, v);
        }
        proxyRes.pipe(res);
        proxyRes.on("end", resolve);
      });

      proxyReq.on("error", reject);

      if (hasBody) {
        req.pipe(proxyReq);
      } else {
        proxyReq.end();
      }
    });

  } catch (err) {
    console.error("relay error:", err);
    res.status(502).send("Bad Gateway: " + err.message);
  }
}
