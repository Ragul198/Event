// pages/Login.jsx
import { supabase } from "../supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // loading state

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate("/");
      } else {
        setLoading(false); // stop loading if no session
      }
    });
  }, [navigate]);

  const handleGoogleLogin = async () => {
    setLoading(true); // loading during Google redirect
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:5173/auth/callback", // change for production
      },
    });

    if (error) {
      console.error("Login failed:", error.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center">
        <motion.div
          className="text-white text-2xl font-bold"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center">
      <motion.div
        className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h1
          className="text-3xl font-extrabold text-indigo-600 mb-3"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          RGL College of Engineering
        </motion.h1>

        <motion.p
          className="text-sm text-gray-600 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Welcome to our Event Registration Portal
        </motion.p>

        <motion.button
          onClick={handleGoogleLogin}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-red-500 hover:bg-red-600 text-white font-medium px-5 py-2 rounded-full transition-all duration-200 shadow-md"
        >
          Sign in with Google
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Login;
