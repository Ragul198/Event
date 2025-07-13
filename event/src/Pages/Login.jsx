// pages/Login.jsx
import { supabase } from "../supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate("/");
      }
    });
  }, [navigate]);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:5173/auth/callback", // ✅ Force redirect after login
      },
    });

    if (error) console.error("Login failed:", error.message);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow text-center">
        <h2 className="text-2xl font-bold mb-4">Login with Google</h2>
        <button
          onClick={handleGoogleLogin}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
