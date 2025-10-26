export async function handler(event, context) {
  try {
    // Ganti ini dengan ID spreadsheet lo
    const SPREADSHEET_ID = "1VSNVwE_7tG-_VYMw2fXvR7KtqWtl-EwbljLoUcIFXEE";
    const SHEET_NAME = "AOT SMC TRADE";

    // URL export Google Sheet ke CSV (lebih gampang fetch)
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_NAME)}`;

    // pakai fetch global
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const csvText = await res.text();

    // ubah CSV jadi array
    const rows = csvText.split("\n").slice(3); // skip header baris awal (sesuaikan)
    const data = rows.map(row => {
      const cols = row.split(",");
      return {
        No: cols[0],
        Date: cols[1],
        Pairs: cols[2],
        Method: cols[3],
        Confluance: cols[4],
        RR: cols[5],
        Behavior: cols[6],
        Reason: cols[7],
        Causes: cols[8],
        Psychology: cols[9],
        Class: cols[10],
        Bias: cols[11],
        Last: cols[12],
        Pos: cols[13],
        Margin: cols[14],
        Result: cols[15],
        PnL: cols[16]
      };
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" // ⚡ CORS
      },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
