const https = require('https');

export default function (req, res) {
    const ip = process.env.TARGET_DOMAIN; // Apenas o IP: 209.14.84.172
    const path = "/fogueteak";

    const options = {
        hostname: ip,
        port: 443,
        path: path,
        method: req.method,
        headers: { ...req.headers },
        rejectUnauthorized: false
    };

    // Remove o host original para não causar conflito de SSL
    delete options.headers.host;

    const proxyReq = https.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
        res.status(502).end("Erro VPS: " + err.message);
    });

    req.pipe(proxyReq);
}
