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
      className="flex w-full items-center rounded-md border border-blue-500/30 bg-blue-950/30 p-2 shadow-lg backdrop-blur-sm transition-all focus-within:border-blue-500/80 focus-within:bg-blue-950/50"
    >
      <input
        type="number"
        value={year ?? ""}
        onChange={(e) => onYearChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="flex-grow bg-transparent px-4 text-lg font-mono text-white placeholder:text-blue-300/40 focus:outline-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        min={MIN_YEAR}
        max={MAX_YEAR}
      />
      <button
        type="submit"
        className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
      >
        {buttonText}
      </button>
    </form>
  );
}