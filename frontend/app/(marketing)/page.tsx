import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { ScoreGauge } from "@/components/ScoreGauge";
import { Button } from "@/components/ui/Button";
import { StatTile } from "@/components/ui/StatTile";
import { AISYAH, DANIEL } from "@/lib/fixtures";
import { fmtRm } from "@/lib/format";

// The purchase example matches docs/API-CONTRACT.md §7's own published fixture:
// Aisyah + price_sen=240000, tenure_months=12 -> monthly_sen 20000, buffer 95000 -> 75000.
const EXAMPLE_MONTHLY_SEN = 20000;

const STEPS = [
  {
    number: "01",
    title: "Consolidate",
    description:
      "List every BNPL plan and loan in one place -- the total picture no single provider shows you.",
  },
  {
    number: "02",
    title: "Score",
    description:
      "Six published, weighted factors become one 0-100 KIRA Score -- every weight and formula shown.",
  },
  {
    number: "03",
    title: "Simulate",
    description:
      "Try a purchase before you make it. See exactly what it costs your score and your monthly slack.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:py-12">
      <section className="grid gap-14 py-8 md:grid-cols-2 md:items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-teal">
            Financial health, audited
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl">
            Kira Dulu.
            <br />
            Baru Commit.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-slate">
            See the consequences before you commit. KIRA+ consolidates every BNPL plan and loan
            into one score you can audit -- then shows what a new purchase would cost it, before
            you make it.
          </p>
          <Button href="/profile" className="mt-8">
            Get started
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative rounded-xl border border-border bg-surface p-6 shadow-card">
          <span className="absolute left-4 top-3 font-mono text-[10px] uppercase tracking-wider text-mist">
            KIRA score -- live preview
          </span>
          <div className="flex flex-col items-center pt-6">
            <ScoreGauge score={AISYAH.expected.score} band={AISYAH.expected.band} />
          </div>
          <div className="mt-5 flex flex-col gap-2.5 border-t border-dashed border-border pt-4">
            <StatTile
              label="Monthly buffer"
              value={fmtRm(AISYAH.expected.features.buffer_sen)}
            />
            <StatTile
              label="After RM2,400 / 12 months"
              value={fmtRm(AISYAH.expected.features.buffer_sen - EXAMPLE_MONTHLY_SEN)}
              valueClassName="text-risk-high"
            />
          </div>
        </div>
      </section>

      <section className="py-12">
        <h2 className="font-display text-2xl">How it works</h2>
        <p className="mt-2 max-w-md text-slate">
          Three steps, in order -- each one feeds the next.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.number} className="border-t-2 border-navy pt-4">
              <span className="font-mono text-sm text-mist">{step.number}</span>
              <h3 className="mt-1.5 font-display text-lg">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 border-y border-border bg-surface-alt py-12 md:grid-cols-2">
        <blockquote className="m-0">
          <p className="font-body text-lg italic leading-relaxed">&ldquo;{AISYAH.quote}&rdquo;</p>
          <cite className="mt-3 block font-mono text-xs not-italic tracking-wide text-mist">
            {AISYAH.label.toUpperCase()}
          </cite>
        </blockquote>
        <blockquote className="m-0">
          <p className="font-body text-lg italic leading-relaxed">&ldquo;{DANIEL.quote}&rdquo;</p>
          <cite className="mt-3 block font-mono text-xs not-italic tracking-wide text-mist">
            {DANIEL.label.toUpperCase()}
          </cite>
        </blockquote>
      </section>
    </main>
  );
}
