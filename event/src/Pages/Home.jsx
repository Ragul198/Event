// pages/Home.jsx
import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import { supabase } from "../supabase/client"; // ✅ Import Supabase client

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
        .gte("registration_deadline", nowISO) // ✅ Only upcoming
        .order("registration_deadline", { ascending: true }); // Optional
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
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">🎉 Upcoming Events</h1>

      {loading ? (
        <p className="text-center text-gray-400">Loading events...</p>
      ) : eventList.length === 0 ? (
        <p className="text-center text-gray-500">No upcoming events available.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventList.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
