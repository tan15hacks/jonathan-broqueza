import { ArrowLeft, Home, Radio } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-grid" aria-hidden="true" />
      <div className="not-found-orbit not-found-orbit-one" aria-hidden="true" />
      <div className="not-found-orbit not-found-orbit-two" aria-hidden="true" />

      <header className="not-found-header">
        <Link href="/" className="not-found-brand" aria-label="Jonathan Broqueza home">
          Jonathan<span>.</span>
        </Link>
        <div className="not-found-status">
          <Radio size={14} aria-hidden="true" />
          <span>route disconnected</span>
        </div>
      </header>

      <section className="not-found-content">
        <p className="not-found-kicker">error / page not found</p>

        <div className="not-found-number-wrap" aria-label="Error 404">
          <div className="not-found-number" data-text="404" aria-hidden="true">
            404
          </div>
        </div>

        <div className="not-found-copy">
          <h1>This page slipped out of the system.</h1>
          <p>
            The address may be incorrect, the page may have moved, or this route was never connected.
          </p>
        </div>

        <div className="not-found-actions">
          <Link href="/" className="not-found-primary-link">
            <Home size={18} aria-hidden="true" />
            Return home
          </Link>
          <Link href="/work" className="not-found-secondary-link">
            <ArrowLeft size={17} aria-hidden="true" />
            View my work
          </Link>
        </div>
      </section>

      <footer className="not-found-footer">
        <span>system.status / 404</span>
        <span>Jonathan Broqueza</span>
      </footer>
    </main>
  );
}
