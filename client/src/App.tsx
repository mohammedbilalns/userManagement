import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Register";
import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile";
import AdminLogin from "./pages/AdminLogin";
import DashBoard from "./pages/DashBoard";
import ProtectedRoute from "./components/ProtectedRoute";
import NavBar from "./components/Navbar";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <>
                  <NavBar></NavBar>
                  <Home />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <>
                  <NavBar></NavBar>

                  <UserProfile />
                </>
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Signup></Signup>
              </PublicRoute>
            }
          />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<DashBoard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
