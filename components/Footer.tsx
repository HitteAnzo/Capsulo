export default function Footer() {
  return (
    <footer className="text-center text-slate-400 text-sm py-6 mt-12 border-t border-white/10">
      <p>
        &copy; {new Date().getFullYear()} Capsulo. Tous droits réservés.
      </p>
      <p className="mt-2 text-slate-500">
        Conçu avec passion par des explorateurs du temps.
      </p>
    </footer>
  );
}