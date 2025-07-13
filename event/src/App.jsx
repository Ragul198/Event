// App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute.jsx";

import Home from "./pages/Home.jsx";
import EventDetails from "./pages/EventDetails.jsx";
import Login from "./pages/Login.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import MyEvents from "./pages/MyEvents.jsx";
import RegisterForm from "./pages/RegisterForm.jsx";
import EventRegistrations from "./pages/EventRegistrations.jsx";
import Profile from "./pages/Profile.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";
import StudentSetup from "./pages/StudentSetup.jsx";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/event/:id"
          element={
            <ProtectedRoute>
              <EventDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/myevents"
          element={
            <ProtectedRoute>
              <MyEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/event/:id/register"
          element={
            <ProtectedRoute>
              <RegisterForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-setup"
          element={
            <ProtectedRoute>
              <StudentSetup />
            </ProtectedRoute>
          }
        />

        {/* Admin-only Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/event/:id/registrations"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <EventRegistrations />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
