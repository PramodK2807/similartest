// import { mulberry32, shuffle } from "./rng.js";
// /**
//  * A figure is a plain object that picks one value for each feature.
//  *
//  * Every feature below is easy to see. To guarantee that no two options ever
//  * look alike, each wrong option differs from the main figure in a DIFFERENT
//  * group of features (1 or 2 of them).
//  */
// export const FEATURES = {
//   sqTilt: ["tilt", "flat"], // black square: tilted or flat
//   endFill: ["black", "white"], // triangle at the end of the top arc
//   endDir: ["up", "down"], // that triangle: apex up or down
//   sideFill: ["black", "white"], // triangle on the right
//   sideDir: ["R", "L"], // that triangle points right or left
//   leftHead: ["end", "start"], // left arc: arrow at its end or its start
//   rightHead: ["end", "start"], // right arc: arrow at its end or its start
//   diamondPos: ["c", "l", "r", "u", "d"], // diamond: centre / left / right / up / down
//   diamondTilt: [25, 45, 65], // diamond turn in degrees
//   curve: ["r", "d", "l", "u"], // inner curve bulges right / down / left / up
// };

// const KEYS = Object.keys(FEATURES);
// export const OPTIONS_PER_QUESTION = 5;

// export const signature = (fig) => KEYS.map((k) => fig[k]).join("|");

// const pick = (list, rng) => list[Math.floor(rng() * list.length)];
// const otherValue = (fig, key, rng) =>
//   pick(
//     FEATURES[key].filter((v) => v !== fig[key]),
//     rng,
//   );

// function randomFigure(rng) {
//   const fig = {};
//   for (const key of KEYS) fig[key] = pick(FEATURES[key], rng);
//   return fig;
// }

// // n different groups of 1-2 features, e.g. ['sqTilt'], ['curve','sideDir'] ...
// function pickChangeSets(rng, n) {
//   const sets = [];
//   const used = new Set();
//   let guard = 0;
//   while (sets.length < n && guard++ < 1000) {
//     const keys = shuffle(KEYS, rng)
//       .slice(0, rng() < 0.6 ? 1 : 2)
//       .sort();
//     const id = keys.join("+");
//     if (!used.has(id)) {
//       used.add(id);
//       sets.push(keys);
//     }
//   }
//   return sets;
// }

// function makeQuestion(rng) {
//   const main = randomFigure(rng);
//   const wrong = pickChangeSets(rng, OPTIONS_PER_QUESTION - 1).map((keys) => {
//     const fig = { ...main };
//     keys.forEach((k) => {
//       fig[k] = otherValue(main, k, rng);
//     });
//     return fig;
//   });

//   const answer = Math.floor(rng() * OPTIONS_PER_QUESTION);
//   const options = [...wrong];
//   options.splice(answer, 0, { ...main });
//   return { main, options, answer };
// }

// export function generateQuestions({ seed, count }) {
//   const rng = mulberry32(seed);
//   return Array.from({ length: count }, (_, i) => ({
//     id: i + 1,
//     ...makeQuestion(rng),
//   }));
// }
// /** Generated questions, or the test's own hand-made `questions` array. */
// export function buildQuestions(test) {
//   if (Array.isArray(test.questions) && test.questions.length) {
//     return test.questions.map((q, i) => ({ ...q, id: i + 1 }));
//   }
//   return generateQuestions({ seed: test.seed, count: test.totalQuestions });
// }

// export function scoreAttempt(
//   questions,
//   answers,
//   partSize,
//   marksPerQuestion = 1,
// ) {
//   const parts = [];
//   let correct = 0;
//   let wrong = 0;
//   let unanswered = 0;

//   questions.forEach((q, i) => {
//     const p = Math.floor(i / partSize);
//     if (!parts[p]) parts[p] = { correct: 0, wrong: 0, unanswered: 0 };
//     const given = answers[i];
//     if (given === null || given === undefined) {
//       unanswered++;
//       parts[p].unanswered++;
//     } else if (given === q.answer) {
//       correct++;
//       parts[p].correct++;
//     } else {
//       wrong++;
//       parts[p].wrong++;
//     }
//   });

//   return {
//     total: questions.length,
//     correct,
//     wrong,
//     unanswered,
//     marks: correct * marksPerQuestion,
//     maxMarks: questions.length * marksPerQuestion,
//     parts,
//   };
// }
import { mulberry32, shuffle } from "./rng.js";

/**
 * A figure is a plain object that picks one value for each feature.
 * Its `kind` ('type1' or 'type2') tells Figure.jsx which drawing to use.
 *
 * Every wrong option changes a DIFFERENT group of features, so no two
 * options of a question can ever look alike.
 */

/* ---------- TYPE 1: arrows, circle, diamond ---------- */
export const FEATURES = {
  // base: same for every option of a question
  sqTilt: ["tilt", "flat"], // black square: tilted or flat
  endFill: ["black", "white"], // triangle at the end of the top arc
  endDir: ["up", "down"], // that triangle: apex up or down
  sideFill: ["black", "white"], // triangle on the right
  sideDir: ["R", "L"], // that triangle points right or left
  diamondPos: ["c", "l", "r", "u", "d"], // diamond: centre / left / right / up / down
  // inside the diamond
  curve: ["r", "d", "l", "u"], // curve bulges right / down / left / up
  curveShift: ["c", "p", "q"], // curve + dot: centre / up-right / down-left
  diamondTilt: [25, 45, 65], // diamond turn in degrees
  // arrows
  leftHead: ["end", "start"], // left arc: arrow at its end or its start
  rightHead: ["end", "start"], // right arc: arrow at its end or its start
};
const INSIDE = ["curve", "curveShift", "diamondTilt"];
const ARROWS = ["leftHead", "rightHead"];

/* ---------- TYPE 2: framed figure with bowl and triangles ---------- */
const ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]; // direction a triangle points
export const FEATURES2 = {
  bowl: ["n", "ne", "e", "se", "s", "sw", "w", "nw"], // half-circle bulges this way
  shaft: ["on", "off"], // line from upper-left to lower-right triangle
  ulFill: ["black", "white"], // upper-left triangle
  ulDir: ANGLES,
  llFill: ["black", "white"], // lower-left triangle
  llDir: ANGLES,
  lrFill: ["black", "white"], // lower-right triangle
  lrDir: ANGLES,
};

export const OPTIONS_PER_QUESTION = 5;

const pick = (list, rng) => list[Math.floor(rng() * list.length)];
const otherValue = (features, fig, key, rng) =>
  pick(
    features[key].filter((v) => v !== fig[key]),
    rng,
  );

function randomFigure(features, rng) {
  const fig = {};
  for (const key of Object.keys(features)) fig[key] = pick(features[key], rng);
  return fig;
}

// All groups of 1-2 keys taken from `keys`, in random order.
function allGroups(keys, rng) {
  const groups = keys.map((k) => [k]);
  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) groups.push([keys[i], keys[j]]);
  }
  return shuffle(groups, rng);
}

// Collects different change groups; the same group is never used twice.
function groupCollector() {
  const groups = [];
  const used = new Set();
  return {
    groups,
    add(keys) {
      const id = [...keys].sort().join("+");
      if (used.has(id)) return false;
      used.add(id);
      groups.push(keys);
      return true;
    },
  };
}

// type 1: mostly "inside the diamond", one or two arrow changes.
function groupsType1(rng) {
  const arrowCount = rng() < 0.3 ? 2 : 1;
  const { groups, add } = groupCollector();
  for (const g of allGroups(ARROWS, rng)) {
    if (groups.length >= arrowCount) break;
    // sometimes an arrow change also touches the inside of the diamond
    add(rng() < 0.4 ? [...g, pick(INSIDE, rng)] : g);
  }
  for (const g of allGroups(INSIDE, rng)) {
    if (groups.length >= OPTIONS_PER_QUESTION - 1) break;
    add(g);
  }
  return groups;
}

// type 2: any 1-2 of the 8 features.
function groupsType2(rng) {
  const { groups, add } = groupCollector();
  for (const g of allGroups(Object.keys(FEATURES2), rng)) {
    if (groups.length >= OPTIONS_PER_QUESTION - 1) break;
    add(g);
  }
  return groups;
}

const KINDS = {
  type1: { features: FEATURES, groups: groupsType1 },
  type2: { features: FEATURES2, groups: groupsType2 },
};

function makeQuestion(rng, kind) {
  const { features, groups } = KINDS[kind];
  const main = randomFigure(features, rng);
  const wrong = groups(rng).map((keys) => {
    const fig = { ...main };
    keys.forEach((k) => {
      fig[k] = otherValue(features, main, k, rng);
    });
    return fig;
  });

  const answer = Math.floor(rng() * OPTIONS_PER_QUESTION);
  const options = [...wrong];
  options.splice(answer, 0, { ...main });

  const tag = (fig) => ({ kind, ...fig });
  return { main: tag(main), options: options.map(tag), answer };
}

export function generateQuestions({ seed, count, kind = "type1" }) {
  const rng = mulberry32(seed);
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    ...makeQuestion(rng, kind),
  }));
}

/**
 * Questions for a test.
 *  - `test.questions`: hand-made list (used as it is)
 *  - `test.kinds`: figure type of each part, e.g. ['type1', 'type2'].
 *    Missing = type 1 everywhere.
 */
export function buildQuestions(test) {
  if (Array.isArray(test.questions) && test.questions.length) {
    return test.questions.map((q, i) => ({ ...q, id: i + 1 }));
  }

  const parts = Math.ceil(test.totalQuestions / test.partSize);
  const kindOf = (p) => (test.kinds && test.kinds[p]) || "type1";
  const sameEverywhere = Array.from({ length: parts }, (_, p) =>
    kindOf(p),
  ).every((k) => k === kindOf(0));

  if (sameEverywhere) {
    return generateQuestions({
      seed: test.seed,
      count: test.totalQuestions,
      kind: kindOf(0),
    });
  }

  const all = [];
  for (let p = 0; p < parts; p++) {
    const count = Math.min(
      test.partSize,
      test.totalQuestions - p * test.partSize,
    );
    all.push(
      ...generateQuestions({
        seed: test.seed + (p + 1) * 1000,
        count,
        kind: kindOf(p),
      }),
    );
  }
  return all.map((q, i) => ({ ...q, id: i + 1 }));
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
