import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-4xl">KIRA+</h1>
      <p className="mt-2 text-lg">Kira Dulu. Baru Commit.</p>
      <p className="mt-1 text-navy/70">Demo mode -- synthetic profiles only. Not financial advice.</p>
      <Link
        href="/profile"
        className="mt-8 inline-block rounded bg-teal px-6 py-3 font-display text-paper hover:bg-navy"
      >
        Get started
      </Link>
    </main>
  );
}
