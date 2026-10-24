export default function Instructions({ test }) {
  const parts = Math.ceil(test.totalQuestions / test.partSize);
  return (
    <div className="instructions">
      <h2>{test.title}</h2>
      <ol>
        <li>
          The paper has {test.totalQuestions} questions in {parts} parts of {test.partSize}. You have{' '}
          {test.durationMin} minutes for the whole paper, and one timer covers both parts.
        </li>
        <li>
          Each question shows one figure on the left and five options below it. Choose the option that is
          exactly the same as the figure.
        </li>
        <li>
          Wrong options differ in small details: the direction of the arrow, black or white fill on the
          square, triangle or arrow head, one or two circles, the mark inside the diamond, or where the
          square and triangle sit.
        </li>
        <li>
          Press Save &amp; Next to move to the other part. Your answers stay saved, and pressing it again
          takes you back to the first part.
        </li>
        <li>
          The mouse wheel does not scroll the questions. Drag the scroll bar on the right side of the
          page instead.
        </li>
        <li>
          Each correct answer is worth {test.marksPerQuestion} mark. There is no negative marking.
        </li>
        <li>The test submits itself when the time ends. You can also press Submit Test at any time.</li>
      </ol>
    </div>
  );
}
