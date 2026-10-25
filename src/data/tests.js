// /**
//  * TEST REGISTRY
//  * -------------
//  * Every object here becomes one card on the home page.
//  *
//  * To add a new test, copy one block and change `id`, `title` and `seed`.
//  * The seed decides which figures and options are generated, so a new seed
//  * means a brand-new set of 96 questions (the same seed always gives the
//  * same questions, so Re-Attempt shows the same paper).
//  *
//  * To use your own hand-made questions instead of generated ones, add a
//  * `questions` array (see README.md) and the seed is ignored.
//  */
const COMMON = {
  series: "SIMILAR",
  pattern: "",
  totalQuestions: 96, // 2 parts x 48
  partSize: 48,
  durationMin: 8, // one timer for the whole paper
  marksPerQuestion: 1,
  validFrom: "01 Jun 2026",
  validTo: "01 Jun 2027",
};

// export const tests = [
//   { ...COMMON, id: "sft-1", title: "Same Figure Test - 1", seed: 1101 },
//   { ...COMMON, id: "sft-2", title: "Same Figure Test - 2", seed: 2202 },
//   { ...COMMON, id: "sft-3", title: "Same Figure Test - 3", seed: 3303 },
//   { ...COMMON, id: "sft-4", title: "Same Figure Test - 4", seed: 4404 },
// ];

export const tests = [
  // Type 1 figures (arrows, circle, diamond) in both parts
  {
    ...COMMON,
    id: "sft-1",
    title: "Same Figure Test - 1",
    seed: 1101,
    pattern: "Type 1",
  },
  {
    ...COMMON,
    id: "sft-2",
    title: "Same Figure Test - 2",
    seed: 2202,
    pattern: "Type 1",
  },
  {
    ...COMMON,
    id: "sft-3",
    title: "Same Figure Test - 3",
    seed: 3303,
    pattern: "Type 1",
  },
  {
    ...COMMON,
    id: "sft-4",
    title: "Same Figure Test - 4",
    seed: 4404,
    pattern: "Type 1",
  },

  // Type 2 figures (frame, bowl, triangles) in both parts
  {
    ...COMMON,
    id: "sft-5",
    title: "Same Figure Test - 5",
    seed: 5505,
    kinds: ["type2", "type2"],
    pattern: "Type 2",
  },
  {
    ...COMMON,
    id: "sft-6",
    title: "Same Figure Test - 6",
    seed: 6606,
    kinds: ["type2", "type2"],
    pattern: "Type 2",
  },

  // Mixed: 48 of one type, then 48 of the other (kinds = figure type of Part 1, Part 2)
  {
    ...COMMON,
    id: "sft-7",
    title: "Same Figure Test - 7",
    seed: 7707,
    kinds: ["type1", "type2"],
    pattern: "Mixed Type",
  },
  {
    ...COMMON,
    id: "sft-8",
    title: "Same Figure Test - 8",
    seed: 8808,
    kinds: ["type2", "type1"],
    pattern: "Mixed Type",
  },
];
