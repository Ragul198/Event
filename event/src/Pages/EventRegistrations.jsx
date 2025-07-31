import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { Loader2 } from "lucide-react";

const EventRegistrations = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      if (!id) {
        setErrorMsg("❌ Invalid event ID.");
        setLoading(false);
        return;
      }

      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select("title")
        .eq("id", id)
        .single();

      if (eventError) {
        console.error("❌ Event load error:", eventError);
        setErrorMsg("Event not found.");
        setLoading(false);
        return;
      }

      setEvent(eventData);

      const { data, error } = await supabase.rpc("get_event_participants_view");
      if (error) {
        console.error("❌ Participant fetch error:", error);
        setErrorMsg("You are not authorized to view this data.");
        setLoading(false);
        return;
      }

      const filtered = data.filter((p) => p.event_id === id);
      setParticipants(filtered);
      setLoading(false);
    };

    loadData();
  }, [id]);

  const handleDelete = async (registrationId) => {
    const confirmed = window.confirm("Are you sure you want to remove this registration?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("registrations")
      .delete()
      .eq("id", registrationId);

    if (error) {
      console.error("❌ Failed to delete registration:", error);
      alert("Could not delete the registration.");
      return;
    }

    setParticipants((prev) => prev.filter((p) => p.registration_id !== registrationId));
    alert("✅ Registration removed successfully.");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-indigo-600">
        <Loader2 className="h-10 w-10 animate-spin mb-4" />
        <p className="text-lg font-semibold">Loading registrations...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-6 text-center text-red-600 font-medium">
        {errorMsg || "Something went wrong."}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto animate-fade-in">
      <Link
        to="/dashboard"
        className="text-indigo-600 underline text-sm mb-4 inline-block hover:text-indigo-800"
      >
        ← Back to Dashboard
      </Link>

      <h1 className="text-3xl font-extrabold mb-6 text-indigo-700">
        📋 {event.title} - Registered Students
      </h1>

      {participants.length === 0 ? (
        <div className="text-gray-500 text-center mt-10">
          😕 No students have registered for this event.
        </div>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-indigo-100 text-indigo-800 text-xs uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3">Year</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Gender</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p, index) => (
                <tr
                  key={p.registration_id || `row-${index}`}
                  className="border-t hover:bg-indigo-50 transition-colors"
                >
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="px-4 py-2">{p.email}</td>
                  <td className="px-4 py-2">{p.mobile}</td>
                  <td className="px-4 py-2">{p.year}</td>
                  <td className="px-4 py-2">{p.department}</td>
                  <td className="px-4 py-2">{p.gender}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(p.registration_id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-all"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EventRegistrations;
