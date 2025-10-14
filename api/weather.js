// api/weather.js
// Vercel Node serverless function that proxies the SEMERU API.
// Returns JSON with CORS and short cache.

export default async function handler(req, res) {
  // Handle preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  try {
    const sourceUrl = process.env.SEMERU_SOURCE_URL || "https://meteojuanda.id/share/api-semeru/aws.json";

    const fetchResp = await fetch(sourceUrl, { method: "GET" });
    if (!fetchResp.ok) {
      return res.status(502).json({ error: "Upstream fetch failed", status: fetchResp.status });
    }

    const data = await fetchResp.json();

    // Set headers: JSON, CORS (adjust origin in production), short cache
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "https://semeru-iota.vercel.app/"); // untuk production: ganti "*" dengan domain-mu
    res.setHeader("Cache-Control", "public, max-age=30, s-maxage=60"); // cache singkat (30s browser, 60s CDN)

    return res.status(200).json(data);
  } catch (err) {
    console.error("Error in /api/weather:", err);
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({ error: "internal_error", detail: String(err) });
  }
}
