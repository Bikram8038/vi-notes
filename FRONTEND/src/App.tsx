import { Routes, Route } from "react-router-dom";
import Edit from "./components/Editor";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Edit />} />
    </Routes>
  );
}

export default App;