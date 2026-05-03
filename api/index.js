export const config = { runtime: "edge" };

export default async function handler(req) {
  // Use o IP direto para evitar erro de DNS do nip.io
  const TARGET = "http://209.14.84.172:1080/fogueteak"; 

  try {
    const { pathname, search } = new URL(req.url);
    
    return await fetch(TARGET + search, {
      method: req.method,
      headers: req.headers,
      body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
      duplex: "half",
    });
  } catch (err) {
    return new Response("Falha Fatal: " + err.message, { status: 502 });
  }
}
