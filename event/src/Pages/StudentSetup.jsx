import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";

const departmentOptions = ["CSE", "MECH", "IT", "AI", "ECE", "CIVIL", "EEE", "MBA"];
const yearOptions = {
  MBA: ["1st Year", "2nd Year"],
  default: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
};

const containsEmojiOrSymbols = (text) => {
  const emojiRegex = /[\u{1F600}-\u{1F6FF}]/u;
  const symbolRegex = /[^a-zA-Z0-9\s\.\-]/;
  return emojiRegex.test(text) || symbolRegex.test(text);
};

const StudentSetup = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    college: "",
    department: "",
    year: "",
    gender: "",
    register_number: "",
    mobile: "",
  });

  const [user, setUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateInputs = () => {
    const { first_name, last_name, college, register_number, mobile } = formData;

    const allFilled = Object.values(formData).every((val) => val.trim() !== "");
    if (!allFilled) return "Please fill in all fields.";

    const hasInvalid = [first_name, last_name, college].some((val) => containsEmojiOrSymbols(val));
    if (hasInvalid) return "Text fields must not contain emojis or special characters.";

    if (!/^\d{10}$/.test(mobile)) return "Mobile number must be exactly 10 digits.";

    if (!/^[a-zA-Z0-9]+$/.test(register_number)) return "Register number should not contain special characters.";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateInputs();
    if (validationError) return alert("⚠️ " + validationError);

    setSubmitting(true);

    const { error } = await supabase.from("students").insert({
      user_id: user.id,
      email: user.email,
      ...formData, // ✅ all fields: first_name, last_name, etc.
    });

    setSubmitting(false);

    if (error) {
      alert("❌ Error saving student info");
      console.error(error);
    } else {
      alert("✅ Info saved successfully!");
      navigate("/");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Student Info</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="college"
          placeholder="College Name"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="register_number"
          placeholder="Register Number"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="mobile"
          placeholder="Mobile Number"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        {/* Gender */}
        <div className="flex gap-4 items-center">
          <label className="font-semibold">Gender:</label>
          {["Male", "Female", "Other"].map((g) => (
            <label key={g} className="flex items-center gap-1">
              <input
                type="radio"
                name="gender"
                value={g}
                onChange={handleChange}
                required
              />
              {g}
            </label>
          ))}
        </div>

        {/* Department */}
        <select
          name="department"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Department</option>
          {departmentOptions.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        {/* Year */}
        <select
          name="year"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Year</option>
          {(formData.department === "MBA" ? yearOptions.MBA : yearOptions.default).map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-2 rounded text-white ${submitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {submitting ? "Saving..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default StudentSetup;
