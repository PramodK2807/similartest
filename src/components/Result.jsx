export default function Result({ test, result, onHome }) {
  return (
    <div className="result-wrap">
      <div className="result">
        <h1>Test submitted</h1>
        <p className="result-test">{test.title}</p>
        <p className="score">
          {result.marks} <span>/ {result.maxMarks}</span>
        </p>
        <table className="sec-table">
          <thead>
            <tr>
              <th>Section</th>
              <th>Correct</th>
              <th>Wrong</th>
              <th>Not answered</th>
            </tr>
          </thead>
          <tbody>
            {result.parts.map((p, i) => (
              <tr key={i}>
                <td>Part {i + 1}</td>
                <td>{p.correct}</td>
                <td>{p.wrong}</td>
                <td>{p.unanswered}</td>
              </tr>
            ))}
            <tr className="total">
              <td>Total</td>
              <td>{result.correct}</td>
              <td>{result.wrong}</td>
              <td>{result.unanswered}</td>
            </tr>
          </tbody>
        </table>
        <button type="button" className="btn" onClick={onHome}>
          Back to tests
        </button>
      </div>
    </div>
  );
}
