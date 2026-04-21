import { Routes, Route } from "react-router-dom";
import Edit from "./components/Editor";
import Login from "./Pages/login";
import Register from "./Pages/register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Edit />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;