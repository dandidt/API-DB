// gunakan global fetch (Node >= 18) → Netlify Functions sudah Node 22
export async function handler(event, context) {
  const url = "https://script.google.com/macros/s/AKfycbx6QdpBKkL9Xiu7lG9M38DI32PdfRDe1bWJ4-wUIMwB2VsdWO4cQzL7fBPvM2Iy-8zOQg/exec";

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Google Script fetch failed: ${res.status}`);
    const data = await res.json();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ error: err.message })
    };
  }
}

