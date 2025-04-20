import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Register";
import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile";
import AdminLogin from "./pages/AdminLogin";
import DashBoard from "./pages/DashBoard";
import NavBar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AdminPublic from "./components/AdminPublic";
import AdminProtected from "./components/AdminProtected";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
          <Route
            path="/admin/login"
            element={
              <AdminPublic>
                <AdminLogin />
              </AdminPublic>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtected>
                <DashBoard />
              </AdminProtected>
            }
          />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        draggable={false}
        toastClassName="bg-base-100 text-base-content shadow-lg rounded-box border border-base-300 p-4 font-medium"
        progressClassName="bg-primary"
        closeButton={false}
      />
    </>
  );
}

export default App;
