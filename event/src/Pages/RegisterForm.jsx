import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabase/client";

const RegisterForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [form, setForm] = useState({
    year: "",
    department: "",
    gender: "",
  });

  const [isRegistered, setIsRegistered] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    const loadEventAndStatus = async () => {
      // Get event
      const { data: eventData } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (!eventData) {
        alert("Event not found");
        return;
      }

      setEvent(eventData);

      // Check deadline
      const now = new Date();
      const deadline = new Date(eventData.registration_deadline);
      setIsClosed(now > deadline);

      // Check session
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (!user) {
        alert("You must be logged in to register.");
        navigate("/login");
        return;
      }

      // Check if already registered
      const { data: existing } = await supabase
        .from("registrations")
        .select("*")
        .eq("user_id", user.id)
        .eq("event_id", id);

      if (existing.length > 0) {
        setIsRegistered(true);
      }
    };

    loadEventAndStatus();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get current user
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;

    if (!user) {
      alert("Not logged in.");
      return;
    }

    const { error } = await supabase.from("registrations").insert([
      {
        user_id: user.id,
        event_id: event.id,
        form_data: form,
      },
    ]);

    if (error) {
      console.error("Registration error", error);
      alert("❌ Registration failed.");
      return;
    }

    alert("✅ Registered successfully!");
    navigate("/myevents");
  };

  if (!event) return <p className="p-6 text-red-500">❌ Invalid event.</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Register for {event.title}</h1>

      {isClosed ? (
        <p className="text-red-500 text-center font-semibold">❌ Registration closed for this event.</p>
      ) : isRegistered ? (
        <p className="text-yellow-600 text-center font-semibold">✅ You have already registered for this event.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="department"
            placeholder="Department"
            required
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="year"
            placeholder="Year (e.g., 3rd)"
            required
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <select
            name="gender"
            required
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">
            Submit Registration
          </button>
        </form>
      )}
    </div>
  );
};

export default RegisterForm;
