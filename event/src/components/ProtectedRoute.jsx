// components/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (loading) return <div>Loading...</div>;
  return session ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
