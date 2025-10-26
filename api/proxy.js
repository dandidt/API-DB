// api/proxy.js
// ✅ Vercel serverless function (Node.js runtime)

const TARGET_URL = process.env.TARGET_URL || 'https://script.google.com/macros/s/AKfycbx6QdpBKkL9Xiu7lG9M38DI32PdfRDe1bWJ4-wUIMwB2VsdWO4cQzL7fBPvM2Iy-8zOQg/exec';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    const url = new URL(TARGET_URL);
    Object.keys(req.query || {}).forEach(k => url.searchParams.append(k, req.query[k]));

    const headers = {};
    if (req.headers['content-type']) headers['Content-Type'] = req.headers['content-type'];
    if (req.headers['authorization']) headers['Authorization'] = req.headers['authorization'];

    const fetchOptions = {
      method: req.method,
      headers,
      body: ['GET', 'HEAD'].includes(req.method)
        ? undefined
        : req.body
        ? JSON.stringify(req.body)
        : undefined,
    };

    const r = await fetch(url.toString(), fetchOptions);
    const contentType = r.headers.get('content-type') || 'application/json';
    res.setHeader('Content-Type', contentType);
    const text = await r.text();

    res.status(r.status).send(text);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'proxy_error', message: String(err) });
  }
};
