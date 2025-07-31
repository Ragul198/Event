import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import { supabase } from "../supabase/client";
import { motion } from "framer-motion";

const Home = () => {
  const [eventList, setEventList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const nowISO = new Date().toISOString();

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .gte("registration_deadline", nowISO)
        .order("registration_deadline", { ascending: true });

      console.log("Fetched events:", data);
      if (error) {
        console.error("❌ Error fetching events:", error.message);
        setEventList([]);
      } else {
        setEventList(data);
      }

      setLoading(false);
    };

    fetchEvents();
  }, []);

  return (
    <motion.div
      className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-6">
          🎓 RGL COLLEGE OF ENGINEERING <br />
          <span className="text-2xl font-semibold text-gray-600">
            Upcoming Events
          </span>
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : eventList.length === 0 ? (
          <p className="text-center text-gray-500">No upcoming events available.</p>
        ) : (
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {eventList.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Home;
