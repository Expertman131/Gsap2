import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import routes from "tempo-routes";
import AnimationBuilder from "./components/animations/AnimationBuilder";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      {/* Tempo routes */}
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

      <Routes>
        <Route path="/" element={<AnimationBuilder />} />
        <Route path="/text" element={<AnimationBuilder />} />
        <Route path="/cards" element={<AnimationBuilder />} />
        <Route path="/svg" element={<AnimationBuilder />} />
        <Route path="/timeline" element={<AnimationBuilder />} />
        <Route path="/interaction" element={<AnimationBuilder />} />
        <Route path="/scroll" element={<AnimationBuilder />} />
        {import.meta.env.VITE_TEMPO === "true" && <Route path="/tempobook/*" />}
      </Routes>
    </Suspense>
  );
}

export default App;
