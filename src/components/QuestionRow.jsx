import { memo } from "react";
import Figure from "./Figure.jsx";

const LETTERS = "ABCDE";

function QuestionRow({ question, selected, onSelect }) {
  const number = question.id;
  return (
    <section className="q-row" aria-label={`Question ${number}`}>
      <div className="q-main">
        <span className="q-no">Q. {number}</span>
        <Figure spec={question.main} />
      </div>
      <div
        className="q-options"
        role="radiogroup"
        aria-label={`Options for question ${number}`}
      >
        {question.options.map((option, i) => (
          <div className="q-opt" key={i}>
            <input
              type="radio"
              name={`q${number}`}
              checked={selected === i}
              onChange={() => onSelect(number - 1, i)}
              aria-label={`Option ${LETTERS[i]}`}
            />
            <Figure spec={option} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default memo(QuestionRow);
