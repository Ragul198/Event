import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const loadEventAndCheck = async () => {
      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (eventError) {
        console.error("Event fetch error:", eventError.message);
        return;
      }

      setEvent(eventData);
      console.log("Fetched event:", eventData);

      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) return;

      const { data } = await supabase
        .from("registrations")
        .select("id")
        .eq("user_id", user.id)
        .eq("event_id", id)
        .maybeSingle();

      if (data) setIsRegistered(true);
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

  if (!event)
    return (
      <div className="p-6 text-center text-red-500">❌ Event not found.</div>
    );

  const deadlinePassed = new Date(event.registration_deadline) < new Date();

  return (
    <div className="px-4 py-8 max-w-6xl w-[90%] mx-auto min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-6 flex-1">
          {/* Event Info & Register Button */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
            <p className="text-gray-600">
              {event.date} at {event.time}
            </p>
            <p className="text-gray-600 mb-4">Venue: {event.venue}</p>
            <p className="mb-4">{event.description}</p>

            {deadlinePassed ? (
              <button
                className="bg-red-500 text-white px-4 py-2 rounded cursor-not-allowed"
                disabled
              >
                ❌ Registration Closed
              </button>
            ) : isRegistered ? (
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
                disabled
              >
                ✅ Already Registered
              </button>
            ) : (
              <button
                onClick={handleRegister}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Register for Event
              </button>
            )}
          </div>

          {/* Event Image */}
          <div>
            <img
              src={event.image}
              alt={event.title}
              className="w-full rounded-md object-cover max-h-[350px]"
            />
          </div>
        </div>

        {/* RIGHT COLUMN - Rules & Instructions Split */}
        <div className="flex flex-col gap-6 flex-1">
          {/* Rules */}
          <div className="bg-gray-100 p-6 rounded-md">
            <h2 className="text-xl font-semibold mb-4">🧾 Rules</h2>
            <ul className="list-disc list-inside text-gray-700 text-sm space-y-2">
              {Array.isArray(event.rules) && event.rules.length > 0 ? (
                event.rules.map((rule, idx) => <li key={idx}>{rule}</li>)
              ) : (
                <li>No rules provided.</li>
              )}
            </ul>
          </div>

          {/* Instructions */}
          <div className="bg-gray-100 p-6 rounded-md">
            <h2 className="text-xl font-semibold mb-4">📌 Instructions</h2>
            <ul className="list-disc list-inside text-gray-700 text-sm space-y-2">
              {Array.isArray(event.instructions) && event.instructions.length > 0 ? (
                event.instructions.map((inst, idx) => <li key={idx}>{inst}</li>)
              ) : (
                <li>No instructions provided.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
