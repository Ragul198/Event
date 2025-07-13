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

  if (checking) return <div className="p-6 text-center">Checking permissions...</div>;

  return isAdmin ? children : <Navigate to="/" />;
};

export default AdminRoute;
