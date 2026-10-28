import { useEffect, useMemo, useRef, useState } from "react";
import { BRICK_LETTERS, OPTION_COUNT, parseAnswers } from "../data/brickTests";

const EXTS = ["jpg", "jpeg", "png", "webp", "jfif"];

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const fmt = (s) => {
  const m = String(Math.floor(s / 60)).padStart(2, "0");
  const r = String(s % 60).padStart(2, "0");
  return `00:${m}:${r}`;
};

/** Tries jpeg → jpg → png → webp → jfif until one loads */
function BrickImage({ folder, index }) {
  const [e, setE] = useState(0);
  if (e >= EXTS.length)
    return (
      <div className="bt-missing">
        brick{index}.* not found in /assets/image/{folder}/
      </div>
    );
  return (
    <img
      className="bt-img"
      alt={`Figure ${index}`}
      src={`/assets/image/${folder}/brick${index}.${EXTS[e]}`}
      onError={() => setE(e + 1)}
      draggable={false}
    />
  );
}

export default function BrickTest({ test, onExit }) {
  // shuffle once per attempt: letter order + option order for every question
  const key = useMemo(() => parseAnswers(test), [test]);
  const paper = useMemo(
    () =>
      Array.from({ length: key.length }, (_, i) => ({
        index: i + 1,
        questions: shuffle(BRICK_LETTERS).map((letter) => ({
          letter,
          options: shuffle(
            Array.from({ length: OPTION_COUNT }, (_, k) => k + 1),
          ),
        })),
      })),
    [key],
  );

  const [part, setPart] = useState(0);
  const [answers, setAnswers] = useState({}); // "partIdx-letter" -> number
  const [left, setLeft] = useState(test.durationSec);
  const [done, setDone] = useState(false);
  const root = useRef(null);

  // timer (one for the whole test)
  useEffect(() => {
    if (done) return;
    if (left <= 0) return setDone(true);
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left, done]);

  // mouse-wheel disabled – scroll only with scrollbars / touch
  useEffect(() => {
    const el = root.current;
    const stop = (e) => e.preventDefault();
    el?.addEventListener("wheel", stop, { passive: false });
    return () => el?.removeEventListener("wheel", stop);
  }, []);

  // full screen on start
  useEffect(() => {
    document.documentElement.requestFullscreen?.().catch(() => {});
    return () => {
      if (document.fullscreenElement)
        document.exitFullscreen?.().catch(() => {});
    };
  }, []);

  useEffect(() => {
    if (done) localStorage.setItem(`attempted:${test.id}`, "1");
  }, [done, test.id]);

  const pick = (letter, n) =>
    setAnswers((a) => ({ ...a, [`${part}-${letter}`]: n }));

  const score = useMemo(() => {
    if (!done) return null;
    let ok = 0,
      total = 0;
    key.forEach((row, p) =>
      Object.entries(row).forEach(([l, v]) => {
        total++;
        if (answers[`${p}-${l}`] === v) ok++;
      }),
    );
    return { ok, total };
  }, [done, answers, key]);

  if (done) {
    const attempted = Object.keys(answers).length;
    return (
      <div className="bt-result">
        <h2>{test.title} – Submitted</h2>
        <p>
          Attempted: {attempted} / {key.length * 5}
        </p>
        {score && (
          <p>
            Score: {score.ok} / {score.total}
          </p>
        )}
        <button className="bt-btn primary" onClick={onExit}>
          Back to tests
        </button>
      </div>
    );
  }

  const cur = paper[part];
  const answeredInPart = (p) => BRICK_LETTERS.some((l) => answers[`${p}-${l}`]);

  return (
    <div className="bt-root" ref={root}>
      <header className="bt-top">
        <b>{test.title}</b>
        <span className={`bt-timer ${left < 30 ? "low" : ""}`}>
          Time Left {fmt(left)}
        </span>
        <button
          className="bt-btn"
          onClick={() => window.confirm("Submit test?") && setDone(true)}
        >
          Submit Test
        </button>
      </header>

      <nav className="bt-parts">
        {paper.map((p, i) => (
          <button
            key={p.index}
            className={`bt-part ${i === part ? "active" : ""} ${answeredInPart(i) ? "done" : ""}`}
            onClick={() => setPart(i)}
          >
            Part {p.index}
          </button>
        ))}
      </nav>

      <main className="bt-body">
        <section className="bt-left">
          <h3>Figure {cur.index}</h3>
          <BrickImage
            key={`${test.id}-${cur.index}`}
            folder={test.folder}
            index={cur.index}
          />
          <p className="bt-hint">How many Bricks are touching</p>
        </section>

        <section className="bt-right">
          <div className="bt-scroll">
            <div className="bt-qs">
              {cur.questions.map((q, qi) => (
                <div className="bt-q" key={`${part}-${q.letter}`}>
                  <div className="bt-label">
                    <span className="bt-qno">Q. {qi + 1}</span>
                    <span className="bt-qtext">Brick {q.letter}?</span>
                  </div>
                  <div className="bt-opts">
                    {q.options.map((n) => (
                      <label key={n} className="bt-opt">
                        <input
                          type="radio"
                          name={`${part}-${q.letter}`}
                          checked={answers[`${part}-${q.letter}`] === n}
                          onChange={() => pick(q.letter, n)}
                        />
                        <span>{n}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bt-nav">
            <button
              className="bt-btn"
              disabled={part === 0}
              onClick={() => setPart(part - 1)}
            >
              Previous
            </button>
            <button
              className="bt-btn primary"
              onClick={() =>
                part < paper.length - 1
                  ? setPart(part + 1)
                  : window.confirm("Submit test?") && setDone(true)
              }
            >
              {part < paper.length - 1 ? "Save & Next" : "Submit Test"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
