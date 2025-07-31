// components/AdminRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabase/client";

const AdminRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (!user) {
        setChecking(false);
        return;
      }

      const { data: student } = await supabase
        .from("students")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (student?.role === "admin") {
        setIsAdmin(true);
      }

      setChecking(false);
    };

    checkAdmin();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin mb-4"></div>
        <p className="text-lg text-gray-700 font-semibold">Checking admin access...</p>
      </div>
    );
  }

  return isAdmin ? children : <Navigate to="/" />;
};

export default AdminRoute;
