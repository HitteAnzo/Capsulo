import React from "react";
import { Music, Clapperboard, Banknote } from "lucide-react";

const FeatureCard = ({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}) => (
  <div
    className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-8 shadow-2xl animate-fade-in-up flex flex-col items-center text-center"
    style={{ animationDelay: delay }}
  >
    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-foreground">{title}</h3>
    <p className="mt-2 text-muted-foreground">{description}</p>
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(120,113,198,0.15),transparent_60%)]"></div>
  </div>
);

export default function FeatureSection() {
  return (
    <section className="w-full py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <div
          className="text-center mb-16 animate-fade-in-up"
          style={{ animationDelay: "500ms" }}
        >
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl text-foreground">
            Un voyage dans chaque détail
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Explorez les facettes culturelles et économiques de n'importe quelle
            année.
          </p>
        </div>
        {/* On remet le comportement responsive et les animations */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <FeatureCard
            icon={<Music className="h-7 w-7 text-primary" />}
            title="Musique"
            description="Écoutez les hits qui ont défini une époque et dominé les charts."
            delay="700ms"
          />
          <FeatureCard
            icon={<Clapperboard className="h-7 w-7 text-primary" />}
            title="Cinéma"
            description="Redécouvrez les films qui ont captivé le public et marqué le box-office."
            delay="800ms"
          />
          <FeatureCard
            icon={<Banknote className="h-7 w-7 text-primary" />}
            title="Coût de la vie"
            description="Comparez les prix d'hier et d'aujourd'hui pour voir comment le monde a changé."
            delay="900ms"
          />
        </div>
      </div>
    </section>
  );
}