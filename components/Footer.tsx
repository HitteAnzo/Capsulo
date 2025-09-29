export default function Footer() {
  return (
    <footer className="py-6 text-center text-sm text-muted-foreground">
      <p>
        &copy; {new Date().getFullYear()} Capsulo. Conçu avec passion par des
        explorateurs du temps.
      </p>
    </footer>
  );
}