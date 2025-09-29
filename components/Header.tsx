import LanguageToggle from "./LanguageToggle";

export default function Header() {
  return (
    <header className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8 shadow-2xl flex items-center justify-between">
      <div>
        <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Capsulo
        </h1>
        <p className="text-slate-400 text-sm mt-1">Un voyage dans le temps culturel</p>
      </div>
      <LanguageToggle />
    </header>
  );
}