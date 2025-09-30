type Props = {
  title: string;
  subtitle: string;
};

export default function HeroSection({ title, subtitle }: Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center animate-fade-in-up [animation-delay:100ms]">
      <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter text-gray-100">
        {title}
      </h1>
      <p className="mt-6 max-w-2xl text-center text-lg text-blue-300/80">
        {subtitle}
      </p>
    </div>
  );
}