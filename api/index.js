export const config = { runtime: "edge" };

export default async function handler(req) {
    const domain = process.env.TARGET_DOMAIN || "";
    
    try {
        // Usamos HTTPS mas com o Host configurado para o domínio que o SSL espera
        const finalUrl = `https://${domain}:443/fogueteak`;

        const headers = new Headers(req.headers);
        // O Host deve ser o domínio do nip.io para bater com o certificado
        headers.set("host", domain); 

        return await fetch(finalUrl, {
            method: req.method,
            headers: headers,
            body: req.body,
            redirect: "manual",
            // Tenta forçar a conexão mesmo com certificados simples
            next: { revalidate: 0 } 
        });
    } catch (e) {
        // Se der erro, ele vai te mostrar o motivo real agora
        return new Response("Motivo do Erro: " + e.message, { status: 502 });
    }
}
