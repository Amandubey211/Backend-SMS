import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Select } from "antd";
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
  const [teacherId, setTeacherId] = useState("");
  const [subjectIds, setSubjectIds] = useState([]);
  const [sectionIds, setSectionIds] = useState([]);

  // Error states for validation
  const [teacherError, setTeacherError] = useState("");
  const [subjectError, setSubjectError] = useState("");
  const [sectionError, setSectionError] = useState("");

  // Refs for focus control
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

  // Filter sections to only show those belonging to the current class (cid)
  const filteredSections =
    allSections?.filter((section) => section.classId === cid) || [];

  // Fetch teachers and subjects on mount
  useEffect(() => {
    dispatch(fetchAllTeachers());
    dispatch(fetchSubjects(cid));
  }, [dispatch, cid]);

  // Initialize form when editingTeacher or filteredSections changes
  useEffect(() => {
    if (editingTeacher) {
      setTeacherId(editingTeacher._id);
      setSubjectIds(
        editingTeacher.subjects
          ? editingTeacher.subjects.map((sub) => sub._id)
          : []
      );

      // Get only section IDs from the current class
      const currentClassSectionIds = filteredSections.map(
        (section) => section._id
      );
      const teacherSectionsInThisClass = editingTeacher.sectionId
        ? editingTeacher.sectionId
            .filter((sec) => currentClassSectionIds.includes(sec._id))
            .map((sec) => sec._id)
        : [];

      setSectionIds(teacherSectionsInThisClass);
    } else {
      setTeacherId("");
      setSubjectIds([]);
      setSectionIds([]);
    }
  }, [editingTeacher]); // Removed filteredSections from dependencies

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
      teacherRef.current?.focus();
      isValid = false;
    }
    if (!subjectIds || subjectIds.length === 0) {
      setSubjectError(t("Subject is required"));
      if (isValid) {
        subjectRef.current?.focus();
      }
      isValid = false;
    }
    if (!sectionIds || sectionIds.length === 0) {
      setSectionError(t("Section is required"));
      if (isValid) {
        sectionRef.current?.focus();
      }
      isValid = false;
    }
    if (!isValid) {
      return;
    }

    try {
      if (editingTeacher) {
        const editData = {
          id: editingTeacher._id,
          subjectIds: subjectIds.map((id) => id),
          classIds: [cid],
          sectionIds: sectionIds.map((id) => id),
        };
        await dispatch(editTeacher(editData)).unwrap();
      } else {
        const assignData = {
          classId: cid,
          teacherId,
          subjectIds,
          sectionIds,
        };
        await dispatch(assignTeacher(assignData)).unwrap();
      }
      closeSidebar();
    } catch (error) {
      // Handle error
    }
  };

  const selectBoxStyle = { width: "100%" };

  return (
    <form className="flex flex-col h-full" onSubmit={handleSubmit}>
      <div className="bg-white rounded-lg p-4 w-full max-w-md">
        {/* Teacher Select */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("Teacher Name")} <span className="text-red-500">*</span>
          </label>
          <Select
            ref={teacherRef}
            value={teacherId}
            onChange={(value) => {
              setTeacherId(value);
              if (value) setTeacherError("");
            }}
            placeholder={t("Choose")}
            disabled={loading || Boolean(editingTeacher)}
            style={selectBoxStyle}
          >
            {allTeachers?.map((teacher) => (
              <Select.Option key={teacher._id} value={teacher._id}>
                {teacher.firstName} {teacher.lastName}
              </Select.Option>
            ))}
          </Select>
          {teacherError && (
            <p className="text-red-500 text-sm mt-1">{teacherError}</p>
          )}
        </div>

        {/* Subject Multi-Select */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("Subject")} <span className="text-red-500">*</span>
          </label>
          <Select
            ref={subjectRef}
            mode="multiple"
            value={subjectIds}
            onChange={(value) => {
              setSubjectIds(value);
              if (value && value.length > 0) setSubjectError("");
            }}
            placeholder={t("Choose a subject")}
            disabled={loading}
            style={selectBoxStyle}
          >
            {allSubjects?.map((subject) => (
              <Select.Option
                key={subject?.subjectId}
                value={subject?.subjectId}
              >
                {subject.subjectName}{" "}
                {subject.isPublished ? "" : `(${t("Unpublished")})`}
              </Select.Option>
            ))}
          </Select>
          {subjectError && (
            <p className="text-red-500 text-sm mt-1">{subjectError}</p>
          )}
        </div>

        {/* Section Multi-Select */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("Section")} <span className="text-red-500">*</span>
          </label>
          <Select
            ref={sectionRef}
            mode="multiple"
            value={sectionIds}
            onChange={(value) => {
              setSectionIds(value);
              if (value && value.length > 0) setSectionError("");
            }}
            placeholder={t("Choose")}
            disabled={loading}
            style={selectBoxStyle}
          >
            {filteredSections?.map((section) => (
              <Select.Option key={section._id} value={section._id}>
                {section.sectionName}
              </Select.Option>
            ))}
          </Select>
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
