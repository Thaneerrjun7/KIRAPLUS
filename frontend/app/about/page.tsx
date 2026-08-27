// Scoring methodology, factor weights table, synthetic-data disclosure, limitations.
// No backend calls -- static content, published in README.md and
// docs/MASTER-PACKAGE.md's own Limitations section (reused verbatim, not paraphrased).

import { FACTORS } from "@/lib/factorConfig";
import { Card } from "@/components/ui/Card";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:py-12">
      <h1 className="font-display text-3xl">About KIRA+</h1>

      <Card label="SCORING METHODOLOGY" className="mt-6">
        <p className="text-navy/80">
          Published in full, because a score you cannot audit is a score you should not trust.
          Six factors, each scored 0-100 against a fixed anchor, then combined by weight.
        </p>

        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-navy/50">
              <th className="pb-2">Factor</th>
              <th className="pb-2">Feature</th>
              <th className="pb-2">Weight</th>
              <th className="pb-2">Scores 0 at</th>
              <th className="pb-2">Scores 100 at</th>
            </tr>
          </thead>
          <tbody>
            {FACTORS.map((factor) => (
              <tr key={factor.key} className="border-t border-navy/10">
                <td className="py-2">{factor.label}</td>
                <td className="py-2 text-navy/70">{factor.featureDescription}</td>
                <td className="py-2 font-mono">{factor.weight}</td>
                <td className="py-2 font-mono">{factor.zeroAt}</td>
                <td className="py-2 font-mono">{factor.fullAt}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <pre className="mt-4 overflow-x-auto border border-navy/10 bg-navy/[0.02] p-4 font-mono text-xs leading-relaxed">
          {`sub(x, zero_at, full_at) = clamp(100 x (x - zero_at) / (full_at - zero_at), 0, 100)
weighted   = sum(weight_i x sub_i) / 100
penalty    = min(10, 3 x max(0, n_bnpl - 3))
KIRA Score = round(clamp(weighted - penalty, 0, 100))

band = LOW >= 70  ·  MODERATE 45-69  ·  HIGH < 45`}
        </pre>

        <p className="mt-4 text-sm text-navy/70">
          Weights and anchor points are the team&rsquo;s judgement, not a fitted model -- see
          Limitations below.
        </p>
      </Card>

      <Card label="SYNTHETIC DATA" className="mt-6">
        <p className="text-navy/80">
          Every profile in this demo, including the four named personas, is synthetic. These
          profiles are constructed to exercise every branch of the scoring engine. They are not
          real people and not research subjects. No real consumer financial data appears anywhere
          in this application.
        </p>
      </Card>

      <Card label="LIMITATIONS" className="mt-6">
        <dl className="flex flex-col gap-5">
          <div>
            <dt className="font-display font-semibold">No real financial data</dt>
            <dd className="mt-1 text-navy/75">
              Every profile is synthetic. Every model metric is measured against a simulated
              target. We make no claim about real-world predictive accuracy.
            </dd>
          </div>

          <div>
            <dt className="font-display font-semibold">No user research</dt>
            <dd className="mt-1 text-navy/75">
              No survey, no interviews, no pilot. All behavioural claims are reasoned.
            </dd>
          </div>

          <div>
            <dt className="font-display font-semibold">Weights and anchors are our judgement</dt>
            <dd className="mt-1 text-navy/75">
              The six weights and their anchor points are informed by publicly discussed
              debt-service practice and standard emergency-fund guidance, but they are not
              empirically fitted. Real outcome data would refit them and the score would move.
            </dd>
          </div>

          <div>
            <dt className="font-display font-semibold">Entirely manual entry</dt>
            <dd className="mt-1 text-navy/75">
              No BNPL, bank, CTOS, CCRIS or open-banking connectivity. The consolidated view is
              only as complete and as accurate as what you choose to type.
            </dd>
          </div>

          <div>
            <dt className="font-display font-semibold">No legal determination</dt>
            <dd className="mt-1 text-navy/75">
              Privacy-by-design principles are implemented; PDPA compliance is not established.
              Our position relative to the Consumer Credit Commission&rsquo;s regime requires
              legal advice we have not obtained.
            </dd>
          </div>

          <div>
            <dt className="font-display font-semibold">BNPL-first, deliberately narrow</dt>
            <dd className="mt-1 text-navy/75">
              Credit cards, mortgages, hire purchase and business credit are out of scope. A user
              with a large credit-card balance will find their score incomplete. That is a
              choice, not an oversight.
            </dd>
          </div>
        </dl>
      </Card>
    </main>
  );
}
