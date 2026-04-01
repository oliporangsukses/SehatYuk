import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Mood from "./pages/Mood";
import Burnout from "./pages/Burnout";
import Artikel from "./pages/Artikel";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mood" element={<Mood />} />
        <Route path="/burnout" element={<Burnout />} />
        <Route path="/artikel" element={<Artikel />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;