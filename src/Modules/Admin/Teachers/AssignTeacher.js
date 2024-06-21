import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useGetAllTeachers from "../../../Hooks/AuthHooks/Staff/Admin/useGetAllTeacher";
import { useSelector } from "react-redux";
import useFetchSubjects from "../../../Hooks/AuthHooks/Staff/Admin/useFetchSubjects";
import { useParams } from "react-router-dom";

const AssignTeacher = () => {
  const [teacherId, setTeacherId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const { fetchTeachers } = useGetAllTeachers();
  const { fetchSubjects } = useFetchSubjects();
  const { cid } = useParams();
  useEffect(() => {
    fetchTeachers();
    fetchSubjects(cid);
  }, []);
  const AllTeachers = useSelector((store) => store.Teachers.allTeachers);
  const AllSubjects = useSelector((store) => store.Subject.subjects);
  const AllSections = useSelector((store) => store.ClassSection.sectionData);
  const handleSubmit = (e) => {
    e.preventDefault();
    const assignData = {
      classId: cid,
      teacherId,
      sectionId,
      subjectId,
    };
    console.log(assignData);
    toast.success("Teacher data has been logged to the console");
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
          >
            <option value="">Choose</option>
            {AllTeachers?.map((list) => {
              return (
                <option key={list._id} value={list._id}>
                  {list.fullName}
                </option>
              );
            })}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teacher Category
          </label>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Choose</option>
            {AllSubjects.map((list) => {
              return (
                <option key={list._id} value={list._id}>
                  {list.subjectName}
                </option>
              );
            })}
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
          >
            <option value="">Choose</option>
            {AllSections?.map((list) => {
              return (
                <option key={list._id} value={list._id}>
                  {list.sectionName}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className="mt-auto mb-8">
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
        >
          Add New Teacher
        </button>
      </div>
    </form>
  );
};

export default AssignTeacher;
