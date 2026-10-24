import TestCard from './TestCard.jsx';
import { tests } from '../data/tests.js';

export default function Home({ isAttempted, onOpen }) {
  return (
    <div className="home">
      <header className="home-head">Psycho Test Series</header>
      <div className="home-list">
        {tests.map((test) => (
          <TestCard key={test.id} test={test} attempted={isAttempted(test.id)} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}
