import React from "react";

const MIN_YEAR = 1960;
const MAX_YEAR = 2025;

export default function YearInputForm({
  year,
  onYearChange,
  onSubmit,
  onKeyDown,
  buttonText,
  placeholder,
}: {
  year: number | undefined;
  onYearChange: (value: string) => void;
  onSubmit: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  buttonText: string;
  placeholder: string;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex w-full items-center rounded-full border border-white/10 bg-white/5 p-2 shadow-lg backdrop-blur-sm"
    >
      <input
        type="number"
        value={year ?? ""}
        onChange={(e) => onYearChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="flex-grow bg-transparent focus:outline-none placeholder:text-muted-foreground/50 px-4 text-lg [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        min={MIN_YEAR}
        max={MAX_YEAR}
      />
      <button
        type="submit"
        className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        {buttonText}
      </button>
    </form>
  );
}