// Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { FaUserCircle } from "react-icons/fa";

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
        const { data: student, error } = await supabase
          .from("students")
          .select("role")
          .eq("user_id", currentSession.user.id)
          .single();

        if (student?.role === "admin") {
          setIsAdmin(true);
        }
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
    <nav className="bg-white shadow p-4 flex justify-between items-center relative">
      <Link to="/" className="text-xl font-bold text-blue-600">
        College Fest
      </Link>

      {session && (
        <div className="flex items-center space-x-4">
          <Link to="/myevents" className="text-gray-700 hover:text-blue-600">
            My Events
          </Link>

          {isAdmin && (
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
              Admin
            </Link>
          )}

          <div className="relative">
            <FaUserCircle
              size={28}
              className="text-gray-700 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded border z-50">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  View Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
