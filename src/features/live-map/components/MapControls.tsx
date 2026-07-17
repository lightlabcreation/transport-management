interface MapControlsProps {
  onPreviewAction: (label: string) => void;
}

export function MapControls({ onPreviewAction }: MapControlsProps) {
  return (
    <div className="absolute right-3 top-12 z-10 grid gap-2" aria-label="Map controls">
      {['Zoom in', 'Zoom out', 'Locate me'].map((label) => (
        <button
          key={label}
          type="button"
          aria-label={label}
          onClick={() => onPreviewAction(label)}
          className="grid size-control place-items-center rounded-md border border-border bg-surface font-semibold shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          {label === 'Zoom in' ? '+' : label === 'Zoom out' ? '−' : '◎'}
        </button>
      ))}
    </div>
  );
}
