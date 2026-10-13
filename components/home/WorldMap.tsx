import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import world from "world-atlas/land-110m.json";

/* Top client countries (Search Console, last 3 months) with approximate centroids. */
const COUNTRIES: [string, number, number][] = [
  ["India", 78.9, 21.5], ["United States", -98.5, 39.5], ["Nigeria", 8.0, 9.5], ["Philippines", 122.5, 12.5], ["United Kingdom", -2.0, 53.5],
  ["Pakistan", 69.5, 30.0], ["Kenya", 37.9, 0.5], ["United Arab Emirates", 54.2, 24.0], ["Turkey", 35.2, 39.0], ["Ghana", -1.2, 7.9],
  ["Bangladesh", 90.3, 23.7], ["South Africa", 24.5, -29.0], ["Australia", 134.0, -25.5], ["Nepal", 84.1, 28.3], ["Mexico", -102.5, 23.6],
  ["Germany", 10.4, 51.1], ["Qatar", 51.2, 25.3], ["Cameroon", 12.3, 5.5], ["Saudi Arabia", 45.0, 24.0], ["Sri Lanka", 80.7, 7.8],
  ["Jamaica", -77.3, 18.1], ["Vietnam", 106.0, 16.5], ["Morocco", -6.5, 32.0], ["Uganda", 32.3, 1.3], ["Egypt", 30.0, 26.5],
  ["Ethiopia", 39.5, 9.0], ["Algeria", 2.6, 28.0], ["Iran", 53.7, 32.4], ["Indonesia", 113.9, -1.5], ["Brazil", -51.9, -10.5],
  ["Singapore", 103.8, 1.35], ["Zimbabwe", 29.9, -19.0], ["Spain", -3.7, 40.2], ["Malaysia", 102.0, 4.0], ["France", 2.3, 46.6],
  ["Hong Kong", 114.2, 22.3], ["Netherlands", 5.3, 52.2], ["Kuwait", 47.8, 29.3], ["Thailand", 100.9, 15.8], ["Japan", 138.0, 36.5],
];
const HQ: [string, number, number] = ["Surrey, BC · Can X Global HQ", -122.85, 49.19];

export default function WorldMap() {
  const W = 1000, H = 520;
  const projection = geoNaturalEarth1().scale(205).translate([W / 2, H / 2 + 20]);
  const path = geoPath(projection);
  const topo = world as unknown as Topology<{ land: GeometryCollection }>;
  const land = feature(topo, topo.objects.land);
  const d = path(land) || "";
  const pts = COUNTRIES.map(([n, lon, lat]) => ({ n, p: projection([lon, lat]) as [number, number] })).filter((x) => x.p);
  const hq = projection([HQ[1], HQ[2]]) as [number, number];

  return (
    <div className="mapwrap">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Map of countries where Can X Global clients come from, with headquarters in Surrey, British Columbia">
        <path className="land" d={d} />
        {pts.map(({ n, p }, i) => (
          <g key={n} className="pt" transform={`translate(${p[0]},${p[1]})`}>
            <circle className="ring" r={6} style={{ animationDelay: `${(i % 9) * 0.3}s` }} />
            <circle className="dot" r={3.4} />
            <text x={8} y={-7}>{n}</text>
            <title>{n}</title>
          </g>
        ))}
        <g className="pt hq" transform={`translate(${hq[0]},${hq[1]})`}>
          <circle className="ring" r={8} />
          <circle className="dot" r={5} />
          <text x={10} y={-9}>{HQ[0]}</text>
          <title>{HQ[0]}</title>
        </g>
      </svg>
      <div className="legend">
        <span><i style={{ background: "#d52b1e" }} />Headquarters, Surrey BC</span>
        <span><i style={{ background: "#1967b0" }} />Clients served (hover a dot)</span>
      </div>
    </div>
  );
}
