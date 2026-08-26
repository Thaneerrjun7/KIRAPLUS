# Stress Model Card

Not yet trained. Fill in after `python models/train.py` runs, per
docs/MASTER-PACKAGE.md Part II §11.

- **Target**: `stress_12m`, a Monte-Carlo outcome, not a function of the KIRA Score.
- **Features**: the 9 model-facing features in docs/MASTER-PACKAGE.md Part II §10 (no demographics).
- **Metrics to record**: held-out ROC-AUC, 5-fold CV ROC-AUC, recall (stress class), Brier score, accuracy, plus the majority-class and score-only baselines.
- **Limitations**: trained on synthetic data with simulation-derived labels; no claim about real-world predictive accuracy.
