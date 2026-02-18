import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/DashboardPage/Dashboard.jsx";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import NotFound from "./pages/404NotFoundPage.jsx";
import UserManagement from "./pages/UserManagementPage/UserManagement.jsx";
import RoleManagement from "./pages/RoleManagementPage/RoleManagement.jsx";
import Inventory from "./pages/InventoryPage/Inventory.jsx";

function App() {
  return(
    <>
      {/* <Dashboard /> */}
      {/* <LoginPage /> */}
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['Admin', 'Manager']}>
                                              <Dashboard />
                                            </ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
          <Route path="/users" element={<ProtectedRoute allowedRoles={['Admin', 'Manager']}><UserManagement /></ProtectedRoute>} />
          <Route path="/roles" element={<ProtectedRoute allowedRoles={['Admin', 'Manager']}><RoleManagement /></ProtectedRoute>} />
          <Route path="/inventory" element={<ProtectedRoute allowedRoles={['Admin', 'Manager']}><Inventory /></ProtectedRoute>} />
        </Routes>
      
    </>
  )
}

export default App;