import { useEffect, useState, Suspense, lazy } from "react";
import { Loader2 } from "lucide-react"; // Optional: Lucide icon loader (or use your own spinner)

const EventStats = lazy(() => import("../components/EventStats"));
const ManageEvents = lazy(() => import("../components/ManageEvents"));
const Students = lazy(() => import("../components/Students"));

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("stats");

  const renderTabContent = () => {
    switch (activeTab) {
      case "stats":
        return <EventStats />;
      case "manage":
        return <ManageEvents />;
      case "students":
        return <Students />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white p-6 space-y-4 shadow-md">
        <h2 className="text-2xl font-extrabold mb-8 tracking-wide">🎯 Admin Panel</h2>
        {["stats", "manage", "students"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 font-medium hover:bg-gray-700 ${
              activeTab === tab ? "bg-gray-700" : "bg-gray-800"
            }`}
          >
            {tab === "stats" && "📊 Event Stats"}
            {tab === "manage" && "⚙️ Manage Events"}
            {tab === "students" && "👨‍🎓 Students"}
          </button>
        ))}
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center h-full text-gray-500 animate-pulse">
              <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-4" />
              <p className="text-lg font-medium">Loading dashboard content...</p>
            </div>
          }
        >
          {renderTabContent()}
        </Suspense>
      </main>
    </div>
  );
};

export default AdminDashboard;
