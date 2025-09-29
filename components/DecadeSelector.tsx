type Props = {
  decades: number[];
  onSelect: (decade: number) => void;
  label: string;
};

export default function DecadeSelector({ decades, onSelect, label }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      {decades.map((d) => (
        <button
          key={d}
          onClick={() => onSelect(d)}
          className="rounded-full border bg-secondary/50 px-3 py-1 text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
          aria-label={`Explorer les années ${d}s`}
        >
          {d}s
        </button>
      ))}
    </div>
  );
}