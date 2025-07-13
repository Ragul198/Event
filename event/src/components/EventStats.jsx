import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { Link } from "react-router-dom";

const EventStats = () => {
  const [stats, setStats] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase.rpc("get_event_participants_view");

      if (error) {
        console.error("❌ Error fetching admin view:", error);
        setErrorMsg("You are not authorized to view this data.");
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
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">🛠️ Admin Dashboard</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4">📊 Event Registration Stats</h2>

        {errorMsg ? (
          <div className="text-red-600 font-medium">{errorMsg}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-2 text-left">Event</th>
                  <th className="border px-3 py-2">Total</th>
                  <th className="border px-3 py-2">Male</th>
                  <th className="border px-3 py-2">Female</th>
                  <th className="border px-3 py-2">Other</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((event) => (
                  <tr key={event.id} className="border-t hover:bg-gray-50">
                    <td className="border px-3 py-2">
                      <Link
                        to={`/dashboard/event/${event.id}/registrations`}
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        {event.title}
                      </Link>
                    </td>
                    <td className="border px-3 py-2 text-center">{event.total}</td>
                    <td className="border px-3 py-2 text-center">{event.male}</td>
                    <td className="border px-3 py-2 text-center">{event.female}</td>
                    <td className="border px-3 py-2 text-center">{event.other}</td>
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
