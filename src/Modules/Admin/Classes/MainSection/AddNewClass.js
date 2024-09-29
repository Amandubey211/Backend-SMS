import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import classIcons from "../../Dashboard/DashboardData/ClassIconData";
import toast from "react-hot-toast";
import {
  createClass,
  updateClass,
} from "../../../../Store/Slices/Admin/Class/actions/classThunk";

const AddNewClass = ({ classData, isUpdate, onClose }) => {
  const [activeIconId, setActiveIconId] = useState(null); // Icon state
  const [newClassName, setNewClassName] = useState(""); // Class name state

  const dispatch = useDispatch();
  const loading = useSelector((state) => state.admin.class.loading);

  // Preload class details if updating
  useEffect(() => {
    if (isUpdate && classData) {
      setNewClassName(classData.className); // Preload class name
      setActiveIconId(classData.classIcons); // Preload class icon
    } else {
      // Clear form when not updating
      setNewClassName("");
      setActiveIconId(null);
    }
  }, [isUpdate, classData]);

  const handleIconClick = (gradeLevel, id) => {
    setActiveIconId(id);
  };

  const hasChanges = () => {
    if (!classData) return false;
    return (
      newClassName !== classData.className ||
      activeIconId !== classData.classIcons
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newClassName || !activeIconId) {
      toast.error("Please provide a class name and select an icon.");
      return;
    }

    // Only dispatch the update if there are changes
    if (isUpdate && !hasChanges()) {
      toast("No changes detected.");
      return;
    }

    const classDetails = {
      className: newClassName,
      classIcons: activeIconId,
    };

    try {
      if (isUpdate) {
        // Dispatch the updateClass thunk only if there are changes
        dispatch(
          updateClass({ classData: classDetails, classId: classData._id })
        );
        onClose();
      } else {
        // Dispatch the createClass thunk
        dispatch(createClass(classDetails));
        // Reset form fields
        setNewClassName("");
        setActiveIconId(null);
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
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
        <div className="mb-9">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
            disabled={loading}
            aria-busy={loading ? "true" : "false"}
          >
            {loading
              ? "loading..."
              : isUpdate
              ? "Update Class"
              : "Add New Class"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewClass;
