import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./components/auth/signin";
import Signup from "./components/auth/signup";
import Dashboard from "./components/dashboard";
import StorageMetrics from "./components/metrics/metrics";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/metrics" element={<StorageMetrics />} />
      </Routes>
    </Router>
  );
}

export default App;