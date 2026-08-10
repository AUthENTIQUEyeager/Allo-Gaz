import { NextResponse } from "next/server";

// Proxy serveur vers Nominatim (OpenStreetMap) : evite les soucis CORS cote
// navigateur et respecte leur politique d'usage (User-Agent obligatoire).
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "lat et lon requis" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=16&addressdetails=1`,
      {
        headers: { "User-Agent": "AlloGaz/1.0 (contact@allogaz.bf)" },
        cache: "no-store"
      }
    );

    if (!res.ok) throw new Error("Service de geolocalisation indisponible");
    const data = await res.json();

    const addr = data.address || {};
    const neighborhood =
      addr.suburb || addr.neighbourhood || addr.quarter || addr.residential || addr.city_district || "";
    const city = addr.city || addr.town || addr.village || addr.county || "";

    return NextResponse.json({ neighborhood, city, displayName: data.display_name || "" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 502 });
  }
}
