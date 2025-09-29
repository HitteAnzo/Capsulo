type Props = {
  title: string;
  subtitle: string;
};

export default function HeroSection({ title, subtitle }: Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/60 text-center">
        {title}
      </h1>
      <p className="mt-6 max-w-xl text-center text-lg text-muted-foreground">
        {subtitle}
      </p>
    </div>
  );
}