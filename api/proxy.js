// api/proxy.js
// Vercel Serverless (Node) — proxy ke Google Apps Script endpoint
// - reads TARGET_URL and ALLOWED_ORIGIN from env
// - handles OPTIONS (preflight), GET, POST, PUT, DELETE
// - proxies query params, body, and relevant headers

const TARGET_URL = process.env.TARGET_URL || 'https://script.google.com/macros/s/AKfycbx6QdpBKkL9Xiu7lG9M38DI32PdfRDe1bWJ4-wUIMwB2VsdWO4cQzL7fBPvM2Iy-8zOQg/exec';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*'; // better set to your GitHub Pages origin like "https://username.github.io"

export default async function handler(req, res) {
  // CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Vary', 'Origin');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    // If you want to allow credentials, also set:
    // res.setHeader('Access-Control-Allow-Credentials', 'true');
    return res.status(204).end();
  }

  try {
    // Build target URL with query string (if any)
    const url = new URL(TARGET_URL);
    // Append query params from incoming request
    Object.keys(req.query || {}).forEach(k => url.searchParams.append(k, req.query[k]));

    // Choose fetch options
    const headers = {};
    // Forward content-type if present
    if (req.headers['content-type']) headers['Content-Type'] = req.headers['content-type'];
    // Optionally forward an authorization header (if you need)
    if (req.headers['authorization']) headers['Authorization'] = req.headers['authorization'];

    const fetchOptions = {
      method: req.method,
      headers,
      // For GET/HEAD fetch should not have body
      body: ['GET','HEAD'].includes(req.method) ? undefined : req.body ? JSON.stringify(req.body) : undefined,
      // If you forward raw body (e.g., form-data) you would need to handle differently.
    };

    // If the incoming body was already a raw string (e.g., from fetch with JSON),
    // Vercel's req.body may be parsed; adjust as necessary.
    // Use global fetch (Node 18+) which is available in Vercel runtime.
    const r = await fetch(url.toString(), fetchOptions);

    // Copy response headers we care about
    const contentType = r.headers.get('content-type') || 'application/json';
    res.setHeader('Content-Type', contentType);

    const text = await r.text();

    // Forward status (200/404/500 from target)
    res.status(r.status).send(text);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'proxy_error', message: String(err) });
  }
}
