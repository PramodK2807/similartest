import { ClockIcon, MarksIcon, QuestionIcon } from "./Icons.jsx";

export default function TestCard({ test, attempted, onOpen, type }) {
  const parts = Math.ceil(test.totalQuestions / test.partSize);
  const maxMarks = (test.totalQuestions * test.marksPerQuestion).toFixed(2);

  return (
    <article className="card">
      <div className="card-top">
        <div>
          <div className="card-title">
            <h2>
              {test.title} ({test.pattern})
            </h2>
            <span className="badge">{test.series}</span>
          </div>
          <div className="meta">
            <span className="meta-item">
              <QuestionIcon /> {test.totalQuestions} Questions
            </span>
            <span className="meta-item">
              <MarksIcon /> {maxMarks} Marks
            </span>
            <span className="meta-item">
              <ClockIcon /> {test.durationMin} Mins
            </span>
            <span className="live">LIVE</span>
            <span>
              {test.validFrom} to {test.validTo}
            </span>
          </div>
        </div>
        <button type="button" className="btn" onClick={() => onOpen(test)}>
          {attempted ? "Re-Attempt" : "Start Now"}
        </button>
      </div>

      <table className="sec-table">
        <thead>
          <tr>
            <th>Section Name</th>
            <th>Question</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: parts }, (_, p) => (
            <tr key={p}>
              <td>Same Figure Test - Part {p + 1}</td>
              <td>{test.partSize}</td>
              {p === 0 && <td rowSpan={parts}>{test.durationMin} Min</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}
