import { useState } from "react";
import EventStats from "../components/EventStats";
import ManageEvents from "../components/ManageEvents";
import Students from "../components/Students"; // ✅ NEW

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("stats");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 space-y-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <button
          onClick={() => setActiveTab("stats")}
          className={`w-full text-left px-3 py-2 rounded ${activeTab === "stats" ? "bg-gray-700" : ""}`}
        >
          📊 Event Stats
        </button>
        <button
          onClick={() => setActiveTab("manage")}
          className={`w-full text-left px-3 py-2 rounded ${activeTab === "manage" ? "bg-gray-700" : ""}`}
        >
          ⚙️ Manage Events
        </button>
        <button
          onClick={() => setActiveTab("students")}
          className={`w-full text-left px-3 py-2 rounded ${activeTab === "students" ? "bg-gray-700" : ""}`}
        >
          👨‍🎓 Students
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-50">
        {activeTab === "stats" && <EventStats />}
        {activeTab === "manage" && <ManageEvents />}
        {activeTab === "students" && <Students />} {/* ✅ New tab component */}
      </main>
    </div>
  );
};

export default AdminDashboard;
