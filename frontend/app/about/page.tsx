// Scoring methodology, factor weights table, synthetic-data disclosure, limitations.
// No backend calls -- static content, published in README.md and
// docs/MASTER-PACKAGE.md's own Limitations section (reused verbatim, not paraphrased).

import { FACTORS } from "@/lib/factorConfig";

export default function AboutPage() {
  return (
    <main>
      <h1>About KIRA+</h1>

      <section>
        <h2>Scoring methodology</h2>
        <p>
          Published in full, because a score you cannot audit is a score you should not trust.
          Six factors, each scored 0-100 against a fixed anchor, then combined by weight.
        </p>

        <table>
          <thead>
            <tr>
              <th>Factor</th>
              <th>Feature</th>
              <th>Weight</th>
              <th>Scores 0 at</th>
              <th>Scores 100 at</th>
            </tr>
          </thead>
          <tbody>
            {FACTORS.map((factor) => (
              <tr key={factor.key}>
                <td>{factor.label}</td>
                <td>{factor.featureDescription}</td>
                <td>{factor.weight}</td>
                <td>{factor.zeroAt}</td>
                <td>{factor.fullAt}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <pre>
          {`sub(x, zero_at, full_at) = clamp(100 x (x - zero_at) / (full_at - zero_at), 0, 100)
weighted   = sum(weight_i x sub_i) / 100
penalty    = min(10, 3 x max(0, n_bnpl - 3))
KIRA Score = round(clamp(weighted - penalty, 0, 100))

band = LOW >= 70  ·  MODERATE 45-69  ·  HIGH < 45`}
        </pre>

        <p>
          Weights and anchor points are the team&rsquo;s judgement, not a fitted model -- see
          Limitations below.
        </p>
      </section>

      <section>
        <h2>Synthetic data</h2>
        <p>
          Every profile in this demo, including the four named personas, is synthetic. These
          profiles are constructed to exercise every branch of the scoring engine. They are not
          real people and not research subjects. No real consumer financial data appears anywhere
          in this application.
        </p>
      </section>

      <section>
        <h2>Limitations</h2>
        <dl>
          <dt>No real financial data</dt>
          <dd>
            Every profile is synthetic. Every model metric is measured against a simulated
            target. We make no claim about real-world predictive accuracy.
          </dd>

          <dt>No user research</dt>
          <dd>No survey, no interviews, no pilot. All behavioural claims are reasoned.</dd>

          <dt>Weights and anchors are our judgement</dt>
          <dd>
            The six weights and their anchor points are informed by publicly discussed
            debt-service practice and standard emergency-fund guidance, but they are not
            empirically fitted. Real outcome data would refit them and the score would move.
          </dd>

          <dt>Entirely manual entry</dt>
          <dd>
            No BNPL, bank, CTOS, CCRIS or open-banking connectivity. The consolidated view is only
            as complete and as accurate as what you choose to type.
          </dd>

          <dt>No legal determination</dt>
          <dd>
            Privacy-by-design principles are implemented; PDPA compliance is not established. Our
            position relative to the Consumer Credit Commission&rsquo;s regime requires legal advice we
            have not obtained.
          </dd>

          <dt>BNPL-first, deliberately narrow</dt>
          <dd>
            Credit cards, mortgages, hire purchase and business credit are out of scope. A user
            with a large credit-card balance will find their score incomplete. That is a choice,
            not an oversight.
          </dd>
        </dl>
      </section>
    </main>
  );
}
