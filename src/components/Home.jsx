import TestCard from "./TestCard.jsx";
import { tests } from "../data/tests.js";
import BrickHome from "./BrickHome.jsx";
import { useState } from "react";
const TABS = [
  { id: "brick", label: "Brick Test" },
  { id: "same", label: "Same Figure Test" },
];
export default function Home({ isAttempted, onOpen }) {
  const [tab, setTab] = useState("brick");

  return (
    <div className="home">
      <header className="home-head">Psycho Test Series</header>

      <div className="top-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={tab === t.id ? "active" : ""}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === "brick" ? (
        <BrickHome />
      ) : (
        <div className="home-list">
          {tests.map((test) => (
            <TestCard
              key={test.id}
              test={test}
              attempted={isAttempted(test.id)}
              onOpen={onOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
}
