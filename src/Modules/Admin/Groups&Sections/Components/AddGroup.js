import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import useCreateGroup from "../../../../Hooks/AuthHooks/Staff/Admin/useCreateGroup";
import { useSelector } from "react-redux";
import useGetStudentsByClassAndSection from "../../../../Hooks/AuthHooks/Staff/Admin/Students/useGetStudentsByClassAndSection";

const AddGroup = () => {
  const [groupTitle, setGroupTitle] = useState("");
  const [limitStudent, setLimitStudent] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [teamLeader, setTeamLeader] = useState("");
  const [sectionId, setSectionId] = useState("");
  const AllSections = useSelector((store) => store.Class.sectionsList);

  const { createGroup, loading, error } = useCreateGroup();
  const { fetchStudentsByClassAndSection } = useGetStudentsByClassAndSection();

  useEffect(() => {
    const fetchStudents = async () => {
      // implement the initial state with classId
      if (sectionId) {
        const data = await fetchStudentsByClassAndSection(sectionId);
        setStudents(data);
      }
    };
    fetchStudents();
  }, [sectionId, fetchStudentsByClassAndSection]);

  const handleStudentSelect = useCallback(
    (e) => {
      const selectedStudent = e.target.value;
      if (selectedStudent && !selectedStudents.includes(selectedStudent)) {
        setSelectedStudents((prev) => [...prev, selectedStudent]);
      }
    },
    [selectedStudents]
  );

  const handleTeamLeaderClick = useCallback((student) => {
    setTeamLeader(student);
  }, []);

  const handleRemoveStudent = useCallback((student) => {
    setSelectedStudents((prev) => prev.filter((s) => s !== student));
  }, []);

  const handleRemoveTeamLeader = useCallback(() => {
    setTeamLeader("");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      groupName: groupTitle,
      seatLimit: limitStudent,
      sectionId,
      students: selectedStudents,
      teamLeader,
    };

    try {
      await createGroup(formData);
      toast.success("Group Added");
    } catch (err) {
      toast.error("Failed to add group");
    }
  };

  return (
    <form className="flex flex-col h-full" onSubmit={handleSubmit}>
      <div className="bg-white h-[80%] no-scrollbar overflow-y-scroll rounded-lg p-4 w-full max-w-md">
        <div className="flex flex-col space-y-4">
          <div>
            <label
              htmlFor="group-title"
              className="block text-sm font-medium text-gray-700"
            >
              Group Title
            </label>
            <input
              type="text"
              id="group-title"
              value={groupTitle}
              onChange={(e) => setGroupTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Type Here"
              required
            />
          </div>
          <div className="">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section
            </label>
            <select
              value={sectionId}
              onChange={(e) => setSectionId(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-lg"
              disabled={loading}
            >
              <option value="">Choose</option>
              {AllSections?.map((section) => (
                <option key={section._id} value={section._id}>
                  {section.sectionName}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="limit-student"
              className="block text-sm font-medium text-gray-700"
            >
              Max. Number Of Students
            </label>
            <input
              type="number"
              id="limit-student"
              value={limitStudent}
              onChange={(e) => setLimitStudent(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="50"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name Of Students
            </label>
            <select
              onChange={handleStudentSelect}
              className="block w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select a student</option>
              {students?.map((student, index) => (
                <option key={index} value={student}>
                  {student.firstName} {student.lastName}
                </option>
              ))}
            </select>
            <div className="flex flex-wrap mt-2">
              {selectedStudents.map((student, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 py-1 rounded-full mr-2 mb-2 flex items-center"
                >
                  {student}
                  <span
                    className="ml-2 cursor-pointer"
                    onClick={() => handleRemoveStudent(student)}
                  >
                    &times;
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name Of Team Leader (Optional)
            </label>
            {teamLeader && (
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 py-1 rounded-full mr-2 mb-2 flex items-center">
                {teamLeader}
                <span
                  className="ml-2 cursor-pointer"
                  onClick={handleRemoveTeamLeader}
                >
                  &times;
                </span>
              </div>
            )}
            <div className="flex flex-wrap mt-2">
              {selectedStudents.map((student, index) => (
                <div
                  key={index}
                  className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full mr-2 mb-2 cursor-pointer"
                  onClick={() => handleTeamLeaderClick(student)}
                >
                  {student}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-auto mb-8">
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
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
