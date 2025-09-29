import LanguageToggle from "./LanguageToggle";

export default function Header() {
  return (
    <header className="flex items-center justify-between py-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight text-primary">
          Capsulo
        </h1>
        <p className="text-sm text-muted-foreground">
          Un voyage à travers le temps
        </p>
      </div>
      <LanguageToggle />
    </header>
  );
}