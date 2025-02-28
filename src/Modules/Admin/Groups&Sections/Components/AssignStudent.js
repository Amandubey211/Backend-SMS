import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  assignStudentToSection,
  fetchGroupsByClass,
  fetchSectionsByClass,
  fetchUnassignedStudents,
} from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import profileIcon from "../../../../Assets/DashboardAssets/profileIcon.png";

const AssignStudent = ({ name, imageUrl, section, studentId }) => {
  const { t } = useTranslation("admClass");
  const [sectionId, setSectionId] = useState("");
  const AllSections = useSelector(
    (store) => store.admin.group_section.sectionsList
  );

  const { cid } = useParams();
  const dispatch = useDispatch();

  // Preload the sectionId if the student already has a section
  useEffect(() => {
    dispatch(fetchSectionsByClass(cid));

    // If the student already has a section assigned, preload it in the dropdown
    const sectionToPreload = AllSections.find(
      (sec) => sec.sectionName === section
    );
    if (sectionToPreload) {
      setSectionId(sectionToPreload._id);
    }
  }, [cid, dispatch, section, AllSections]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sectionId) {
      toast.error(t("Please select a section."));
      return;
    }
    try {
      await dispatch(assignStudentToSection({ studentId, sectionId }));

      dispatch(fetchUnassignedStudents(cid)); // Refetch unassigned students
      dispatch(fetchGroupsByClass(cid)); // Refetch groups after assignment
    } catch (error) {
      toast.error(error.message || t("Something went wrong"));
    }
  };

  return (
    <form className="flex flex-col h-full" onSubmit={handleSubmit}>
      <div className="bg-white rounded-lg p-4 w-full max-w-md">
        <div className="flex items-center">
          <img
            src={imageUrl || profileIcon}
            alt={name}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <div className="text-sm font-medium">{name}</div>
            <div className="text-xs text-gray-500">
              {section || t("No Section Assigned")}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("Section")}
        </label>
        <select
          value={sectionId}
          onChange={(e) => setSectionId(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-lg"
        >
          <option value="">{t("Select Section")}</option>
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
            !sectionId ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!sectionId}
        >
          {t("Assign Student")}
        </button>
      </div>
    </form>
  );
};

export default AssignStudent;
