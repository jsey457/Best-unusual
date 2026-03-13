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

  const incoming = new URL(req.url);

  // Grab the kalshi path — everything after ?path=
  const kalshiPath = incoming.searchParams.get("path") || "/markets/trades";

  // Build forwarded query string from all params EXCEPT "path"
  const forward = new URLSearchParams();
  for (const [k, v] of incoming.searchParams.entries()) {
    if (k !== "path") forward.append(k, v);
  }

  const qs = forward.toString();
  const upstream = `${KALSHI}${kalshiPath}${qs ? "?" + qs : ""}`;

  try {
    const res = await fetch(upstream, {
      headers: { "Content-Type": "application/json" }
    });
    const body = await res.text();
    return new Response(body, {
      status: res.status,
      headers: { ...CORS, "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message, upstream }), {
      status: 502,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
}
