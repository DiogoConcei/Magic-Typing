import { Routes, Route } from "react-router";
import Home from "./page/Home/Home";
import TypingGame from "./page/TypingGame/TypingGame";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/typing-game" element={<TypingGame />} />
    </Routes>
  );
}
