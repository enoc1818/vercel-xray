export const config = { runtime: "edge" };

export default async function handler(req) {
  const TARGET = process.env.TARGET_DOMAIN; // Ex: http://209.14.84.172.nip.io:1080/fogueteak

  try {
    const url = new URL(req.url);
    const targetUrl = TARGET + url.pathname + url.search;

    const newHeaders = new Headers(req.headers);
    
    // Extrai o host do alvo para não dar erro de segurança
    const hostName = new URL(TARGET).host;
    newHeaders.set("Host", hostName);

    return await fetch(targetUrl, {
      method: req.method,
      headers: newHeaders,
      body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
      redirect: "manual",
      duplex: "half",
    });
  } catch (err) {
    return new Response("Erro de Conexão: " + err.message, { status: 502 });
  }
}
