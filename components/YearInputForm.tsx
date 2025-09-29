import React from "react";

type Props = {
  year: number | undefined;
  onYearChange: (value: string) => void;
  onSubmit: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  buttonText: string;
  placeholder: string;
};

export default function YearInputForm({
  year,
  onYearChange,
  onSubmit,
  onKeyDown,
  buttonText,
  placeholder,
}: Props) {
  return (
    <div className="flex w-full items-center gap-1 rounded-full bg-secondary p-1.5 transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/50">
      <input
        type="number"
        value={year ?? ""}
        onChange={(e) => onYearChange(e.target.value)}
        onKeyDown={onKeyDown}
        className="w-full bg-transparent px-4 py-1 text-base outline-none placeholder:text-muted-foreground/50"
        placeholder={placeholder}
      />
      <button
        onClick={onSubmit}
        className="flex-shrink-0 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 active:scale-100"
      >
        {buttonText}
      </button>
    </div>
  );
}