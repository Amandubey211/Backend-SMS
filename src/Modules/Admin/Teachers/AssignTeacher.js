import React, { useState } from "react";
import toast from "react-hot-toast";

const AssignTeacher = () => {
  const [teacherName, setTeacherName] = useState("Mehedi Hasan");
  const [teacherCategory, setTeacherCategory] = useState("Science");
  const [section, setSection] = useState("A");

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      teacherName,
      teacherCategory,
      section,
    };
    console.log(formData);
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
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-lg"
          >
            <option>Mehedi Hasan</option>
            <option>John Doe</option>
            <option>Jane Smith</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teacher Category
          </label>
          <select
            value={teacherCategory}
            onChange={(e) => setTeacherCategory(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-lg"
          >
            <option>Science</option>
            <option>Math</option>
            <option>English</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Section
          </label>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-lg"
          >
            <option>A</option>
            <option>B</option>
            <option>C</option>
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
