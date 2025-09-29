import React from "react";

type Props = {
  title?: string;
  children?: React.ReactNode;
  className?: string;
};

export default function Card({ title, children, className = "" }: Props) {
  return (
    <div
      className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
    >
      {title && (
        <div className="border-b p-4">
          <h3 className="font-semibold leading-none tracking-tight text-primary">
            {title}
          </h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}
