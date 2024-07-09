import React, { useState } from "react";
import classIcons from "../../Dashboard/DashboardData/ClassIconData";
import toast from "react-hot-toast";
import EditorSelector from "./Components/EditorSelector";

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
// const dummyuser = [
// "Aman Dubey", "Akash","Huda","Faharan"
// ]

const AddNewSubject = () => {
  const [activeTab, setActiveTab] = useState("icon");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeIconId, setActiveIconId] = useState(null);
  const [subjectTitle, setSubjectTitle] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleIconClick = (id) => {
    setActiveIconId(id);
  };

  const handleSave = (publish = false) => {
    const formData = {
      subjectTitle,
      selectedColor,
      activeIconId,
      selectedUsers,
      publish,
    };
    console.log(formData);
    if (publish) {
      toast.success("Saved and Published", { position: "bottom-left" });
    } else {
      toast.success("Subject Saved", { position: "bottom-left" });
    }
  };

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
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Type here"
        />
      </div>

      <div className="mb-4">
        <EditorSelector selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />
      </div>

      <div className="flex mb-4">
        <button
          className={`flex-1 py-2 ${
            activeTab === "icon"
              ? "border-b-2 border-indigo-500 text-indigo-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("icon")}
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
        >
          Frame Color
        </button>
      </div>
      {activeTab === "icon" ? (
        <div className="flex-grow">
          <div className="grid grid-cols-5 gap-4 mt-2">
            {classIcons.map((data) => (
              <img
                className={`h-16 p-1 rounded-lg border hover:cursor-pointer bg-gradient-to-r transition duration-300 ease-in-out ${
                  activeIconId === data.id
                    ? "from-pink-600 to-purple-600"
                    : "from-transparent to-transparent"
                } hover:from-pink-600 hover:to-purple-600 ${
                  activeIconId === data.id
                    ? "border-pink-500"
                    : "border-gray-300"
                } transform hover:scale-105`}
                src={data.icon}
                key={data.id}
                onClick={() => handleIconClick(data.id)}
                alt="Icon"
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-grow">
          <div className="grid grid-cols-6 gap-2 mt-2">
            {dummyColors.map((color, index) => (
              <button
                key={index}
                style={{ backgroundColor: color }}
                className={`w-12 h-12 rounded-full  border-4 ${
                  selectedColor === color
                    ? "border-indigo-500"
                    : "border-transparent"
                }`}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </div>
      )}
      <div className="mb-4 flex justify-between items-center space-x-4">
        <button
          onClick={() => handleSave(true)}
          className="flex-grow rounded-md py-2 text-center"
          style={{
            background: "linear-gradient(to right, #fce7f3, #e9d5ff)",
          }}
        >
          <span
            style={{
              background: "linear-gradient(to right, #f43f5e, #8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Save & Publish
          </span>
        </button>
        <button
          onClick={() => handleSave(false)}
          className="flex-grow px-6 py-2 text-white font-semibold rounded-md bg-gradient-to-r from-purple-500 to-red-500 hover:from-purple-600 hover:to-red-600 text-center"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AddNewSubject;
