import { ReactNode } from "react";

export default function Card({ title, children, right }: { title: string; children: ReactNode; right?: ReactNode }) {
  return (
    <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.25)] overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          {right}
        </div>
        {children}
      </div>
    </div>
  );
}
