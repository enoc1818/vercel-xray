const https = require('https');

module.exports = (req, res) => {
    const targetIp = process.env.TARGET_DOMAIN; // Ex: 209.14.84.172
    const path = "/fogueteak";

    const options = {
        hostname: targetIp,
        port: 443,
        path: path,
        method: req.method,
        headers: req.headers,
        rejectUnauthorized: false // IGNORA ERRO DE SSL
    };

    const proxyReq = https.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
        res.status(502).setHeader('Content-Type', 'text/plain');
        res.end("Erro na VPS: " + err.message);
    });

    req.pipe(proxyReq);
};
