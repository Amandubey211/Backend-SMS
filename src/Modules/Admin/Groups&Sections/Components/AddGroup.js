import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { GiImperialCrown } from "react-icons/gi";
import { FaChevronDown, FaTimes } from "react-icons/fa";
import useCreateGroup from "../../../../Hooks/AuthHooks/Staff/Admin/useCreateGroup";
import useGetStudentsByClassAndSection from "../../../../Hooks/AuthHooks/Staff/Admin/Students/useGetStudentsByClassAndSection";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const AddGroup = () => {
  const [groupName, setGroupName] = useState("");
  const [seatLimit, setSeatLimit] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [leader, setLeader] = useState(null);
  const [sectionId, setSectionId] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const AllSections = useSelector((store) => store.Class.sectionsList);
  const { createGroup, loading, error } = useCreateGroup();
  const { fetchStudentsByClassAndSection } = useGetStudentsByClassAndSection();
  const { cid } = useParams();

  useEffect(() => {
    const fetchStudents = async () => {
      if (cid) {
        const data = await fetchStudentsByClassAndSection(cid);
        setStudents(data);
      }
    };

    fetchStudents();
  }, [cid, fetchStudentsByClassAndSection]);

  const handleStudentSelect = useCallback(
    (studentId) => {
      const student = students.find((s) => s._id === studentId);
      if (student && !selectedStudents.some((s) => s._id === studentId)) {
        setSelectedStudents((prev) => [...prev, student]);
      }
      setDropdownOpen(false);
    },
    [students, selectedStudents]
  );

  const handleLeaderClick = useCallback((student) => {
    setLeader(student);
  }, []);

  const handleRemoveStudent = useCallback(
    (studentId) => {
      setSelectedStudents((prev) => prev.filter((s) => s._id !== studentId));
      if (leader && leader._id === studentId) {
        setLeader(null);
      }
    },
    [leader]
  );

  const handleRemoveLeader = useCallback(() => {
    setLeader(null);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sectionId) {
      toast.error("Please select a section.");
      return;
    }

    const formData = {
      sectionId,
      groupName,
      seatLimit,
      students: selectedStudents.map((student) => student._id),
      leader: leader ? leader._id : null,
    };

    try {
      await createGroup(formData);
      toast.success("Group Added Successfully");
    } catch (err) {
      toast.error("Failed to add group: " + err.message);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <form
      className="flex flex-col no-scrollbar h-full animate-fadeIn animate-slideIn"
      onSubmit={handleSubmit}
    >
      <div className="bg-white h-[80%] overflow-y-auto rounded-lg p-4 w-full max-w-md">
        <div className="flex flex-col space-y-4">
          <div>
            <label
              htmlFor="group-name"
              className="block text-sm font-medium text-gray-700"
            >
              Group Name
            </label>
            <input
              type="text"
              id="group-name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-300"
              placeholder="Type Here"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section
            </label>
            <select
              value={sectionId}
              onChange={(e) => setSectionId(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-lg transition duration-300"
              disabled={loading}
            >
              <option value="">Choose</option>
              {AllSections.map((section) => (
                <option key={section._id} value={section._id}>
                  {section.sectionName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="seat-limit"
              className="block text-sm font-medium text-gray-700"
            >
              Max. Number Of Students
            </label>
            <input
              type="number"
              id="seat-limit"
              value={seatLimit}
              onChange={(e) => setSeatLimit(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-300"
              placeholder="50"
              required
            />
          </div>
          <div className="relative w-full">
            <label
              htmlFor="student-selector"
              className="block text-sm font-medium text-gray-700"
            >
              Select Students
            </label>
            <div className="border border-gray-300 rounded-md p-2 flex flex-wrap">
              {selectedStudents.map((student) => (
                <div
                  key={student._id}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md px-2 py-1 m-1 flex items-center space-x-1 truncate"
                  style={{ maxWidth: "8rem" }}
                >
                  <span className="truncate">
                    {student.firstName} {student.lastName}
                  </span>
                  <button onClick={() => handleRemoveStudent(student._id)}>
                    <FaTimes className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                id="student-selector"
                onClick={toggleDropdown}
                className="ml-auto flex items-center px-2 py-1"
              >
                <FaChevronDown className="w-4 h-4" />
              </button>
            </div>
            {isDropdownOpen && (
              <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
                {students.map((student) => (
                  <button
                    key={student._id}
                    onClick={() => handleStudentSelect(student._id)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    {student.firstName} {student.lastName}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name Of Team Leader (Optional)
            </label>
            {leader && (
              <div className="flex items-center space-x-2 px-3 bg-gradient-to-r rounded-lg text-white from-pink-500 to-purple-500 transition duration-300">
                <GiImperialCrown className="text-yellow-400 text-xl" />
                <span className="py-1 rounded-lg">
                  {leader.firstName} {leader.lastName}
                </span>
                <button
                  onClick={handleRemoveLeader}
                  className="p-1 text-xl font-bold"
                >
                  &times;
                </button>
              </div>
            )}
            <div className="flex flex-wrap mt-2">
              {selectedStudents.map((student) => (
                <div
                  key={student._id}
                  className={`px-2 py-1 rounded-lg mr-2 mb-2 cursor-pointer bg-gray-100 transition duration-300 ${
                    leader && leader._id === student._id
                      ? "border border-pink-500"
                      : ""
                  }`}
                  onClick={() => handleLeaderClick(student)}
                >
                  {student.firstName} {student.lastName}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-auto mb-8">
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600 transition duration-300 transform"
          disabled={loading}
        >
          {loading ? "Creating..." : "Add New Group"}
        </button>
      </div>
      {error && <p className="text-red-500 text-center">{error}</p>}
    </form>
  );
};

export default AddGroup;
