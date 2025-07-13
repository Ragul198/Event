// pages/Profile.jsx
import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";

const Profile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

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
      <div className="max-w-xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">👤 Your Profile</h2>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">👤 Your Profile</h2>
      {student ? (
        <div className="space-y-3 bg-white p-4 rounded shadow">
          <p><strong>First Name:</strong> {student.first_name}</p>
          <p><strong>Last Name:</strong> {student.last_name}</p>
          <p><strong>Email:</strong> {student.email}</p>
          <p><strong>Register Number:</strong> {student.register_number}</p>
          <p><strong>Mobile:</strong> {student.mobile}</p>
          <p><strong>Gender:</strong> {student.gender}</p>
          <p><strong>College:</strong> {student.college}</p>
          <p><strong>Department:</strong> {student.department}</p>
          <p><strong>Year:</strong> {student.year}</p>
          <p><strong>User ID:</strong> {student.user_id}</p>
        </div>
      ) : (
        <p>No profile data found.</p>
      )}
    </div>
  );
};

export default Profile;
