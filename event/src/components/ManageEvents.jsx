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

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(localStorage.getItem("previewImage") || null);
  const [eventList, setEventList] = useState([]);
  const [formMode, setFormMode] = useState("add");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchEvents = async () => {
    setPageLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });

    if (!error) setEventList(data);
    setPageLoading(false);
  };

  useEffect(() => {
    fetchEvents();
    return () => {
      localStorage.removeItem("previewImage");
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    setImageFile(null);
    setPreviewUrl(null);
    localStorage.removeItem("previewImage");
    setFormMode("add");
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
      localStorage.setItem("previewImage", preview);
    }
  };

  const cancelImageUpload = () => {
    setImageFile(null);
    setPreviewUrl(null);
    localStorage.removeItem("previewImage");
  };

  const uploadImageIfNeeded = async () => {
    if (!imageFile) return form.image;

    setUploadingImage(true);
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from("event-images")
      .upload(filePath, imageFile);

    if (error) {
      alert("❌ Failed to upload image.");
      console.error(error.message);
      setUploadingImage(false);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from("event-images")
      .getPublicUrl(filePath);

    setUploadingImage(false);
    return publicUrlData?.publicUrl || null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || uploadingImage) return;

    setLoading(true);

    const {
      title,
      date,
      time,
      venue,
      description,
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

    const uploadedImageUrl = await uploadImageIfNeeded();
    if (!uploadedImageUrl) {
      setLoading(false);
      return;
    }

    const newEventData = {
      title,
      date,
      time,
      venue,
      description,
      image: uploadedImageUrl,
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
    setImageFile(null);
    setPreviewUrl(null);
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

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-white to-blue-50">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-700 mb-8 text-center">📅 Event Manager</h1>

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {formMode === "edit" ? "✏️ Edit Event" : "🛠️ Add New Event"}
          </h2>

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Event Title"
            className="w-full p-3 border rounded"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <input type="date" name="date" value={form.date} onChange={handleChange} className="p-3 border rounded" required />
            <input type="time" name="time" value={form.time} onChange={handleChange} className="p-3 border rounded" required />
          </div>

          <input name="venue" value={form.venue} onChange={handleChange} placeholder="Venue" className="w-full p-3 border rounded" />

          {/* Image Upload */}
          <input type="file" accept="image/*" onChange={handleFileSelect} className="w-full p-3 border rounded" disabled={uploadingImage} />
          {previewUrl && (
            <div className="relative mt-2">
              <img src={previewUrl} alt="Preview" className="w-full h-40 object-cover rounded border" />
              <button
                onClick={cancelImageUpload}
                type="button"
                className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 rounded text-xs"
              >
                Cancel
              </button>
            </div>
          )}

          <input
            type="datetime-local"
            name="registration_deadline"
            value={form.registration_deadline}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Event Description" className="w-full p-3 border rounded" rows={4} />
          <textarea name="rules" value={form.rules} onChange={handleChange} placeholder="Rules (one per line)" className="w-full p-3 border rounded" rows={3} />
          <textarea name="instructions" value={form.instructions} onChange={handleChange} placeholder="Instructions (one per line)" className="w-full p-3 border rounded" rows={3} />

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className={`px-5 py-2 text-white font-semibold rounded ${
                loading || uploadingImage ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading || uploadingImage
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
                className="bg-gray-400 text-white px-5 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Event list */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">📋 All Events</h2>

          {pageLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventList.map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition">
                  <h3 className="text-lg font-semibold text-blue-700">{event.title}</h3>
                  <p className="text-sm">{event.date} @ {event.time}</p>
                  <p className="text-sm text-gray-500">📍 {event.venue}</p>
                  <p className="text-sm text-red-500 mt-1">🕑 Deadline: {new Date(event.registration_deadline).toLocaleDateString("en-IN")}</p>
                  <div className="flex gap-3 mt-3">
                    <button onClick={() => handleEdit(event)} className="text-blue-600 font-medium hover:underline">Edit</button>
                    <button onClick={() => handleDelete(event.id)} className="text-red-600 font-medium hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageEvents;
