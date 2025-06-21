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

  // ── Local form state ──────────────────────────────
  const [teacherId, setTeacherId] = useState("");
  const [subjectIds, setSubjectIds] = useState([]);
  const [sectionIds, setSectionIds] = useState([]);

  // ── Validation errors ─────────────────────────────
  const [teacherError, setTeacherError] = useState("");
  const [subjectError, setSubjectError] = useState("");
  const [sectionError, setSectionError] = useState("");

  // ── Refs for focus handling ───────────────────────
  const teacherRef = useRef(null);
  const subjectRef = useRef(null);
  const sectionRef = useRef(null);

  // ── Redux state ───────────────────────────────────
  const allTeachers = useSelector((s) => s.admin.teacher.allTeachers);
  const allSubjects = useSelector((s) => s.admin.subject.subjects);
  const allSections = useSelector((s) => s.admin.group_section.sectionsList);
  const loading = useSelector((s) => s.admin.teacher.loading);

  // Filter sections for current class
  const filteredSections =
    allSections?.filter((sec) => sec.classId === cid) || [];

  // Fetch teachers & subjects on mount
  useEffect(() => {
    dispatch(fetchAllTeachers());
    dispatch(fetchSubjects(cid));
  }, [dispatch, cid]);

  // Pre-fill form when editing
  useEffect(() => {
    if (editingTeacher) {
      setTeacherId(editingTeacher._id);
      setSubjectIds(editingTeacher.subjects?.map((s) => s._id) || []);

      const currentClassSectionIds = filteredSections.map((s) => s._id);
      const teacherSectionsHere =
        editingTeacher.sectionId
          ?.filter((sec) => currentClassSectionIds.includes(sec._id))
          .map((sec) => sec._id) || [];

      setSectionIds(teacherSectionsHere);
    } else {
      setTeacherId("");
      setSubjectIds([]);
      setSectionIds([]);
    }
  }, [editingTeacher]); // note: filteredSections not required

  // ── Shared search filter for <Select> ─────────────
  const filterOption = (input, option) =>
    option?.children?.toString().toLowerCase().includes(input.toLowerCase());

  const selectBoxStyle = { width: "100%" };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset & validate
    setTeacherError("");
    setSubjectError("");
    setSectionError("");

    let isValid = true;
    if (!teacherId) {
      setTeacherError(t("Teacher is required"));
      teacherRef.current?.focus();
      isValid = false;
    }
    if (!subjectIds.length) {
      setSubjectError(t("Subject is required"));
      if (isValid) subjectRef.current?.focus();
      isValid = false;
    }
    if (!sectionIds.length) {
      setSectionError(t("Section is required"));
      if (isValid) sectionRef.current?.focus();
      isValid = false;
    }
    if (!isValid) return;

    try {
      if (editingTeacher) {
        await dispatch(
          editTeacher({
            id: editingTeacher._id,
            subjectIds,
            classIds: [cid],
            sectionIds,
          })
        ).unwrap();
      } else {
        await dispatch(
          assignTeacher({ classId: cid, teacherId, subjectIds, sectionIds })
        ).unwrap();
      }
      closeSidebar();
    } catch (err) {
      // optional: toast error.message
    }
  };

  return (
    <form className="flex flex-col h-full" onSubmit={handleSubmit}>
      <div className="bg-white rounded-lg p-4 w-full max-w-md">
        {/* ── Teacher ───────────────────────────── */}
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("Teacher Name")} <span className="text-red-500">*</span>
          </label>
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={filterOption}
            size="large"
            ref={teacherRef}
            value={teacherId}
            onChange={(v) => {
              setTeacherId(v);
              if (v) setTeacherError("");
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

        {/* ── Subject(s) ────────────────────────── */}
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("Subject")} <span className="text-red-500">*</span>
          </label>
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={filterOption}
            mode="multiple"
            size="large"
            ref={subjectRef}
            value={subjectIds}
            onChange={(v) => {
              setSubjectIds(v);
              if (v.length) setSubjectError("");
            }}
            placeholder={t("Choose a subject")}
            disabled={loading}
            style={selectBoxStyle}
          >
            {allSubjects?.map((sub) => (
              <Select.Option key={sub.subjectId} value={sub.subjectId}>
                {sub.subjectName} {!sub.isPublished && `(${t("Unpublished")})`}
              </Select.Option>
            ))}
          </Select>
          {subjectError && (
            <p className="text-red-500 text-sm mt-1">{subjectError}</p>
          )}
        </div>

        {/* ── Section(s) ────────────────────────── */}
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("Section")} <span className="text-red-500">*</span>
          </label>
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={filterOption}
            mode="multiple"
            size="large"
            ref={sectionRef}
            value={sectionIds}
            onChange={(v) => {
              setSectionIds(v);
              if (v.length) setSectionError("");
            }}
            placeholder={t("Choose")}
            disabled={loading}
            style={selectBoxStyle}
          >
            {filteredSections?.map((sec) => (
              <Select.Option key={sec._id} value={sec._id}>
                {sec.sectionName}
              </Select.Option>
            ))}
          </Select>
          {sectionError && (
            <p className="text-red-500 text-sm mt-1">{sectionError}</p>
          )}
        </div>
      </div>

      {/* ── Info banner ─────────────────────────── */}
      <div className="my-4 p-3 bg-gradient-to-r from-[#C83B62]/5 to-[#7F35CD]/5 rounded-lg border border-[#7F35CD]/20">
        <div className="flex items-start gap-2">
          <div className="p-1.5 rounded-full bg-gradient-to-r from-[#C83B62] to-[#7F35CD] flex-shrink-0">
            <svg
              className="h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-[#7F35CD]">
              {t("Timetable Update Notice")}
            </h3>
            <div className="mt-1 text-xs text-gray-700 space-y-1.5">
              <p>{t("For accurate scheduling, please:")}</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>
                  {t("Delete existing timetables when updating sections")}
                </li>
                <li>{t("Create new timetables to reflect changes")}</li>
              </ul>
              <p className="text-xs font-medium text-[#C83B62] mt-1.5">
                {t("Verify all changes before submission")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Submit ───────────────────────────────── */}
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
