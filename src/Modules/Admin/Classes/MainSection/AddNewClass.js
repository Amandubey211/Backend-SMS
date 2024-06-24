// Components/AddNewClass.js
import React, { useState } from "react";
import classIcons from "../../Dashboard/DashboardData/ClassIconData";

import toast from "react-hot-toast";
import useCreateClass from "../../../../Hooks/AuthHooks/Staff/Admin/useCreateClass";

const AddNewClass = () => {
  const [activeIconId, setActiveIconId] = useState(null);
  const [newClassName, setNewClassName] = useState("");
  const { createClass, loading } = useCreateClass();

  const handleIconClick = (gradeLevel, id) => {
    setActiveIconId(id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newClassName || !activeIconId) {
      toast.error("Please provide a class name and select an icon.");
      return;
    }

    const classData = {
      className: newClassName,
      classIcons: activeIconId,
    };

    try {
      await createClass(classData);
      // Reset form fields
      setNewClassName("");
      setActiveIconId(null);
    } catch (err) {
      // Error is already handled in the hook via toast notification
    }
  };

  return (
    <div className="flex flex-col h-full">
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="flex flex-col justify-start gap-2 mt-5">
          <label htmlFor="className" className="font-semibold">
            Class Name
          </label>
          <input
            id="className"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            type="text"
            placeholder="Type here"
            aria-label="Class Name"
          />
        </div>
        <div className="flex flex-col gap-2 mt-6 flex-grow">
          <h3 className="font-semibold">Class Icons</h3>
          <div className="flex justify-around gap-4 flex-wrap">
            {classIcons.map((data) => (
              <button
                type="button"
                key={data.id}
                className={`h-16 w-16 p-1 rounded-lg border hover:cursor-pointer bg-gradient-to-r transition duration-300 ease-in-out ${
                  activeIconId === data.id
                    ? "from-pink-600 to-purple-600"
                    : "from-transparent to-transparent"
                } hover:from-pink-600 hover:to-purple-600 ${
                  activeIconId === data.id
                    ? "border-pink-500"
                    : "border-gray-300"
                } transform hover:scale-105`}
                onClick={() => handleIconClick(data.gradeLevel, data.id)}
                aria-label={`Select icon ${data.id}`}
              >
                <img src={data.icon} alt={`Icon ${data.id}`} />
              </button>
            ))}
          </div>
        </div>
        <div className="mt-auto mb-6">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
            disabled={loading}
            aria-busy={loading ? "true" : "false"}
          >
            {loading ? "Adding Class..." : "Add New Class"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewClass;
