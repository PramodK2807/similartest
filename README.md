# Same Figure Test

React + JavaScript (Vite). Home page with test cards, a 96-question paper split into
two parts of 48, one 8-minute timer.

## Run it

```bash
npm install
npm run dev      # open the address it prints
npm run build    # production build in /dist
```

## How the test behaves

- Home card shows **Start Now** until the test is submitted, then only **Re-Attempt**.
  (Attempts are remembered in the browser's localStorage.)
- **Save & Next** switches Part 1 -> Part 2, and again Part 2 -> Part 1. Answers are kept.
- One timer for the whole paper. When it reaches 0 the test submits itself.
- The mouse wheel does not scroll the questions; only the scroll bar does.

## Add another test (test 5, 6, ...)

Open `src/data/tests.js` and add one line:

```js
{ ...COMMON, id: 'sft-5', title: 'Same Figure Test - 5', seed: 5505 },
```

A new `seed` gives a completely new set of 96 questions. The same seed always gives the
same paper, so Re-Attempt shows the same questions.

You can also change per test: `durationMin`, `totalQuestions`, `partSize`, `validFrom`,
`validTo`, `title`, `pattern`.

## Use your own hand-made questions

Add a `questions` array to a test. Each question has a `main` figure, five `options`,
and the index (0-4) of the correct option in `answer`:

```js
{
  ...COMMON, id: 'sft-6', title: 'Same Figure Test - 6',
  questions: [
    {
      main:   { square: 'black', tri: 'white', head: 'cw', headFill: 'black', rings: 1, inner: 'dot', squarePos: 'tl', triPos: 'tr' },
      options: [ /* five figures like the one above */ ],
      answer: 2,
    },
    // ...96 of these
  ],
}
```

Allowed values for each figure feature are listed in `FEATURES` in `src/utils/figures.js`.

## Changing the figures

All drawing is in `src/utils/figureShapes.js` (plain SVG shapes). Add a new feature there
and to `FEATURES`, and every generated test uses it.

## Files

```
src/
  App.jsx                  home -> test -> result
  config.js                candidate name, storage key
  data/tests.js            list of tests (edit this to add tests)
  hooks/useAttempts.js     remembers attempted tests
  utils/figures.js         question generator + scoring
  utils/figureShapes.js    SVG drawing of one figure
  utils/rng.js             seeded random numbers
  components/              Home, TestCard, TestPage, QuestionRow, Timer, Figure, ...
  styles.css
```
