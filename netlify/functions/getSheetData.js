const fetch = require('node-fetch');

exports.handler = async () => {
  try {
    const sheetUrl = "https://script.google.com/macros/s/AKfycbx6QdpBKkL9Xiu7lG9M38DI32PdfRDe1bWJ4-wUIMwB2VsdWO4cQzL7fBPvM2Iy-8zOQg/exec";
    const res = await fetch(sheetUrl);
    const data = await res.json();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
