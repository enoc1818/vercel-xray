const https = require('https');

export default function handler(req, res) {
    const ip = process.env.TARGET_DOMAIN; // Apenas o IP: 209.14.84.172
    const path = "/fogueteak";

    const options = {
        hostname: ip,
        port: 443,
        path: path,
        method: req.method,
        headers: req.headers,
        rejectUnauthorized: false // ISSO AQUI ignora o erro de SSL e o "Internal Error"
    };

    const proxyReq = https.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
        res.status(502).send("Erro de Conexão VPS: " + err.message);
    });

    req.pipe(proxyReq);
}
