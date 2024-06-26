import React, { useEffect, useState } from "react";
import useGetUnassignedStudents from "../../../../Hooks/AuthHooks/Staff/Admin/Students/useGetUnassignedStudents";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import { PiPlusLight } from "react-icons/pi";
const UnAssignedStudentList = () => {
  const [unassigned, setUnassignedStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { fetchUnassignedStudents, loading, error } =
    useGetUnassignedStudents();
  const { cid } = useParams();

  useEffect(() => {
    const fetchStudents = async () => {
      const data = await fetchUnassignedStudents(cid);
      setUnassignedStudents(data);
    };

    fetchStudents();
  }, [cid, fetchUnassignedStudents]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredStudents = unassigned.filter((student) =>
    student.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    toast.error(error);
    return <div>Failed to load students</div>;
  }

  return (
    <div className="w-80  p-4 bg-white   border-r">
      <div className="mb-4">
        <h2 className="text-md font-semibold">
          Unassigned Students{" "}
          <span className="text-gray-500">({filteredStudents.length})</span>
        </h2>
        <input
          type="text"
          placeholder="Search Student"
          value={searchQuery}
          onChange={handleSearch}
          className="mt-2 w-full px-3 py-2 border rounded-full"
        />
      </div>
      <ul>
        {filteredStudents?.map((student, index) => (
          <li key={index} className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <img
                src={`https://randomuser.me/api/portraits/med/${
                  index % 2 === 0 ? "women" : "men"
                }/${index}.jpg`}
                alt={student.firstName}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <div className="text-sm font-medium">{student?.firstName}</div>
                <div className="text-xs text-gray-500">
                  {student?.section || "Section A"}
                </div>
              </div>
            </div>
            <button className=" text-center rounded-full border font-semibold text-xl p-1">
              <PiPlusLight className="text-green-600" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UnAssignedStudentList;
