type Props = {
  decades: number[];
  onSelect: (decade: number) => void;
  label: string;
};

export default function DecadeSelector({ decades, onSelect, label }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <span className="text-sm text-blue-300/60 font-mono">{label}</span>
      {decades.map((d) => (
        <button
          key={d}
          onClick={() => onSelect(d)}
          className="rounded-md border border-blue-500/20 bg-blue-950/30 px-3 py-1 text-sm font-mono text-blue-300/70 transition-colors hover:bg-blue-900/50 hover:text-blue-300"
          aria-label={`Explorer les années ${d}s`}
        >
          {d}s
        </button>
      ))}
    </div>
  );
}