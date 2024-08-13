import React, { useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import useAssignStudentToGroup from "../../../../Hooks/AuthHooks/Staff/Admin/Students/useAssignStudentToGroup ";

const AssignStudent = ({
  name,
  imageUrl,
  section,
  studentId,
  onAssignmentComplete,
}) => {
  const [sectionId, setSectionId] = useState("");
  const [groupId, setGroupId] = useState("");
  const AllSections = useSelector((store) => store.Class.sectionsList);
  // const AllGroups = useSelector((store) => store.Class.groupsList);
  const AllGroups = useSelector((store) => store.Class.class.groups);
  console.log(AllGroups);
  const { assignStudentToGroup, assignStudentToSection, error, loading } =
    useAssignStudentToGroup();

  const handleSectionChange = (e) => {
    setSectionId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupId) {
      toast.error("Please select a group.");
      return;
    }
    if (!sectionId) {
      toast.error("Please select a section.");
      return;
    }
    try {
      await assignStudentToSection(studentId, sectionId);
      await assignStudentToGroup(studentId, groupId);
      toast.success("Student assigned to group successfully!");

      if (onAssignmentComplete) {
        onAssignmentComplete();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form className="flex flex-col h-full" onSubmit={handleSubmit}>
      <div className="bg-white rounded-lg p-4 w-full max-w-md">
        <div className="flex items-center">
          <img
            src={imageUrl}
            alt={name}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <div className="text-sm font-medium">{name}</div>
            <div className="text-xs text-gray-500">
              {section || "No Section Assigned"}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Section
        </label>
        <select
          value={sectionId}
          onChange={handleSectionChange}
          className="block w-full p-2 border border-gray-300 rounded-lg"
          disabled={loading}
        >
          <option value="">All Sections</option>
          {AllSections?.map((section) => (
            <option key={section._id} value={section._id}>
              {section.sectionName}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Group
        </label>
        <select
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-lg"
          disabled={loading}
        >
          <option value="">Choose Group</option>
          {AllGroups?.map((group) => (
            <option key={group?._id} value={group?._id}>
              {group?.groupName}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-auto mb-8">
        <button
          type="submit"
          className={`w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md ${
            loading
              ? "opacity-50 cursor-not-allowed"
              : "hover:from-pink-600 hover:to-purple-600"
          }`}
          disabled={loading}
        >
          {loading ? "Assigning..." : "Assign Student"}
        </button>
      </div>
      {error && <p className="text-red-500 text-center">{error}</p>}
    </form>
  );
};

export default AssignStudent;
