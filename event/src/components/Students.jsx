import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { Loader2 } from "lucide-react"; // if you're using lucide or you can use any spinner icon

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("students").select("*");
      if (error) {
        console.error("❌ Error fetching students:", error.message);
      } else {
        setStudents(data);
        setFiltered(data);
      }
      setLoading(false);
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    let result = [...students];

    if (search.trim()) {
      const searchLower = search.toLowerCase();
      result = result.filter((s) =>
        `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchLower) ||
        s.email.toLowerCase().includes(searchLower)
      );
    }

    if (yearFilter !== "all") {
      result = result.filter((s) => s.year?.toString() === yearFilter);
    }

    if (deptFilter !== "all") {
      result = result.filter((s) => s.department?.toLowerCase() === deptFilter.toLowerCase());
    }

    if (genderFilter !== "all") {
      result = result.filter((s) => s.gender?.toLowerCase() === genderFilter.toLowerCase());
    }

    setFiltered(result);
  }, [search, yearFilter, deptFilter, genderFilter, students]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
          <p className="text-lg font-medium text-gray-600">Fetching student data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6 text-blue-700">👨‍🎓 Student Directory</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by name or email"
          className="border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="all">All Years</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>

        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="all">All Departments</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="MECH">MECH</option>
          <option value="CIVIL">CIVIL</option>
          <option value="IT">IT</option>
        </select>

        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          className="border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="all">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              {["First Name", "Last Name", "Gender", "Department", "Year", "Email"].map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-sm font-semibold text-blue-700"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length > 0 ? (
              filtered.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-blue-50 transition duration-150"
                >
                  <td className="px-4 py-2 text-sm text-gray-700">{student.first_name}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{student.last_name}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 capitalize">{student.gender}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{student.department}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{student.year}</td>
                  <td className="px-4 py-2 text-sm text-blue-700">{student.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Students;
