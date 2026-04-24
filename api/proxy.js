export default async function handler(req, res) {
  const response = await fetch("http://209.14.84.172:443", {
    method: req.method,
    headers: req.headers,
    body: req.method !== "GET" ? req.body : undefined
  });

  const data = await response.arrayBuffer();
  res.status(response.status).send(Buffer.from(data));
}
