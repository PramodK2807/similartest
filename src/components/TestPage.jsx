import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Timer from './Timer.jsx';
import QuestionRow from './QuestionRow.jsx';
import Instructions from './Instructions.jsx';
import { InfoIcon } from './Icons.jsx';
import { buildQuestions, scoreAttempt } from '../utils/figures.js';
import { CANDIDATE } from '../config.js';

export default function TestPage({ test, onFinish, onQuit }) {
  const questions = useMemo(() => buildQuestions(test), [test]);
  const partCount = Math.ceil(questions.length / test.partSize);

  const [tab, setTab] = useState('test');
  const [part, setPart] = useState(0);
  const [answers, setAnswers] = useState(() => Array(questions.length).fill(null));
  const [confirming, setConfirming] = useState(false);

  const answersRef = useRef(answers);
  answersRef.current = answers;
  const finishedRef = useRef(false);
  const scrollRef = useRef(null);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinish(scoreAttempt(questions, answersRef.current, test.partSize, test.marksPerQuestion));
  }, [onFinish, questions, test.partSize, test.marksPerQuestion]);

  const select = useCallback((index, optionIndex) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = optionIndex;
      return next;
    });
  }, []);

  // No mouse-wheel scrolling: the question area only moves with its scroll bar.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;
    const stopWheel = (e) => e.preventDefault();
    const stopMiddleClick = (e) => {
      if (e.button === 1) e.preventDefault(); // middle-click auto-scroll
    };
    el.addEventListener('wheel', stopWheel, { passive: false });
    el.addEventListener('mousedown', stopMiddleClick);
    return () => {
      el.removeEventListener('wheel', stopWheel);
      el.removeEventListener('mousedown', stopMiddleClick);
    };
  }, []);

  // Each part opens at its first question.
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [part, tab]);

  const saveAndNext = () => {
    setPart((p) => (p + 1) % partCount);
    setTab('test');
  };

  const visible = questions.slice(part * test.partSize, (part + 1) * test.partSize);
  const answeredIn = (p) =>
    answers.slice(p * test.partSize, (p + 1) * test.partSize).filter((a) => a !== null).length;
  const totalAnswered = answers.filter((a) => a !== null).length;

  return (
    <div className="exam">
      <header className="exam-bar">
        <div className="exam-title">
          <button type="button" className="link-btn" onClick={onQuit}>
            Exit
          </button>
          <strong>{test.title}</strong>
        </div>
        <div className="exam-meta">
          <span className="candidate">Name: {CANDIDATE.name}</span>
          <Timer seconds={test.durationMin * 60} onExpire={finish} />
        </div>
      </header>

      <nav className="tabs main-tabs" aria-label="Test sections">
        <button
          type="button"
          className={`tab${tab === 'instructions' ? ' active' : ''}`}
          onClick={() => setTab('instructions')}
        >
          Same Figure Test Instructions <InfoIcon label="How this test works" />
        </button>
        <button
          type="button"
          className={`tab${tab === 'test' ? ' active' : ''}`}
          onClick={() => setTab('test')}
        >
          Same Figure Test <InfoIcon label="The questions" />
        </button>
      </nav>

      {tab === 'test' && (
        <nav className="tabs part-tabs" aria-label="Parts">
          {Array.from({ length: partCount }, (_, p) => (
            <button
              type="button"
              key={p}
              className={`tab${part === p ? ' active' : ''}`}
              onClick={() => setPart(p)}
            >
              Part {p + 1}{' '}
              <InfoIcon label={`${answeredIn(p)} of ${test.partSize} answered`} />
            </button>
          ))}
        </nav>
      )}

      <main className="scroll-area" ref={scrollRef}>
        {tab === 'instructions' ? (
          <Instructions test={test} />
        ) : (
          visible.map((q) => (
            <QuestionRow
              key={q.id}
              question={q}
              selected={answers[q.id - 1]}
              onSelect={select}
            />
          ))
        )}
      </main>

      <footer className="exam-footer">
        <button type="button" className="btn" onClick={saveAndNext}>
          Save &amp; Next
        </button>
        <button type="button" className="btn" onClick={() => setConfirming(true)}>
          Submit Test
        </button>
      </footer>

      {confirming && (
        <div className="modal-back" role="dialog" aria-modal="true" aria-labelledby="submit-title">
          <div className="modal">
            <h2 id="submit-title">Submit the test?</h2>
            <p>
              You have answered {totalAnswered} of {questions.length} questions.
            </p>
            <ul>
              {Array.from({ length: partCount }, (_, p) => (
                <li key={p}>
                  Part {p + 1}: {answeredIn(p)} of {test.partSize} answered
                </li>
              ))}
            </ul>
            <div className="modal-actions">
              <button type="button" className="btn ghost" onClick={() => setConfirming(false)}>
                Keep working
              </button>
              <button type="button" className="btn" onClick={finish}>
                Submit Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
