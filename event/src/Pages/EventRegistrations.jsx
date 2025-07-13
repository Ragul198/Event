import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";

const EventRegistrations = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setErrorMsg("Invalid event ID.");
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
        return;
      }
      setEvent(eventData);

      const { data, error } = await supabase.rpc("get_event_participants_view");
      if (error) {
        console.error("❌ Participant fetch error:", error);
        setErrorMsg("You are not authorized to view this data.");
        return;
      }

      const filtered = data.filter((p) => p.event_id === id);
      setParticipants(filtered);
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

  if (!event) {
    return <div className="p-6 text-center text-red-500">{errorMsg || "Loading..."}</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Link to="/dashboard" className="text-blue-600 underline text-sm mb-4 inline-block">
        ← Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold mb-6">📋 {event.title} - Registered Students</h1>

      {participants.length === 0 ? (
        <p className="text-gray-500">No students have registered for this event.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-collapse bg-white shadow rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Email</th>
                <th className="border px-4 py-2 text-left">Mobile</th>
                <th className="border px-4 py-2 text-left">Year</th>
                <th className="border px-4 py-2 text-left">Department</th>
                <th className="border px-4 py-2 text-left">Gender</th>
                <th className="border px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p, index) => (
                <tr key={p.registration_id || `row-${index}`}>
                  <td className="border px-4 py-2">{p.name}</td>
                  <td className="border px-4 py-2">{p.email}</td>
                  <td className="border px-4 py-2">{p.mobile}</td>
                  <td className="border px-4 py-2">{p.year}</td>
                  <td className="border px-4 py-2">{p.department}</td>
                  <td className="border px-4 py-2">{p.gender}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleDelete(p.registration_id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
