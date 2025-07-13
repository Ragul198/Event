import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";

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

      // Get all registrations for current user with joined event info
      const { data, error } = await supabase
        .from("registrations")
        .select("event:events(*)")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching registrations:", error.message);
        return;
      }
      console.log("Fetched registrations:", data);
      const events = data.map((item) => item.event);
      setRegisteredEvents(events);
      setLoading(false);
    };

    fetchMyEvents();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading your events...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">🎫 My Registered Events</h1>

      {registeredEvents.length === 0 ? (
        <p className="text-center text-gray-500">You have not registered for any events yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {registeredEvents.map((event) => (
            <div key={event.id} className="bg-white shadow rounded p-4">
              <img
                src={event.image}
                alt={event.title}
                className="h-40 w-full object-cover mb-3 rounded"
              />
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p className="text-sm text-gray-600">
                {event.date} at {event.time}
              </p>
              <p className="text-sm text-gray-500">{event.venue}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEvents;
