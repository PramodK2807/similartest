/**
 * TEST REGISTRY
 * -------------
 * Every object here becomes one card on the home page.
 *
 * To add a new test, copy one block and change `id`, `title` and `seed`.
 * The seed decides which figures and options are generated, so a new seed
 * means a brand-new set of 96 questions (the same seed always gives the
 * same questions, so Re-Attempt shows the same paper).
 *
 * To use your own hand-made questions instead of generated ones, add a
 * `questions` array (see README.md) and the seed is ignored.
 */
const COMMON = {
  series: "SIMILAR-TEST-SERIES",
  pattern: "DOMGESH JI Pattern",
  totalQuestions: 96, // 2 parts x 48
  partSize: 48,
  durationMin: 8, // one timer for the whole paper
  marksPerQuestion: 1,
  validFrom: "01 Jun 2026",
  validTo: "01 Jun 2027",
};

export const tests = [
  { ...COMMON, id: "sft-1", title: "Same Figure Test - 1", seed: 1101 },
  { ...COMMON, id: "sft-2", title: "Same Figure Test - 2", seed: 2202 },
  { ...COMMON, id: "sft-3", title: "Same Figure Test - 3", seed: 3303 },
  { ...COMMON, id: "sft-4", title: "Same Figure Test - 4", seed: 4404 },
];
