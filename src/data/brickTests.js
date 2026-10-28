// ─────────────────────────────────────────────────────────────
// HOW TO ADD A NEW BRICK TEST
//  1. Put images in:  public/assets/image/brick3/brick1.jpg ... brick10.jpg
//  2. Copy one block below, change id/title, and write the answers.
//
// Images are loaded from:  /assets/image/<folder>/brick<N>.jpg
// (jpg is tried first; jpeg / png / webp also work automatically)
//
// ANSWERS: one string per image, 5 numbers in the order A,B,C,D,E
//   "3,4,8,4,2"  →  A=3, B=4, C=8, D=4, E=2
// ─────────────────────────────────────────────────────────────
export const BRICK_LETTERS = ["A", "B", "C", "D", "E"];
export const OPTION_COUNT = 10; // options 1..10

export const brickTests = [
  {
    id: "brick1",
    folder: "brick1", // public/assets/image/brick1/
    title: "Brick Test - 1",
    durationSec: 5 * 60,
    answers: [
      "6,5,5,7,8", // brick1.jpg  → A,B,C,D,E
      "5,5,7,6,6", // brick2.jpg
      "7,6,7,4,5", // brick3.jpg  ← replace with real answers
      "1,5,7,6,7", // brick4.jpg
      "7,6,7,4,5", // brick5.jpg
      "6,5,4,3,4", // brick6.jpg
      "9,7,6,5,4", // brick7.jpg
      "5,5,8,4,5", // brick8.jpg
      "5,5,5,6,5", // brick9.jpg
      "6,4,5,8,7", // brick10.jpg
    ],
  },
  {
    id: "brick2",
    folder: "brick2", // public/assets/image/brick2/
    title: "Brick Test - 2",
    durationSec: 5 * 60,
    answers: [
      "0,0,0,0,0",
      "0,0,0,0,0",
      "0,0,0,0,0",
      "0,0,0,0,0",
      "0,0,0,0,0",
      "0,0,0,0,0",
      "0,0,0,0,0",
      "0,0,0,0,0",
      "0,0,0,0,0",
      "0,0,0,0,0",
    ],
  },
];

// number of figures = number of answer rows (no separate count to maintain)
export const parseAnswers = (test) =>
  test.answers.map((row) => {
    const nums = String(row)
      .split(",")
      .map((n) => parseInt(n.trim(), 10));
    return Object.fromEntries(BRICK_LETTERS.map((l, i) => [l, nums[i]]));
  });
