import { mulberry32, shuffle } from './rng.js';

/**
 * A figure is a plain object that picks one value for each feature.
 * Distractor options are the main figure with 1 or 2 features changed.
 */
export const FEATURES = {
  square: ['black', 'white'], // small square fill
  tri: ['black', 'white'], // small triangle fill
  head: ['cw', 'ccw'], // which end of the outer arc has the arrow head
  headFill: ['black', 'white'], // arrow head fill
  rings: [1, 2], // one or two circles around the diamond
  inner: ['dot', 'cross', 'diamond'], // mark inside the diamond
  squarePos: ['tl', 'tc'], // square: top-left or top-centre
  triPos: ['tr', 'br'], // triangle: top-right or bottom-right
};

const KEYS = Object.keys(FEATURES);
export const OPTIONS_PER_QUESTION = 5;

export const signature = (fig) => KEYS.map((k) => fig[k]).join('|');

function randomFigure(rng) {
  const fig = {};
  for (const key of KEYS) {
    const values = FEATURES[key];
    fig[key] = values[Math.floor(rng() * values.length)];
  }
  return fig;
}

function changeFeatures(base, rng, howMany) {
  const fig = { ...base };
  for (const key of shuffle(KEYS, rng).slice(0, howMany)) {
    const others = FEATURES[key].filter((v) => v !== base[key]);
    fig[key] = others[Math.floor(rng() * others.length)];
  }
  return fig;
}

export function generateQuestions({ seed, count }) {
  const rng = mulberry32(seed);
  const questions = [];

  for (let i = 0; i < count; i++) {
    const main = randomFigure(rng);
    const seen = new Set([signature(main)]);
    const wrong = [];
    let guard = 0;

    while (wrong.length < OPTIONS_PER_QUESTION - 1 && guard++ < 500) {
      const candidate = changeFeatures(main, rng, rng() < 0.6 ? 1 : 2);
      const sig = signature(candidate);
      if (!seen.has(sig)) {
        seen.add(sig);
        wrong.push(candidate);
      }
    }

    const answer = Math.floor(rng() * OPTIONS_PER_QUESTION);
    const options = [...wrong];
    options.splice(answer, 0, { ...main });
    questions.push({ id: i + 1, main, options, answer });
  }
  return questions;
}

/** Generated questions, or the test's own hand-made `questions` array. */
export function buildQuestions(test) {
  if (Array.isArray(test.questions) && test.questions.length) {
    return test.questions.map((q, i) => ({ ...q, id: i + 1 }));
  }
  return generateQuestions({ seed: test.seed, count: test.totalQuestions });
}

export function scoreAttempt(questions, answers, partSize, marksPerQuestion = 1) {
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
