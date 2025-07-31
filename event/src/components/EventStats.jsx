import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

const EventStats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);

      const { data, error } = await supabase.rpc("get_event_participants_view");

      if (error) {
        console.error("❌ Error fetching admin view:", error);
        setErrorMsg("🚫 You are not authorized to view this data.");
        setLoading(false);
        return;
      }

      const statsMap = {};
      for (const row of data) {
        const { event_id: id, event_title: title, gender } = row;

        if (!statsMap[id]) {
          statsMap[id] = {
            id,
            title,
            total: 0,
            male: 0,
            female: 0,
            other: 0,
          };
        }

        statsMap[id].total += 1;
        if (gender === "Male") statsMap[id].male += 1;
        else if (gender === "Female") statsMap[id].female += 1;
        else statsMap[id].other += 1;
      }

      setStats(Object.values(statsMap));
      setLoading(false);
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-indigo-700 tracking-tight">
        🛠️ Admin Dashboard
      </h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          📊 Event Registration Stats
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
            <span className="ml-3 text-indigo-600 font-medium">Loading stats...</span>
          </div>
        ) : errorMsg ? (
          <div className="text-red-600 font-semibold text-center">{errorMsg}</div>
        ) : stats.length === 0 ? (
          <div className="text-gray-500 text-center mt-10">
            😕 No registration data found.
          </div>
        ) : (
          <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
            <table className="w-full text-sm text-left">
              <thead className="bg-indigo-100 text-indigo-800 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3 text-center">Total</th>
                  <th className="px-4 py-3 text-center">Male</th>
                  <th className="px-4 py-3 text-center">Female</th>
                  <th className="px-4 py-3 text-center">Other</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((event) => (
                  <tr
                    key={event.id}
                    className="border-t hover:bg-indigo-50 transition-colors"
                  >
                    <td className="px-4 py-2 font-medium text-indigo-700">
                      <Link
                        to={`/dashboard/event/${event.id}/registrations`}
                        className="hover:underline hover:text-indigo-900"
                      >
                        {event.title}
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-center font-semibold">{event.total}</td>
                    <td className="px-4 py-2 text-center text-blue-600">{event.male}</td>
                    <td className="px-4 py-2 text-center text-pink-600">{event.female}</td>
                    <td className="px-4 py-2 text-center text-gray-600">{event.other}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default EventStats;
