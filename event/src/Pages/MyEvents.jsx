import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { motion } from "framer-motion";

const MyEvents = () => {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyEvents = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (!user) {
        alert("⚠️ You must be logged in to view your events.");
        return;
      }

      const { data, error } = await supabase
        .from("registrations")
        .select("event:events(*)")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching registrations:", error.message);
        return;
      }

      const events = data.map((item) => item.event);
      setRegisteredEvents(events);
      setLoading(false);
    };

    fetchMyEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-indigo-100">
        <div className="text-xl font-semibold text-gray-700 animate-pulse">
          🎟️ Loading your events...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-800">
            🎫 My Registered Events
          </h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            View all events you’ve registered for at{" "}
            <span className="font-semibold text-blue-600">
              RGL College of Engineering
            </span>
          </p>
        </div>

        {registeredEvents.length === 0 ? (
          <div className="text-center text-gray-500 text-lg mt-20">
            You have not registered for any events yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {registeredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden transform hover:scale-105 transition duration-300"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-bold text-indigo-700">
                    {event.title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    📅 {event.date} at {event.time}
                  </p>
                  <p className="text-sm text-gray-500">📍 {event.venue}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEvents;
