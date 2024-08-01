import React, { useEffect, useState, useMemo, useCallback } from "react";
import classIcons from "../../Dashboard/DashboardData/ClassIconData";
import toast from "react-hot-toast";
import EditorSelector from "./Components/EditorSelector";
import useCreateSubject from "../../../../Hooks/AuthHooks/Staff/Admin/useCreateSubject";
import { useParams } from "react-router-dom";
import { ImSpinner3 } from "react-icons/im";

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
  "#6EE7B7",
  "#9333EA",
  "#F43F5E",
  "#FB923C",
  "#F87171",
  "#14B8A6",
  "#60A5FA",
  "#D97706",
  "#4B5563",
];

const AddNewSubject = ({ onClose, subject }) => {
  const [activeTab, setActiveTab] = useState("icon");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeIconId, setActiveIconId] = useState(null);
  const [subjectTitle, setSubjectTitle] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const {
    createSubject,
    updateSubject,
    loading: apiLoading,
    error,
  } = useCreateSubject();
  const [loading, setLoading] = useState({ save: false, publish: false });
  const { cid } = useParams();

  useEffect(() => {
    if (subject) {
      setSelectedColor(subject.color || "");
      setActiveIconId(subject.icon || null);
      setSubjectTitle(subject.name || "");
      setSelectedUsers(subject.users || []);
    } else {
      resetForm();
    }
  }, [subject]);

  const resetForm = useCallback(() => {
    setSelectedColor("");
    setActiveIconId(null);
    setSubjectTitle("");
    setSelectedUsers([]);
  }, []);

  const handleIconClick = useCallback((id) => {
    setActiveIconId(id);
  }, []);

  const validateInputs = useCallback(() => {
    if (!subjectTitle.trim()) {
      toast.error("Subject name is required.");
      return false;
    }
    if (!activeIconId) {
      toast.error("Subject icon is required.");
      return false;
    }
    if (!selectedColor) {
      toast.error("Subject color is required.");
      return false;
    }
    return true;
  }, [subjectTitle, activeIconId, selectedColor]);

  const handleSave = async (publish = false) => {
    if (!validateInputs()) return;

    const subjectData = {
      name: subjectTitle,
      classId: cid,
      isPublished: publish,
      icon: activeIconId,
      color: selectedColor,
      users: selectedUsers,
    };

    setLoading((prev) => ({ ...prev, [publish ? "publish" : "save"]: true }));

    try {
      let result;
      if (subject) {
        result = await updateSubject(subject._id, subjectData);
        if (result.success) {
          toast.success("Subject updated successfully");
          onClose();
        } else {
          toast.error("Failed to update subject");
        }
      } else {
        result = await createSubject(subjectData);
        if (result.success) {
          toast.success("Subject created successfully");
          onClose();
        } else {
          toast.error("Failed to create subject");
        }
      }
    } finally {
      setLoading({ save: false, publish: false });
    }
  };

  const iconGrid = useMemo(
    () =>
      classIcons.map((data) => (
        <button
          key={data.id}
          onClick={() => handleIconClick(data.id)}
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
    [activeIconId, handleIconClick]
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
    <div className="flex flex-col h-full p-4">
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
          aria-required="true"
        />
      </div>

      <div className="mb-4">
        <EditorSelector
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
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
          aria-selected={activeTab === "icon"}
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
          aria-selected={activeTab === "color"}
        >
          Frame Color
        </button>
      </div>

      <div
        id="icon-tab"
        className={`flex-grow ${activeTab === "icon" ? "block" : "hidden"}`}
      >
        <div className="grid grid-cols-5 gap-4 mt-2">{iconGrid}</div>
      </div>

      <div
        id="color-tab"
        className={`flex-grow ${activeTab === "color" ? "block" : "hidden"}`}
      >
        <div className="grid grid-cols-6 gap-2 mt-2">{colorGrid}</div>
      </div>

      <div className="mb-4 flex justify-between items-center space-x-4">
        <button
          onClick={() => handleSave(true)}
          className="flex-grow rounded-md py-2 text-center"
          style={{
            background: "linear-gradient(to right, #fce7f3, #e9d5ff)",
          }}
          disabled={loading.publish}
          aria-busy={loading.publish}
        >
          {loading.publish ? (
            <ImSpinner3 className="animate-spin mx-auto text-lg" />
          ) : (
            <span
              style={{
                background: "linear-gradient(to right, #f43f5e, #8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Save & Publish
            </span>
          )}
        </button>
        <button
          onClick={() => handleSave(false)}
          className="flex-grow px-6 py-2 text-white font-semibold rounded-md bg-gradient-to-r from-purple-500 to-red-500 hover:from-purple-600 hover:to-red-600 text-center"
          disabled={loading.save}
          aria-busy={loading.save}
        >
          {loading.save ? (
            <ImSpinner3 className="animate-spin mx-auto text-lg" />
          ) : (
            "Save"
          )}
        </button>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}
    </div>
  );
};

export default AddNewSubject;
