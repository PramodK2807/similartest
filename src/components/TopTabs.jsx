import { useState } from "react";
import BrickHome from "./BrickHome";

const TABS = [
  { id: "brick", label: "Brick Test" },
  { id: "same", label: "Same Figure Test" },
];

export default function TopTabs() {
  const [tab, setTab] = useState("brick");
  return (
    <>
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
      {tab === "brick" ? <BrickHome /> : <SameFigureApp />}
    </>
  );
}
