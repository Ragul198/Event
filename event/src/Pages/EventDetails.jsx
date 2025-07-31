import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { motion } from "framer-motion";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEventAndCheck = async () => {
      setLoading(true);

      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (eventError) {
        console.error("Event fetch error:", eventError.message);
        setLoading(false);
        return;
      }

      setEvent(eventData);

      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user;
      if (user) {
        const { data } = await supabase
          .from("registrations")
          .select("id")
          .eq("user_id", user.id)
          .eq("event_id", id)
          .maybeSingle();

        if (data) setIsRegistered(true);
      }

      setLoading(false);
    };

    loadEventAndCheck();
  }, [id]);

  const handleRegister = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) return;

    const { error } = await supabase.from("registrations").insert({
      user_id: user.id,
      event_id: id,
    });

    if (!error) {
      alert("✅ Registered successfully!");
      navigate("/myevents");
    } else {
      alert("⚠️ Registration failed or already registered.");
      console.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
        <motion.div
          className="text-blue-600 font-bold text-xl"
          initial={{ opacity: 0.4, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1.05 }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.8 }}
        >
          Loading Event Details...
        </motion.div>
      </div>
    );
  }

  if (!event)
    return (
      <div className="p-6 text-center text-red-500">❌ Event not found.</div>
    );

  const deadlinePassed = new Date(event.registration_deadline) < new Date();

  return (
    <motion.div
      className="px-4 py-10 max-w-6xl w-[90%] mx-auto min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col lg:flex-row gap-10">
        {/* LEFT COLUMN */}
        <motion.div
          className="flex flex-col gap-6 flex-1"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-4xl font-extrabold text-blue-700 mb-3">
              {event.title}
            </h1>
            <p className="text-gray-600 text-sm mb-1">
              📅 {event.date} ⏰ {event.time}
            </p>
            <p className="text-gray-600 text-sm mb-4">📍 Venue: {event.venue}</p>
            <p className="text-gray-700 text-base leading-relaxed mb-6">
              {event.description}
            </p>

            {deadlinePassed ? (
              <button
                className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold cursor-not-allowed shadow"
                disabled
              >
                ❌ Registration Closed
              </button>
            ) : isRegistered ? (
              <button
                className="bg-gray-400 text-white px-6 py-2 rounded-full font-semibold cursor-not-allowed shadow"
                disabled
              >
                ✅ Already Registered
              </button>
            ) : (
              <motion.button
                onClick={handleRegister}
                className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-blue-700 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Register for Event
              </motion.button>
            )}
          </div>

          <motion.div
            className="overflow-hidden rounded-lg shadow-lg"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <img
              src={event.image}
              alt={event.title}
              className="w-full object-cover max-h-[350px] rounded-md"
            />
          </motion.div>
        </motion.div>

        {/* RIGHT COLUMN */}
        <motion.div
          className="flex flex-col gap-6 flex-1"
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Rules */}
          <div className="bg-white border-l-4 border-blue-500 p-6 rounded-md shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">🧾 Rules</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm">
              {Array.isArray(event.rules) && event.rules.length > 0 ? (
                event.rules.map((rule, idx) => <li key={idx}>{rule}</li>)
              ) : (
                <li>No rules provided.</li>
              )}
            </ul>
          </div>

          {/* Instructions */}
          <div className="bg-white border-l-4 border-purple-500 p-6 rounded-md shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-purple-600">📌 Instructions</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm">
              {Array.isArray(event.instructions) &&
              event.instructions.length > 0 ? (
                event.instructions.map((inst, idx) => <li key={idx}>{inst}</li>)
              ) : (
                <li>No instructions provided.</li>
              )}
            </ul>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EventDetails;
