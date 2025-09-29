import React from "react";

// Un composant interne pour chaque carte de fonctionnalité
const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-center text-center p-4">
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary mb-5">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    <p className="mt-2 text-sm text-muted-foreground">{description}</p>
  </div>
);

// Le composant principal de la section
export default function FeatureSection() {
  return (
    <section className="w-full py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-foreground">
            Un voyage dans chaque détail
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            Explorez les facettes culturelles et économiques de n'importe quelle
            année.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <FeatureCard
            icon={<span className="text-3xl">🎵</span>}
            title="Musique"
            description="Écoutez les hits qui ont défini une époque et dominé les charts."
          />
          <FeatureCard
            icon={<span className="text-3xl">🎬</span>}
            title="Cinéma"
            description="Redécouvrez les films qui ont captivé le public et marqué le box-office."
          />
          <FeatureCard
            icon={<span className="text-3xl">💰</span>}
            title="Coût de la vie"
            description="Comparez les prix d'hier et d'aujourd'hui pour voir comment le monde a changé."
          />
        </div>
      </div>
    </section>
  );
}