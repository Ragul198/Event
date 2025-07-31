// Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { FaUserCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getSessionAndRole = async () => {
      const { data } = await supabase.auth.getSession();
      const currentSession = data.session;
      setSession(currentSession);

      if (currentSession?.user) {
        const { data: student } = await supabase
          .from("students")
          .select("role")
          .eq("user_id", currentSession.user.id)
          .single();

        if (student?.role === "admin") setIsAdmin(true);
      }
    };

    getSessionAndRole();

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50"
    >
      <Link to="/" className="text-2xl font-extrabold text-blue-700 tracking-wide">
        RGL COLLEGE FEST
      </Link>

      {session && (
        <div className="flex items-center gap-6">
          <Link to="/myevents" className="text-gray-700 hover:text-blue-700 transition duration-300">
            My Events
          </Link>

          {isAdmin && (
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-700 transition duration-300">
              Admin
            </Link>
          )}

          <div className="relative">
            <FaUserCircle
              size={28}
              className="text-gray-700 cursor-pointer hover:text-blue-700 transition duration-300"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-md border z-50"
                >
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 transition"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 transition"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;
