import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  assignTeacher,
  editTeacher,
  fetchAllTeachers,
} from "../../../Store/Slices/Admin/Class/Teachers/teacherThunks";
import { fetchSubjects } from "../../../Store/Slices/Admin/Class/Subject/subjectThunks";

const AssignTeacher = ({ editingTeacher, closeSidebar }) => {
  const { t } = useTranslation("admClass");
  const dispatch = useDispatch();
  const { cid } = useParams();

  // Local state for form fields
  const [teacherId, setTeacherId] = useState(
    editingTeacher ? editingTeacher._id : ""
  );
  const [subjectId, setSubjectId] = useState(
    (editingTeacher && editingTeacher.subjects?.[0]?._id) || ""
  );
  const [sectionId, setSectionId] = useState(
    (editingTeacher && editingTeacher.sectionId?.[0]?._id) || ""
  );

  // Error states for validation
  const [teacherError, setTeacherError] = useState("");
  const [subjectError, setSubjectError] = useState("");
  const [sectionError, setSectionError] = useState("");

  // Refs for select fields
  const teacherRef = useRef(null);
  const subjectRef = useRef(null);
  const sectionRef = useRef(null);

  // Data from Redux store
  const allTeachers = useSelector((state) => state.admin.teacher.allTeachers);
  const allSubjects = useSelector((state) => state.admin.subject.subjects);
  const allSections = useSelector(
    (state) => state.admin.group_section.sectionsList
  );
  const loading = useSelector((state) => state.admin.teacher.loading);

  // Fetch teachers and subjects on mount
  useEffect(() => {
    dispatch(fetchAllTeachers());
    dispatch(fetchSubjects(cid));
  }, [dispatch, cid]);

  // Update local state when editingTeacher changes
  useEffect(() => {
    if (editingTeacher) {
      setTeacherId(editingTeacher._id);
      setSubjectId(editingTeacher.subjects?.[0]?._id || "");
      setSectionId(editingTeacher.sectionId?.[0]?._id || "");
    } else {
      setTeacherId("");
      setSubjectId("");
      setSectionId("");
    }
  }, [editingTeacher]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setTeacherError("");
    setSubjectError("");
    setSectionError("");

    // Validate required fields
    let isValid = true;
    if (!teacherId) {
      setTeacherError(t("Teacher is required"));
      teacherRef.current.focus();
      isValid = false;
    }
    if (!subjectId) {
      setSubjectError(t("Subject is required"));
      if (isValid) {
        subjectRef.current.focus();
      }
      isValid = false;
    }
    if (!sectionId) {
      setSectionError(t("Section is required"));
      if (isValid) {
        sectionRef.current.focus();
      }
      isValid = false;
    }
    if (!isValid) {
      return; // Do not make the API call
    }

    try {
      if (editingTeacher) {
        // Data structure based on backend expectations for editing
        const editData = {
          id: editingTeacher._id,
          subjects: [{ _id: subjectId }],
          classIds: [{ _id: cid }],
          sectionIds: [{ _id: sectionId }],
        };
        await dispatch(editTeacher(editData)).unwrap();
      } else {
        const assignData = {
          classId: cid,
          teacherId,
          sectionId,
          subjectId,
        };
        await dispatch(assignTeacher(assignData)).unwrap();
      }
      // Only close sidebar on success
      closeSidebar();
    } catch (error) {
      // If there is an error, do not close the sidebar.
      // Optionally, you can set a general error message here.
    }
  };

  // Common select box classes with conditional red outline
  const selectBoxClasses =
    "block w-full p-3 border rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition ease-in-out duration-150 text-gray-800";

  return (
    <form className="flex flex-col h-full" onSubmit={handleSubmit}>
      <div className="bg-white rounded-lg p-4 w-full max-w-md">
        {/* Teacher Select */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("Teacher Name")} <span className="text-red-500">*</span>
          </label>
          <select
            ref={teacherRef}
            value={teacherId}
            onChange={(e) => {
              setTeacherId(e.target.value);
              if (e.target.value) setTeacherError("");
            }}
            className={`${selectBoxClasses} ${
              teacherError ? "border-red-500" : "border-gray-300"
            }`}
            disabled={loading || Boolean(editingTeacher)}
          >
            <option value="">{t("Choose")}</option>
            {allTeachers?.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.firstName} {teacher.lastName}
              </option>
            ))}
          </select>
          {teacherError && (
            <p className="text-red-500 text-sm mt-1">{teacherError}</p>
          )}
        </div>

        {/* Subject Select */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("Subject")} <span className="text-red-500">*</span>
          </label>
          <select
            ref={subjectRef}
            value={subjectId}
            onChange={(e) => {
              setSubjectId(e.target.value);
              if (e.target.value) setSubjectError("");
            }}
            className={`${selectBoxClasses} ${
              subjectError ? "border-red-500" : "border-gray-300"
            }`}
            disabled={loading}
          >
            <option value="">{t("Choose a subject")}</option>
            {allSubjects?.map((subject) => (
              <option key={subject?.subjectId} value={subject?.subjectId}>
                {subject.subjectName}{" "}
                {subject.isPublished ? "" : `(${t("Unpublished")})`}
              </option>
            ))}
          </select>
          {subjectError && (
            <p className="text-red-500 text-sm mt-1">{subjectError}</p>
          )}
        </div>

        {/* Section Select */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("Section")} <span className="text-red-500">*</span>
          </label>
          <select
            ref={sectionRef}
            value={sectionId}
            onChange={(e) => {
              setSectionId(e.target.value);
              if (e.target.value) setSectionError("");
            }}
            className={`${selectBoxClasses} ${
              sectionError ? "border-red-500" : "border-gray-300"
            }`}
            disabled={loading}
          >
            <option value="">{t("Choose")}</option>
            {allSections?.map((section) => (
              <option key={section._id} value={section._id}>
                {section.sectionName}
              </option>
            ))}
          </select>
          {sectionError && (
            <p className="text-red-500 text-sm mt-1">{sectionError}</p>
          )}
        </div>
      </div>

      <div className="mt-auto mb-8">
        <button
          type="submit"
          className={`w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading
            ? editingTeacher
              ? t("Updating...")
              : t("Processing...")
            : editingTeacher
            ? t("Update Instructor")
            : t("Add New Instructor")}
        </button>
      </div>
    </form>
  );
};

export default AssignTeacher;
