import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/DashboardPage/Dashboard.jsx";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";

function App() {
  return(
    <>
      {/* <Dashboard /> */}
      {/* <LoginPage /> */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

    </>
  )
}

export default App;