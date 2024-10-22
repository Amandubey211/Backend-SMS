import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  assignTeacher,
  fetchAllTeachers,
} from "../../../Store/Slices/Admin/Class/Teachers/teacherThunks";
import { fetchSubjects } from "../../../Store/Slices/Admin/Class/Subject/subjectThunks";

const AssignTeacher = () => {
  const [teacherId, setTeacherId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const dispatch = useDispatch();
  const { cid } = useParams(); // Get class ID from params

  // Extracting required data from Redux store
  const allTeachers = useSelector((state) => state.admin.teacher.allTeachers);
  console.log(allTeachers, "kkkkkkkkkkkk");
  const allSubjects = useSelector((state) => state.admin.subject.subjects);
  const allSections = useSelector(
    (state) => state.admin.group_section.sectionsList
  );
  const loading = useSelector((state) => state.admin.teacher.loading);

  // Fetch teachers, subjects, and sections on component mount
  useEffect(() => {
    dispatch(fetchAllTeachers());

    dispatch(fetchSubjects(cid));
  }, [dispatch, cid]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const assignData = {
      classId: cid,
      teacherId,
      sectionId,
      subjectId,
    };
    dispatch(assignTeacher(assignData)); // Dispatch the thunk to assign a teacher
  };

  return (
    <form className="flex flex-col h-full" onSubmit={handleSubmit}>
      <div className="bg-white rounded-lg p-4 w-full max-w-md">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teacher Name
          </label>
          <select
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-lg"
            disabled={loading}
          >
            <option value="">Choose</option>
            {allTeachers?.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.firstName} {teacher.lastName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-lg"
            disabled={loading}
          >
            <option value="">Choose</option>
            {allSubjects?.map((subject) => (
              <option key={subject?.subjectId} value={subject?.subjectId}>
                {subject.subjectName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
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
            {allSections?.map((section) => (
              <option key={section._id} value={section._id}>
                {section.sectionName}
              </option>
            ))}
          </select>
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
          {loading ? "Assigning..." : "Add New Instructor"}
        </button>
      </div>
    </form>
  );
};

export default AssignTeacher;
