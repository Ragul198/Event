import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";

const EventCard = ({ event }) => {
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const checkRegistration = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user;
      if (!user) return;

      const { data, error } = await supabase
        .from("registrations")
        .select("id")
        .eq("user_id", user.id)
        .eq("event_id", event.id)
        .maybeSingle();

      if (data) {
        setIsRegistered(true);
      }
    };

    checkRegistration();
  }, [event.id]);

  const now = new Date();
  const deadline = new Date(event.registrationDeadline);
  const isClosed = now > deadline;

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <img src={event.image} alt={event.title} className="h-40 w-full object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-bold">{event.title}</h2>
        <p className="text-sm text-gray-600">{event.date} at {event.time}</p>
        <p className="text-sm text-gray-500">{event.venue}</p>
        <p className="text-sm mt-2">{event.description.slice(0, 60)}...</p>

        <div className="mt-2 text-sm">
          {isClosed ? (
            <span className="text-red-500 font-semibold">❌ Registration Closed</span>
          ) : isRegistered ? (
            <span className="text-yellow-600 font-semibold">✅ Already Registered</span>
          ) : (
            <span className="text-green-600 font-semibold">
              ⏳ Register before {deadline.toLocaleDateString()}
            </span>
          )}
        </div>

        {!isClosed && !isRegistered && (
          <Link to={`/event/${event.id}`}>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              View & Register
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default EventCard;
