export const config = { runtime: "edge" };

export default async function handler(req) {
    const target = process.env.TARGET_DOMAIN || "";
    if (!target) return new Response("Variável TARGET_DOMAIN não encontrada", { status: 500 });

    try {
        const url = new URL(req.url);
        const proxyUrl = target.endsWith('/') ? target.slice(0, -1) : target;
        const finalUrl = proxyUrl + url.pathname + url.search;

        const headers = new Headers(req.headers);
        headers.set("host", new URL(proxyUrl).host);

        return await fetch(finalUrl, {
            method: req.method,
            headers: headers,
            body: req.body,
            redirect: "manual",
        });
    } catch (e) {
        return new Response("Erro de Conexão: " + e.message, { status: 502 });
    }
}
