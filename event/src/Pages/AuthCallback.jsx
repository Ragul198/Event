// src/pages/AuthCallback.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStudent = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          console.warn("🔐 No session or user found:", sessionError);
          navigate("/login");
          return;
        }

        const user = session.user;
        console.log("✅ Logged-in user ID:", user.id);

        const { data: studentData, error: studentError } = await supabase
          .from("students")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (studentError) {
          console.error("❌ Student check failed:", studentError);
        }

        console.log("📦 Student record found:", studentData);

        if (studentData && studentData.id) {
          console.log("➡️ Redirecting to home");
          navigate("/");
        } else {
          console.log("➡️ No student record, redirecting to /student-setup");
          navigate("/student-setup");
        }
      } catch (err) {
        console.error("🚨 Unexpected error in AuthCallback:", err);
      } finally {
        setLoading(false);
      }
    };

    checkStudent();
  }, [navigate]);

  return (
    <div className="h-screen flex justify-center items-center">
      <p className="text-lg text-gray-600">
        {loading ? "Checking your profile..." : "Redirecting..."}
      </p>
    </div>
  );
};

export default AuthCallback;
