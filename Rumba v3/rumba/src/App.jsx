import { Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing.jsx";
import Login from "../pages/Login.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Register from "../pages/Register.jsx";
import Admin from "../pages/Admin.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/app" element={<Dashboard />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;