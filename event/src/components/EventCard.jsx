import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";

const EventCard = ({ event }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkRegistration = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const currentUser = session?.user;
      setUser(currentUser);

      if (!currentUser) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("registrations")
        .select("id")
        .eq("user_id", currentUser.id)
        .eq("event_id", event.id)
        .maybeSingle();

      if (data) setIsRegistered(true);
      setLoading(false);
    };

    checkRegistration();
  }, [event.id]);

  // Ensure correct field name
  const now = new Date();
  const deadline = new Date(event.registration_deadline); // make sure this is the correct column name
  const isClosed = now > deadline;

  // 🔥 Hide the card entirely if registration is closed
  if (isClosed) return null;

  return (
    <div className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1">
      <img
        src={event.image}
        alt={event.title}
        className="h-48 w-full object-cover transition-transform duration-300 hover:scale-105"
      />
      <div className="p-5">
        <h2 className="text-2xl font-extrabold text-blue-800 mb-1">
          {event.title}
        </h2>
        <p className="text-sm text-gray-600 mb-1">
          📅 {event.date} ⏰ {event.time}
        </p>
        <p className="text-sm text-gray-600 mb-2">📍 {event.venue}</p>
        <p className="text-gray-700 text-sm mb-4">
          {event.description.slice(0, 100)}...
        </p>

        <div className="mb-3 text-sm font-medium">
          {isRegistered ? (
            <span className="text-yellow-600">✅ Already Registered</span>
          ) : (
            <span className="text-green-600">
              ⏳ Register by{" "}
              {new Date(event.registration_deadline).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeZone: "Asia/Kolkata",
              })}
            </span>
          )}
        </div>

        {!isRegistered && (
          <Link to={`/event/${event.id}`}>
            <button className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition duration-300">
              View & Register
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default EventCard;
