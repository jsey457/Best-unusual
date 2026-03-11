export const config = { runtime: "edge" };

const KALSHI = "https://api.elections.kalshi.com/trade-api/v2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default async function handler(req) {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path") || "/markets/trades";

  // Build remaining params WITHOUT the 'path' key
  const forward = new URLSearchParams();
  for (const [k, v] of searchParams.entries()) {
    if (k !== "path") forward.append(k, v);
  }

  const qs = forward.toString();
  const upstream = `${KALSHI}${path}${qs ? "?" + qs : ""}`;

  try {
    const res = await fetch(upstream);
    const body = await res.text();
    return new Response(body, {
      status: res.status,
      headers: { ...CORS, "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 502,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
}
