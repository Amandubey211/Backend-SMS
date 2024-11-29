import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  assignStudentToSection, // Using the assignStudentToSection thunk
  fetchSectionsByClass,
} from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import profileIcon from "../../../../Assets/DashboardAssets/profileIcon.png";

const MoveToSection = ({ student, onClose }) => {
  const [selectedSection, setSelectedSection] = useState("");
  const AllSections = useSelector(
    (store) => store.admin.group_section.sectionsList
  );
  const { cid } = useParams();
  const dispatch = useDispatch();

  // Extracting data from the student prop
  const { _id: studentId, firstName, profile, sectionName } = student;

  // Preload the sectionId if the student already has a section
  useEffect(() => {
    if (AllSections?.length === 0) dispatch(fetchSectionsByClass(cid));

    // If the student already has a section assigned, preload it in the dropdown
    const sectionToPreload = AllSections.find(
      (sec) => sec.sectionName === sectionName
    );
    if (sectionToPreload) {
      setSelectedSection(sectionToPreload._id);
    }
  }, [cid, dispatch, sectionName, AllSections]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSection) {
      toast.error("Please select a section.");
      return;
    }

    try {
      await dispatch(
        assignStudentToSection({ studentId, sectionId: selectedSection })
      );
      toast.success("Student moved to section successfully!");
      onClose();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <form className="flex flex-col h-full" onSubmit={handleSubmit}>
      <div className="bg-white rounded-lg p-4 w-full max-w-md">
        <div className="flex items-center">
          <img
            src={profile || profileIcon}
            alt={firstName}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <div className="text-sm font-medium">{firstName}</div>
            <div className="text-xs text-gray-500">
              {sectionName || "No Section Assigned"}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Section
        </label>
        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-lg"
        >
          <option value="">Select Section</option>
          {AllSections?.map((section) => (
            <option key={section._id} value={section._id}>
              {section.sectionName}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-auto mb-8">
        <button
          type="submit"
          className={`w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md ${
            !selectedSection ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!selectedSection}
        >
          {selectedSection ? "Move Student" : "Select Section"}
        </button>
      </div>
    </form>
  );
};

export default MoveToSection;
