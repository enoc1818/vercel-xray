export const config = { runtime: "edge" };

export default async function handler(req) {
  const TARGET = process.env.TARGET_DOMAIN; // http://209.14.84.172.nip.io:1080/fogueteak

  try {
    const targetUrl = new URL(TARGET);
    const url = new URL(req.url);
    
    // Monta a URL final preservando o path e os parâmetros
    const finalUrl = `${targetUrl.origin}${targetUrl.pathname}${url.search}`;

    return await fetch(finalUrl, {
      method: req.method,
      headers: req.headers, // Passa os headers originais sem mexer em nada
      body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
      redirect: "manual",
    });
  } catch (err) {
    // Se a rede cair, ele vai avisar aqui
    return new Response("Erro de Conexão: " + err.message, { status: 502 });
  }
}
