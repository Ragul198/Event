// pages/Profile.jsx
import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { motion } from "framer-motion";
import profileIllustration from "../assets/profile-illustration.svg"; // Add a cool SVG or illustration

const Profile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("students")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error("Error fetching student:", error);
        } else {
          setStudent(data);
        }
        setLoading(false);
      }
    };

    fetchStudent();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <motion.div
          className="text-2xl font-semibold text-gray-700"
          animate={{ opacity: [0, 1], y: [10, 0] }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Loading your profile...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-10 px-4">
      <motion.div
        className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden p-6 md:p-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col md:flex-row items-center gap-8">
          <img
            src={profileIllustration}
            alt="Profile"
            className="w-48 h-48 object-contain"
          />
          <div className="flex-1">
            <h2 className="text-3xl font-extrabold text-purple-700 mb-6">👤 Student Profile</h2>
            {student ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800 text-lg">
                <p><span className="font-semibold">First Name:</span> {student.first_name}</p>
                <p><span className="font-semibold">Last Name:</span> {student.last_name}</p>
                <p><span className="font-semibold">Email:</span> {student.email}</p>
                <p><span className="font-semibold">Register No:</span> {student.register_number}</p>
                <p><span className="font-semibold">Mobile:</span> {student.mobile}</p>
                <p><span className="font-semibold">Gender:</span> {student.gender}</p>
                <p><span className="font-semibold">College:</span> {student.college}</p>
                <p><span className="font-semibold">Department:</span> {student.department}</p>
                <p><span className="font-semibold">Year:</span> {student.year}</p>
              </div>
            ) : (
              <p className="text-red-500">No profile data found.</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
