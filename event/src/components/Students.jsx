import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");

  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase.from("students").select("*");
      if (error) {
        console.error("❌ Error fetching students:", error.message);
      } else {
        setStudents(data);
        setFiltered(data);
      }
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">👨‍🎓 Student List</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or email"
          className="border p-2 w-full md:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="border p-2 w-full md:w-1/4"
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
          className="border p-2 w-full md:w-1/4"
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
          className="border p-2 w-full md:w-1/4"
        >
          <option value="all">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">First Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Last Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Gender</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Department</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Year</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length > 0 ? (
              filtered.map((student) => (
                <tr key={student.id}>
                  <td className="px-4 py-2 text-sm">{student.first_name}</td>
                  <td className="px-4 py-2 text-sm">{student.last_name}</td>
                  <td className="px-4 py-2 text-sm">{student.gender}</td>
                  <td className="px-4 py-2 text-sm">{student.department}</td>
                  <td className="px-4 py-2 text-sm">{student.year}</td>
                  <td className="px-4 py-2 text-sm">{student.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
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
