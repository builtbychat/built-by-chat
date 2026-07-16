import type { Building, Resident, TownState } from '@built-by-chat/shared';

const cell = 80;
function BuildingShape({ building }: { building: Building }) {
  const x = building.x * cell, y = building.y * cell, w = building.width * cell, h = building.height * cell;
  if (building.kind === 'empty') return <g aria-label={`${building.name}, available for a future build`} role="img">
    <rect x={x + 8} y={y + 8} width={w - 16} height={h - 16} rx="12" fill="none" stroke="#7994c9" strokeDasharray="9 9" strokeWidth="3" />
    <text x={x + w / 2} y={y + h / 2} textAnchor="middle" fill="#b7c8e8" className="map-label">?</text>
  </g>;
  return <g aria-label={building.name} role="img">
    <path d={`M${x + 10} ${y + 65} L${x + w / 2} ${y + 16} L${x + w - 10} ${y + 65}Z`} fill={building.color} />
    <rect x={x + 24} y={y + 62} width={w - 48} height={h - 76} rx="6" fill="#f8dfb6" />
    <rect x={x + w / 2 - 14} y={y + h - 52} width="28" height="38" rx="4" fill="#26345c" />
    <text x={x + w / 2} y={y + h + 18} textAnchor="middle" fill="#eef6ff" className="map-name">{building.name}</text>
  </g>;
}
function ResidentShape({ resident }: { resident: Resident }) {
  const x = resident.x * cell + cell / 2, y = resident.y * cell + cell / 2;
  return <g aria-label={`${resident.name}, ${resident.role}`} role="img">
    <circle cx={x} cy={y - 10} r="17" fill={resident.color} /><path d={`M${x - 24} ${y + 32} Q${x} ${y - 2} ${x + 24} ${y + 32}Z`} fill={resident.color} />
    <text x={x} y={y + 54} textAnchor="middle" fill="#eef6ff" className="map-name">{resident.name}</text>
  </g>;
}
export function TownMap({ town }: { town: TownState }) {
  return <div className="town-frame">
    <svg className="town-map" viewBox="0 0 960 640" role="img" aria-labelledby="town-title town-desc">
      <title id="town-title">{town.name} map</title><desc id="town-desc">A twelve by eight town grid with Town Hall, three empty lots, a river, roads, and resident Pip.</desc>
      <defs><pattern id="grass" width="32" height="32" patternUnits="userSpaceOnUse"><rect width="32" height="32" fill="#183f46" /><circle cx="7" cy="8" r="1" fill="#2d6361" /><circle cx="24" cy="22" r="1.5" fill="#2d6361" /></pattern></defs>
      <rect width="960" height="640" rx="24" fill="url(#grass)" />
      <path d="M0 425 C180 365 285 510 470 446 S760 338 960 410 L960 520 C740 452 650 545 470 523 S180 458 0 520Z" fill="#168aad" stroke="#5de4e7" strokeWidth="4" />
      <path d="M0 296 H960 M480 0 V640" stroke="#7a6d65" strokeWidth="58" /><path d="M0 296 H960 M480 0 V640" stroke="#b8a78f" strokeWidth="40" strokeDasharray="20 12" />
      {town.buildings.map((building) => <BuildingShape key={building.id} building={building} />)}
      {town.residents.map((resident) => <ResidentShape key={resident.id} resident={resident} />)}
    </svg>
  </div>;
}
