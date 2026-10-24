import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function Result({ test, result, onHome }) {
  const chartData = [
    { name: "Correct", value: result.correct, color: "#22c55e" },
    { name: "Wrong", value: result.wrong, color: "#ef4444" },
    {
      name: "Not answered",
      value: result.unanswered,
      color: "#d1d5db",
    },
  ];

  const total = result.correct + result.wrong + result.unanswered;

  const accuracy = total > 0 ? Math.round((result.correct / total) * 100) : 0;

  return (
    <div className="result-wrap">
      <div className="result">
        <h1>Test submitted</h1>
        <p className="result-test">{test.title}</p>

        <div className="result-visuals">
          {/* Donut Chart */}
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={72}
                  outerRadius={100}
                  paddingAngle={4}
                  stroke="none"
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="chart-center">
              <strong>{accuracy}%</strong>
              <span>Accuracy</span>
            </div>
          </div>

          {/* Score and legend */}
          <div className="result-summary">
            <p className="score">
              {result.marks}
              <span> / {result.maxMarks}</span>
            </p>
            <p className="score-label">Your score</p>

            {chartData.map((item) => (
              <div className="legend-item" key={item.name}>
                <span
                  className="legend-dot"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.name}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Section-wise breakdown */}
        <h2 className="section-heading">Section-wise breakdown</h2>

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
