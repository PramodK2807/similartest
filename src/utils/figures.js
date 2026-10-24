import { mulberry32, shuffle } from "./rng.js";

/**
 * A figure is a plain object that picks one value for each feature.
 *
 * BOLD features are easy to see. SUBTLE ones are small details.
 * To guarantee that no two options ever look alike, every wrong option
 * must differ from the main figure in a DIFFERENT set of BOLD features.
 * SUBTLE features are only added on top as extra variety.
 */
export const FEATURES = {
  square: ["black", "white"], // small square fill
  tri: ["black", "white"], // small triangle fill
  head: ["cw", "ccw"], // arrow direction
  headFill: ["black", "white"], // arrow head fill
  arcs: [1, 2], // one arc or two arcs
  squarePos: ["tl", "tc"], // square: top-left or top-centre
  triPos: ["tr", "br"], // triangle: top-right or bottom-right
  rings: [1, 2], // one or two circles (subtle)
  inner: ["dot", "diamond"], // mark inside the diamond (subtle)
};

const BOLD = [
  "square",
  "tri",
  "head",
  "headFill",
  "arcs",
  "squarePos",
  "triPos",
];
const SUBTLE = ["rings", "inner"];
const KEYS = Object.keys(FEATURES);
export const OPTIONS_PER_QUESTION = 5;

const sigOf = (fig, keys) => keys.map((k) => fig[k]).join("|");
export const signature = (fig) => sigOf(fig, KEYS);

const pick = (list, rng) => list[Math.floor(rng() * list.length)];
const otherValue = (fig, key, rng) =>
  pick(
    FEATURES[key].filter((v) => v !== fig[key]),
    rng,
  );

function randomFigure(rng) {
  const fig = {};
  for (const key of KEYS) fig[key] = pick(FEATURES[key], rng);
  return fig;
}

// n different groups of 1-2 bold features, e.g. ['square'], ['head','tri'] ...
function pickBoldSets(rng, n) {
  const sets = [];
  const used = new Set();
  let guard = 0;
  while (sets.length < n && guard++ < 1000) {
    const keys = shuffle(BOLD, rng)
      .slice(0, rng() < 0.6 ? 1 : 2)
      .sort();
    const id = keys.join("+");
    if (!used.has(id)) {
      used.add(id);
      sets.push(keys);
    }
  }
  return sets;
}

// True only if all options differ from each other in at least one bold feature.
function allDistinct(options) {
  return new Set(options.map((o) => sigOf(o, BOLD))).size === options.length;
}

function makeQuestion(rng) {
  let main;
  let wrong;
  do {
    main = randomFigure(rng);
    wrong = pickBoldSets(rng, OPTIONS_PER_QUESTION - 1).map((keys) => {
      const fig = { ...main };
      keys.forEach((k) => {
        fig[k] = otherValue(main, k, rng);
      });
      if (rng() < 0.35) {
        const k = pick(SUBTLE, rng);
        fig[k] = otherValue(main, k, rng);
      }
      return fig;
    });
  } while (!allDistinct([main, ...wrong]));

  const answer = Math.floor(rng() * OPTIONS_PER_QUESTION);
  const options = [...wrong];
  options.splice(answer, 0, { ...main });
  return { main, options, answer };
}

export function generateQuestions({ seed, count }) {
  const rng = mulberry32(seed);
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    ...makeQuestion(rng),
  }));
}
/** Generated questions, or the test's own hand-made `questions` array. */
export function buildQuestions(test) {
  if (Array.isArray(test.questions) && test.questions.length) {
    return test.questions.map((q, i) => ({ ...q, id: i + 1 }));
  }
  return generateQuestions({ seed: test.seed, count: test.totalQuestions });
}

export function scoreAttempt(
  questions,
  answers,
  partSize,
  marksPerQuestion = 1,
) {
  const parts = [];
  let correct = 0;
  let wrong = 0;
  let unanswered = 0;

  questions.forEach((q, i) => {
    const p = Math.floor(i / partSize);
    if (!parts[p]) parts[p] = { correct: 0, wrong: 0, unanswered: 0 };
    const given = answers[i];
    if (given === null || given === undefined) {
      unanswered++;
      parts[p].unanswered++;
    } else if (given === q.answer) {
      correct++;
      parts[p].correct++;
    } else {
      wrong++;
      parts[p].wrong++;
    }
  });

  return {
    total: questions.length,
    correct,
    wrong,
    unanswered,
    marks: correct * marksPerQuestion,
    maxMarks: questions.length * marksPerQuestion,
    parts,
  };
}
