import { useCallback, useState } from "react";
import Home from "./components/Home.jsx";
import TestPage from "./components/TestPage.jsx";
import Result from "./components/Result.jsx";
import { useAttempts } from "./hooks/useAttempts.js";

export default function App() {
  const { isAttempted, markAttempted } = useAttempts();
  const [view, setView] = useState({ name: "home" });

  // const open = useCallback((test) => setView({ name: 'test', test, run: Date.now() }), []);
  const open = useCallback((test) => {
    document.documentElement.requestFullscreen?.().catch(() => {});
    setView({ name: "test", test, run: Date.now() });
  }, []);
  // const home = useCallback(() => setView({ name: "home" }), []);
  const home = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen();
    setView({ name: "home" });
  }, []);
  if (document.fullscreenElement) document.exitFullscreen();

  const finish = useCallback((result) => {
    setView((current) => {
      if (current.name !== "test") return current;
      return { name: "result", test: current.test, result };
    });
  }, []);

  if (view.name === "test") {
    return (
      <TestPage
        key={view.run}
        test={view.test}
        onQuit={home}
        onFinish={(result) => {
          markAttempted(view.test.id);
          finish(result);
        }}
      />
    );
  }

  if (view.name === "result") {
    return <Result test={view.test} result={view.result} onHome={home} />;
  }

  return <Home isAttempted={isAttempted} onOpen={open} />;
}
