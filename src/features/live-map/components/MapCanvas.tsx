import type { TrackedMember } from '../live-map.types';
import { MapControls } from './MapControls';

interface MapCanvasProps {
  members: TrackedMember[];
  selectedMemberId: string | null;
  onSelectMember: (member: TrackedMember) => void;
  onPreviewAction: (label: string) => void;
}

export function MapCanvas({
  members,
  selectedMemberId,
  onSelectMember,
  onPreviewAction,
}: MapCanvasProps) {
  return (
    <section
      aria-label="Live member map preview"
      className="relative min-h-[26rem] overflow-hidden rounded-xl border border-border bg-surface-muted shadow-sm"
    >
      <div className="absolute inset-0 opacity-60" aria-hidden="true">
        <div className="absolute left-[12%] top-0 h-full w-px rotate-12 bg-border" />
        <div className="absolute left-[54%] top-0 h-full w-px -rotate-12 bg-border" />
        <div className="absolute left-0 top-[32%] h-px w-full -rotate-3 bg-border" />
        <div className="absolute left-0 top-[70%] h-px w-full rotate-6 bg-border" />
        <div className="absolute left-[22%] top-[45%] h-24 w-[48%] rotate-12 rounded-full border-4 border-dashed border-primary/40" />
      </div>

      <span className="absolute left-3 top-3 rounded-full border border-border bg-surface px-3 py-1 text-body-sm font-semibold">
        Frontend Preview
      </span>
      <MapControls onPreviewAction={onPreviewAction} />

      <div
        aria-label="Your demo location"
        className="absolute left-[48%] top-[48%] grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-surface bg-primary text-body-sm font-bold text-primary-foreground shadow-md"
      >
        You
      </div>

      {members.map((member) => {
        const isSelected = member.id === selectedMemberId;
        return (
          <button
            key={member.id}
            type="button"
            aria-label={`Select ${member.name}, ${member.status}`}
            aria-pressed={isSelected}
            onClick={() => onSelectMember(member)}
            className={`absolute grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 text-body-sm font-bold shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ${
              isSelected
                ? 'scale-110 border-primary bg-foreground text-background'
                : 'border-surface bg-primary text-primary-foreground'
            }`}
            style={{ left: `${member.position.x}%`, top: `${member.position.y}%` }}
          >
            {member.initials}
            {isSelected && <span className="sr-only">Selected</span>}
          </button>
        );
      })}

      <p className="absolute bottom-3 left-3 rounded-md bg-surface/90 px-3 py-2 text-body-sm text-muted-foreground">
        Simulated positions · No live location data
      </p>
    </section>
  );
}
