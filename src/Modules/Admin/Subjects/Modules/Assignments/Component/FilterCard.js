import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const FilterCard = ({ filters, setFilters }) => {
  const [publishStatus, setPublishStatus] = useState(filters.publish || null);
  const [selectedModule, setSelectedModule] = useState(filters.moduleId || "");
  const [selectedChapter, setSelectedChapter] = useState(filters.chapterId || "");
  const [chapters, setChapters] = useState([]);
  const moduleList = useSelector((store) => store.Subject.modules);

  useEffect(() => {
    if (selectedModule) {
      const module = moduleList.find((mod) => mod._id === selectedModule);
      if (module) {
        setChapters(module.chapters);
      } else {
        setChapters([]);
      }
    } else {
      setChapters([]);
    }
  }, [selectedModule, moduleList]);

  const handleApplyFilters = () => {
    setFilters({
      moduleId: selectedModule,
      chapterId: selectedChapter,
      publish: publishStatus,
    });
  };

  const togglePublishStatus = (status) => {
    setPublishStatus((prevStatus) => (prevStatus === status ? null : status));
  };

  const handleModuleChange = (e) => {
    setSelectedModule(e.target.value);
    setSelectedChapter(""); // Reset chapter when module changes
  };

  const radioStyles = (checked, color) => ({
    appearance: "none",
    height: "20px",
    width: "20px",
    borderRadius: "50%",
    border: `2px solid ${checked ? color : "#d1d5db"}`,
    backgroundColor: checked ? color : "transparent",
    display: "inline-block",
    verticalAlign: "middle",
    cursor: "pointer",
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-80">
      <h2 className="text-lg font-semibold mb-4">Filter</h2>
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="publishStatus"
            value="true"
            checked={publishStatus === "true"}
            onChange={() => togglePublishStatus("true")}
            style={radioStyles(publishStatus === "true", "#10b981")} // Green color for publish
          />
          <span className="ml-2 text-green-600">Publish</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input
            type="radio"
            name="publishStatus"
            value="false"
            checked={publishStatus === "false"}
            onChange={() => togglePublishStatus("false")}
            style={radioStyles(publishStatus === "false", "#ef4444")} // Red color for unpublish
          />
          <span className="ml-2 text-red-600">Unpublish</span>
        </label>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Module</label>
        <select
          className="mt-1 block w-full pl-3 pr-10 border py-2 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={selectedModule}
          onChange={handleModuleChange}
        >
          <option value="">Select</option>
          {moduleList.map((module) => (
            <option key={module._id} value={module._id}>
              {module.moduleName}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Chapter</label>
        <select
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={selectedChapter}
          onChange={(e) => setSelectedChapter(e.target.value)}
        >
          <option value="">Select</option>
          {chapters.map((chapter) => (
            <option key={chapter._id} value={chapter._id}>
              {chapter.name}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleApplyFilters}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-full focus:outline-none"
      >
        Apply
      </button>
    </div>
  );
};

export default FilterCard;
