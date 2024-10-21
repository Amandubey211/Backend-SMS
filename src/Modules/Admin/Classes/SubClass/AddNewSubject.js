import React, { useEffect, useState, useMemo, useCallback } from "react";
import classIcons from "../../Dashboard/DashboardData/ClassIconData";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ImSpinner3 } from "react-icons/im";
import {
  createSubject,
  updateSubject,
} from "../../../../Store/Slices/Admin/Class/Subject/subjectThunks";

const dummyColors = [
  "#34D399",
  "#F472B6",
  "#A78BFA",
  "#60A5FA",
  "#3B82F6",
  "#EC4899",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#6366F1",
];

const AddNewSubject = ({ onClose, subject }) => {
  const [activeTab, setActiveTab] = useState("icon");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeIconId, setActiveIconId] = useState(null);
  const [subjectTitle, setSubjectTitle] = useState("");

  const dispatch = useDispatch();
  const { cid } = useParams();
  const loading = useSelector((state) => state.admin.subject.loading);

  useEffect(() => {
    if (subject) {
      setSelectedColor(subject.color || "");
      setActiveIconId(subject.icon || null);
      setSubjectTitle(subject.name || "");
    } else {
      resetForm();
    }
  }, [subject]);

  const resetForm = useCallback(() => {
    setSelectedColor("");
    setActiveIconId(null);
    setSubjectTitle("");
  }, []);

  const validateInputs = useCallback(() => {
    if (!subjectTitle.trim()) {
      toast.error("Subject name is required.");
      return false;
    }
    return true;
  }, [subjectTitle]);

  const hasChanges = () => {
    if (!subject) return false;
    return (
      subjectTitle !== subject.name ||
      selectedColor !== subject.color ||
      activeIconId !== subject.icon
    );
  };

  const handleSave = async (publish = false) => {
    if (!validateInputs()) return;

    const subjectData = {
      name: subjectTitle,
      classId: cid,
      isPublished: publish,
      icon: activeIconId,
      color: selectedColor,
    };

    if (subject) {
      // Dispatch update only if there are changes
      if (!hasChanges()) {
        toast("No changes detected.");
        return;
      }
      dispatch(updateSubject({ subjectId: subject._id, subjectData }));
    } else {
      dispatch(createSubject(subjectData));
    }
    onClose();
  };

  const iconGrid = useMemo(
    () =>
      classIcons.map((data) => (
        <button
          key={data.id}
          onClick={() => setActiveIconId(data.id)}
          className={`h-16 w-16 p-1 rounded-lg border focus:outline-none transition duration-300 ease-in-out ${
            activeIconId === data.id
              ? "bg-gradient-to-r from-pink-600 to-purple-600 border-pink-500"
              : "bg-transparent border-gray-300"
          }`}
          aria-pressed={activeIconId === data.id}
          aria-label={`Select ${data.icon} icon`}
        >
          <img
            src={data.icon}
            alt={`Icon ${data.id}`}
            className="w-full h-full"
          />
        </button>
      )),
    [activeIconId]
  );

  const colorGrid = useMemo(
    () =>
      dummyColors.map((color, index) => (
        <button
          key={index}
          style={{ backgroundColor: color }}
          onClick={() => setSelectedColor(color)}
          className={`w-12 h-12 rounded-full border-4 focus:outline-none transition duration-300 ease-in-out ${
            selectedColor === color ? "border-indigo-500" : "border-transparent"
          }`}
          aria-pressed={selectedColor === color}
          aria-label={`Select color ${color}`}
        />
      )),
    [selectedColor]
  );

  return (
    <div className="flex flex-col h-full p-4 overflow-y-auto">
      <div className="mb-4">
        <label
          htmlFor="subject-title"
          className="block text-sm font-medium text-gray-700"
        >
          Subject Title
        </label>
        <input
          type="text"
          id="subject-title"
          value={subjectTitle}
          onChange={(e) => setSubjectTitle(e.target.value)}
          className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Type here"
        />
      </div>

      <div className="flex mb-4">
        <button
          className={`flex-1 py-2 ${
            activeTab === "icon"
              ? "border-b-2 border-indigo-500 text-indigo-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("icon")}
          aria-controls="icon-tab"
        >
          Subject Icon
        </button>
        <button
          className={`flex-1 py-2 ${
            activeTab === "color"
              ? "border-b-2 border-indigo-500 text-indigo-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("color")}
          aria-controls="color-tab"
        >
          Frame Color
        </button>
      </div>

      <div
        className={`grid grid-cols-5 gap-4 ${
          activeTab === "icon" ? "block" : "hidden"
        }`}
      >
        {iconGrid}
      </div>
      <div
        className={`grid grid-cols-6 gap-2 ${
          activeTab === "color" ? "block" : "hidden"
        }`}
      >
        {colorGrid}
      </div>

      <div className="mt-auto pt-4 flex justify-between space-x-2 sticky bottom-0 bg-white py-4">
        <button
          onClick={() => handleSave(true)}
          className="w-full py-2 rounded-md bg-gradient-to-r from-pink-500 to-purple-500 text-white"
          disabled={loading}
        >
          {loading ? (
            <ImSpinner3 className="animate-spin mx-auto" />
          ) : (
            "Save & Publish"
          )}
        </button>
        <button
          onClick={() => handleSave(false)}
          className="w-full py-2 rounded-md bg-gradient-to-r from-purple-500 to-red-500 text-white"
          disabled={loading}
        >
          {loading ? <ImSpinner3 className="animate-spin mx-auto" /> : "Save"}
        </button>
      </div>
    </div>
  );
};

export default AddNewSubject;
