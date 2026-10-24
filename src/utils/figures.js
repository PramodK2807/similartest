import { mulberry32, shuffle } from "./rng.js";
/**
 * A figure is a plain object that picks one value for each feature.
 *
 * Every feature below is easy to see. To guarantee that no two options ever
 * look alike, each wrong option differs from the main figure in a DIFFERENT
 * group of features (1 or 2 of them).
 */
export const FEATURES = {
  sqTilt: ["tilt", "flat"], // black square: tilted or flat
  endFill: ["black", "white"], // triangle at the end of the top arc
  endDir: ["up", "down"], // that triangle: apex up or down
  sideFill: ["black", "white"], // triangle on the right
  sideDir: ["R", "L"], // that triangle points right or left
  leftHead: ["end", "start"], // left arc: arrow at its end or its start
  rightHead: ["end", "start"], // right arc: arrow at its end or its start
  diamondPos: ["c", "l", "r", "u", "d"], // diamond: centre / left / right / up / down
  diamondTilt: [25, 45, 65], // diamond turn in degrees
  curve: ["r", "d", "l", "u"], // inner curve bulges right / down / left / up
};

const KEYS = Object.keys(FEATURES);
export const OPTIONS_PER_QUESTION = 5;

export const signature = (fig) => KEYS.map((k) => fig[k]).join("|");

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

// n different groups of 1-2 features, e.g. ['sqTilt'], ['curve','sideDir'] ...
function pickChangeSets(rng, n) {
  const sets = [];
  const used = new Set();
  let guard = 0;
  while (sets.length < n && guard++ < 1000) {
    const keys = shuffle(KEYS, rng)
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

function makeQuestion(rng) {
  const main = randomFigure(rng);
  const wrong = pickChangeSets(rng, OPTIONS_PER_QUESTION - 1).map((keys) => {
    const fig = { ...main };
    keys.forEach((k) => {
      fig[k] = otherValue(main, k, rng);
    });
    return fig;
  });

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
