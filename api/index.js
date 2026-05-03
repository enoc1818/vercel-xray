export const config = { runtime: "edge" };

export default async function handler(req) {
    const domain = process.env.TARGET_DOMAIN || "";
    
    try {
        // MUDAMOS PARA HTTPS AQUI EMBAIXO:
        const finalUrl = `https://${domain}:443/fogueteak`;

        const headers = new Headers(req.headers);
        headers.set("host", domain); 

        return await fetch(finalUrl, {
            method: req.method,
            headers: headers,
            body: req.body,
            redirect: "manual",
        });
    } catch (e) {
        return new Response("Erro no Script: " + e.message, { status: 502 });
    }
}
