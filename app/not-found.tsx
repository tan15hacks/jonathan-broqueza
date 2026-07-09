import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#05070d] px-6 text-center text-white">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">404</p>
        <h1 className="font-display mt-4 text-5xl font-bold tracking-[-0.06em]">Page not found.</h1>
        <p className="mx-auto mt-5 max-w-md text-slate-400">The page you are looking for does not exist or may have moved.</p>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-black text-[#05070d]">
          Back Home
        </Link>
      </div>
    </main>
  );
}
