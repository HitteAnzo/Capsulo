import React from "react";

type Props = {
  title?: string;
  children?: React.ReactNode;
  className?: string;
};

export default function Card({ title, children, className = "" }: Props) {
  return (
    <div className={`bg-card text-card-foreground rounded-lg border border-border p-4 shadow-sm ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-2 text-primary">{title}</h3>}
      <div>{children}</div>
    </div>
  );
}
