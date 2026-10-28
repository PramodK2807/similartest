import { useState } from "react";
import BrickTest from "./BrickTest";
import { brickTests } from "../data/brickTests";

export default function BrickHome() {
  const [active, setActive] = useState(null);

  if (active)
    return (
      <BrickTest
        key={active.id + Date.now()}
        test={active}
        onExit={() => setActive(null)}
      />
    );

  return (
    <div className="bt-home">
      {brickTests.map((t) => {
        const attempted = localStorage.getItem(`attempted:${t.id}`) === "1";
        return (
          <div className="bt-card" key={t.id}>
            <h3>{t.title}</h3>
            <p>
              {t.answers.length} figures • 5 bricks each • {t.durationSec / 60}{" "}
              min
            </p>
            <button className="bt-btn primary" onClick={() => setActive(t)}>
              {attempted ? "Re-Attempt" : "Start Now"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
