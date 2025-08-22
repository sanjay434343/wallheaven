import fetch from "node-fetch";

const API_KEY = "f91j7adetGDMtnNR7R9nKyDVETTXEd6u";

const allowedFilters = [
  "q", "categories", "purity", "sorting", "order",
  "topRange", "atleast", "resolutions", "ratios",
  "colors", "page", "seed"
];

// Helper for CORS preflight response
function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req, res) {
  setCorsHeaders(res);

  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  try {
    const queryParams = Object.entries(req.query)
      .filter(([key]) => allowedFilters.includes(key))
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    const wallhavenUrl = `https://wallhaven.cc/api/v1/search?apikey=${API_KEY}&${queryParams}`;

    const response = await fetch(wallhavenUrl);
    if (!response.ok) {
      const errMsg = await response.text();
      return res.status(response.status).json({ error: errMsg || "Error fetching from Wallhaven" });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
