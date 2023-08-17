import Appointments from "./pages/Appointments.tsx";
import LoginPage from "./pages/Login.tsx";
import "./index.css";
import DashboardPage from "./pages/Dashboard.tsx";
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navigation from "./Navigation.tsx";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <>
      <Router>
        <Navigation />
        <Routes>
          <Route index element={<Appointments />} />
          <Route path="login" element={<LoginPage onLogin={handleLogin} />} />
          <Route
            path="dashboard"
            element={<DashboardPage isAuthenticated={isAuthenticated} />}
          />
        </Routes>
      </Router>
    </>
  );
};
export default App;
