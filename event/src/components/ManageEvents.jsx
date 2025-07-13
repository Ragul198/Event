import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";

const ManageEvents = () => {
  const [form, setForm] = useState({
    id: null,
    title: "",
    date: "",
    time: "",
    venue: "",
    description: "",
    image: "",
    registration_deadline: "",
    rules: "",
    instructions: "",
  });

  const [eventList, setEventList] = useState([]);
  const [formMode, setFormMode] = useState("add");
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      console.error("Error fetching events:", error.message);
    } else {
      setEventList(data);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const {
      title,
      date,
      time,
      venue,
      description,
      image,
      registration_deadline,
      rules,
      instructions,
    } = form;

    if (!registration_deadline) {
      alert("⚠️ Please set a registration deadline.");
      setLoading(false);
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;
    if (!user) {
      alert("⚠️ You must be logged in.");
      setLoading(false);
      return;
    }

    const newEventData = {
      title,
      date,
      time,
      venue,
      description,
      image,
      registration_deadline,
      rules: rules.split("\n").filter((r) => r.trim() !== ""),
      instructions: instructions.split("\n").filter((i) => i.trim() !== ""),
    };

    if (formMode === "add") {
      const { error } = await supabase.from("events").insert([newEventData]);
      if (error) {
        alert("❌ Failed to create event.");
        console.error(error.message);
      } else {
        alert("✅ Event created!");
        fetchEvents();
        resetForm();
      }
    } else if (formMode === "edit" && form.id) {
      const confirmUpdate = confirm("⚠️ Are you sure you want to update this event?");
      if (!confirmUpdate) {
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from("events")
        .update(newEventData)
        .eq("id", form.id);
      if (error) {
        alert("❌ Failed to update event.");
        console.error(error.message);
      } else {
        alert("✅ Event updated!");
        fetchEvents();
        resetForm();
      }
    }

    setLoading(false);
  };

  const handleEdit = (event) => {
    setForm({
      ...event,
      rules: Array.isArray(event.rules) ? event.rules.join("\n") : event.rules || "",
      instructions: Array.isArray(event.instructions) ? event.instructions.join("\n") : event.instructions || "",
    });
    setFormMode("edit");
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm("🗑️ Are you sure you want to delete this event?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) {
      alert("❌ Failed to delete.");
      console.error(error.message);
    } else {
      alert("✅ Event deleted.");
      fetchEvents();
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      title: "",
      date: "",
      time: "",
      venue: "",
      description: "",
      image: "",
      registration_deadline: "",
      rules: "",
      instructions: "",
    });
    setFormMode("add");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">🛠️ Create / Manage Events</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full border p-2"
        />
        <input
          name="date"
          value={form.date}
          onChange={handleChange}
          placeholder="Date"
          className="w-full border p-2"
        />
        <input
          name="time"
          value={form.time}
          onChange={handleChange}
          placeholder="Time"
          className="w-full border p-2"
        />
        <input
          name="venue"
          value={form.venue}
          onChange={handleChange}
          placeholder="Venue"
          className="w-full border p-2"
        />
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="w-full border p-2"
        />
        <input
          type="datetime-local"
          name="registration_deadline"
          value={form.registration_deadline}
          onChange={handleChange}
          className="w-full border p-2"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2"
        />
        <textarea
          name="rules"
          value={form.rules}
          onChange={handleChange}
          placeholder="Rules (one per line)"
          className="w-full border p-2 h-24"
        />
        <textarea
          name="instructions"
          value={form.instructions}
          onChange={handleChange}
          placeholder="Instructions (one per line)"
          className="w-full border p-2 h-24"
        />

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading
              ? formMode === "edit"
                ? "Updating..."
                : "Creating..."
              : formMode === "edit"
              ? "Update Event"
              : "Add Event"}
          </button>

          {formMode === "edit" && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">📋 All Events</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {eventList.map((event) => (
            <div key={event.id} className="bg-white rounded shadow p-4 space-y-2">
              <h3 className="font-bold text-lg">{event.title}</h3>
              <p className="text-sm">
                {event.date} @ {event.time}
              </p>
              <p className="text-sm text-gray-500">Venue: {event.venue}</p>
              <p className="text-sm text-red-600">
                Deadline: {new Date(event.registration_deadline).toLocaleString()}
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEdit(event)}
                  className="text-blue-600 font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="text-red-600 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageEvents;
