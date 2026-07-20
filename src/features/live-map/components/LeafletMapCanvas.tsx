import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useRef, useState } from 'react';

import type { TrackedMember } from '../live-map.types';

// Fix Leaflet default icon paths (broken in bundlers)
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Status colour palette
const STATUS_COLOURS: Record<string, { bg: string; border: string; ring: string }> = {
  online:  { bg: '#22c55e', border: '#16a34a', ring: 'rgba(34,197,94,0.35)' },
  stale:   { bg: '#f59e0b', border: '#d97706', ring: 'rgba(245,158,11,0.35)' },
  offline: { bg: '#6b7280', border: '#4b5563', ring: 'rgba(107,114,128,0.25)' },
};

function buildMarkerIcon(member: TrackedMember, isSelected: boolean): L.DivIcon {
  const c = STATUS_COLOURS[member.status] ?? STATUS_COLOURS['offline']!;
  const size = isSelected ? 52 : 44;
  const fontSize = isSelected ? 13 : 12;
  const borderWidth = isSelected ? 4 : 3;
  const isYou = member.id === 'member-user';
  const pulseStyle = member.status === 'online' ? 'animation:pulse-ring 2.4s ease-out infinite;' : '';

  const html = `
    <div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:${isYou ? '#3b82f6' : c.bg};
      border:${borderWidth}px solid ${isYou ? '#1d4ed8' : c.border};
      box-shadow:0 0 0 ${isSelected ? 8 : 5}px ${isYou ? 'rgba(59,130,246,0.35)' : c.ring},0 4px 14px rgba(0,0,0,0.3);
      display:flex;align-items:center;justify-content:center;
      font-size:${fontSize}px;font-weight:800;color:#fff;
      font-family:system-ui,sans-serif;letter-spacing:-0.5px;cursor:pointer;
      transform:${isSelected ? 'scale(1.15)' : 'scale(1)'};transition:all 0.2s ease;
      ${pulseStyle}
    ">${member.initials}</div>`;

  return L.divIcon({
    html,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

interface LeafletMapCanvasProps {
  members: TrackedMember[];
  selectedMemberId: string | null;
  onSelectMember: (member: TrackedMember) => void;
}

// Visually hidden accessible button style
const srButtonClass =
  'absolute w-px h-px overflow-hidden whitespace-nowrap border-0 p-0 m-0 clip-rect-0';

export function LeafletMapCanvas({
  members,
  selectedMemberId,
  onSelectMember,
}: LeafletMapCanvasProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const [mapReady, setMapReady] = useState(false);

  // Initialize map once
  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    const map = L.map(mapRef.current, {
      center: [25.1868, 55.2640],
      zoom: 13,
      zoomControl: false,
      attributionControl: true,
    });

    // Standard OpenStreetMap tiles — bright and realistic
    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }
    ).addTo(map);

    leafletMap.current = map;
    setMapReady(true);

    return () => {
      map.remove();
      leafletMap.current = null;
    };
  }, []);

  // Add / update visual Leaflet markers
  useEffect(() => {
    if (!mapReady || !leafletMap.current) return;
    const map = leafletMap.current;

    const memberIds = new Set(members.map((m) => m.id));
    markersRef.current.forEach((marker, id) => {
      if (!memberIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    members.forEach((member) => {
      const isSelected = member.id === selectedMemberId;
      const icon = buildMarkerIcon(member, isSelected);

      if (markersRef.current.has(member.id)) {
        const existing = markersRef.current.get(member.id)!;
        existing.setIcon(icon);
        existing.setLatLng([member.lat, member.lng]);
      } else {
        const marker = L.marker([member.lat, member.lng], { icon })
          .addTo(map)
          .on('click', () => onSelectMember(member));
        markersRef.current.set(member.id, marker);
      }
    });
  }, [members, selectedMemberId, mapReady, onSelectMember]);

  // Pan to selected member
  useEffect(() => {
    if (!mapReady || !leafletMap.current || !selectedMemberId) return;
    const selected = members.find((m) => m.id === selectedMemberId);
    if (selected) {
      leafletMap.current.panTo([selected.lat, selected.lng], { animate: true, duration: 0.6 });
    }
  }, [selectedMemberId, members, mapReady]);

  return (
    <section
      aria-label="Live member map preview"
      className="relative overflow-hidden rounded-xl border border-border shadow-lg"
      style={{ minHeight: '28rem' }}
    >
      {/* Pulse animation keyframes */}
      <style>{`
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(34,197,94,0.6), 0 4px 14px rgba(0,0,0,0.3); }
          70%  { box-shadow: 0 0 0 12px rgba(34,197,94,0), 0 4px 14px rgba(0,0,0,0.3); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0), 0 4px 14px rgba(0,0,0,0.3); }
        }
        .clip-rect-0 { clip: rect(0 0 0 0); }
      `}</style>

      {/* Leaflet map container */}
      <div ref={mapRef} className="absolute inset-0" style={{ zIndex: 0 }} />

      {/* ─── Visually hidden accessible marker buttons (for screen readers & tests) ─── */}
      <div aria-hidden="false" style={{ position: 'absolute', zIndex: 1000 }}>
        {members.map((member) => {
          const isSelected = member.id === selectedMemberId;
          return (
            <button
              key={member.id}
              type="button"
              aria-label={`Select ${member.name}, ${member.status}`}
              aria-pressed={isSelected}
              onClick={() => onSelectMember(member)}
              className={srButtonClass}
              style={{ clip: 'rect(0 0 0 0)' }}
            />
          );
        })}
      </div>

      {/* ─── Visual UI overlays ─── */}

      {/* Top-left: live badge */}
      <div className="absolute left-3 top-3 z-[1000] flex items-center gap-2 rounded-lg border border-white/10 bg-black/70 px-3 py-1.5 backdrop-blur-sm">
        <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
        <span className="text-xs font-semibold text-white">LIVE · Dubai, UAE 🇦🇪</span>
      </div>

      {/* Top-right: member count */}
      <div className="absolute right-14 top-3 z-[1000] rounded-lg border border-white/10 bg-black/70 px-3 py-1.5 backdrop-blur-sm">
        <span className="text-xs font-semibold text-white">
          {members.filter((m) => m.status === 'online').length} online · {members.length} total
        </span>
      </div>

      {/* Visual zoom controls */}
      <div className="absolute right-3 top-12 z-[1000] flex flex-col gap-1" aria-hidden="true">
        {[
          { label: '+', action: () => leafletMap.current?.zoomIn() },
          { label: '−', action: () => leafletMap.current?.zoomOut() },
        ].map(({ label, action }) => (
          <button
            key={label}
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={action}
            className="grid h-8 w-8 place-items-center rounded-md border border-white/20 bg-black/70 text-sm font-bold text-white backdrop-blur-sm hover:bg-black/90 transition-colors"
          >
            {label}
          </button>
        ))}
      </div>

      {/* Legend — bottom left */}
      <div className="absolute bottom-8 left-3 z-[1000] flex flex-col gap-1 rounded-lg border border-white/10 bg-black/70 px-3 py-2 backdrop-blur-sm" aria-hidden="true">
        {[
          { label: 'Online', color: '#22c55e' },
          { label: 'Stale', color: '#f59e0b' },
          { label: 'Offline', color: '#6b7280' },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
            <span className="text-xs text-white/80">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
