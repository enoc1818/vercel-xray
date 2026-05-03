const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({
    changeOrigin: true,
    secure: false // ISSO AQUI manda o SSL da VPS se ferrar e aceita a conexão
});

export default function handler(req, res) {
    // Pega o IP da sua variável (Ex: 209.14.84.172)
    const target = process.env.TARGET_DOMAIN;
    
    // Monta a URL ignorando as chatices da Vercel
    const finalUrl = `https://${target}:443/fogueteak`;

    proxy.web(req, res, { target: finalUrl }, (err) => {
        res.status(502).send("Erro de Conexão: " + err.message);
    });
}
