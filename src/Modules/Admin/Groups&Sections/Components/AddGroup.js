import React, { useState } from "react";
import toast from "react-hot-toast";

const AddGroup = () => {
  const [groupTitle, setGroupTitle] = useState("");
  const [limitStudent, setLimitStudent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      groupTitle,
      limitStudent,
    };
    console.log(formData);
    toast.success("Group Added");
  };

  return (
    <form className="flex flex-col h-full" onSubmit={handleSubmit}>
      <div className="bg-white rounded-lg p-4 w-full max-w-md">
        <div className="flex flex-col space-y-4">
          <div className="mb-4">
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
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="limit-student"
              className="block text-sm font-medium text-gray-700"
            >
              Limit Student
            </label>
            <input
              type="number"
              id="limit-student"
              value={limitStudent}
              onChange={(e) => setLimitStudent(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="50"
            />
          </div>
        </div>
      </div>
      <div className="mt-auto mb-8">
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
        >
          Add New Group
        </button>
      </div>
    </form>
  );
};

export default AddGroup;
