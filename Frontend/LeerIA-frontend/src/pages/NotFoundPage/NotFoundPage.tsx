import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080B10] px-6 text-zinc-100">
      <section className="max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl backdrop-blur-xl">
        <p className="text-sm font-medium text-emerald-300">404</p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Página no encontrada
        </h1>

        <p className="mt-3 text-sm leading-6 text-zinc-400">
          La vista que intentas abrir todavía no existe en este frontend.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex rounded-2xl bg-emerald-300 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-200"
        >
          Volver al inicio
        </Link>
      </section>
    </main>
  );
}