"use client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const SUPPORTED = ["fr", "en"] as const;
export type Lang = typeof SUPPORTED[number];

export default function LanguageToggle() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const current = (params.get("lang") || "fr") as Lang;

  function setLang(lang: Lang) {
    const sp = new URLSearchParams(params.toString());
    sp.set("lang", lang);
    router.push(`${pathname}?${sp.toString()}`);
  }

  return (
    <div className="flex gap-2">
      {SUPPORTED.map(l => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-3 py-1 rounded-xl border ${current===l ? "bg-white text-black" : "border-border hover:bg-white/5"}`}
          title={l.toUpperCase()}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
