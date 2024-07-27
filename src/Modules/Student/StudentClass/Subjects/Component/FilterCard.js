import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiRefreshCw } from "react-icons/fi";

const FilterCard = ({
  filters = { moduleId: "", chapterId: "" },
  setFilters,
}) => {
  const [selectedModule, setSelectedModule] = useState(filters.moduleId);
  const [selectedChapter, setSelectedChapter] = useState(filters.chapterId);
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
    });
  };

  const handleModuleChange = (e) => {
    setSelectedModule(e.target.value);
    setSelectedChapter(""); // Reset chapter when module changes
  };

  const handleResetFilters = () => {
    setSelectedModule("");
    setSelectedChapter("");
    setFilters({
      moduleId: "",
      chapterId: "",
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-80 relative">
      <button
        onClick={handleResetFilters}
        className="absolute top-2 right-2 text-gray-600 rounded-full p-2 focus:outline-none transform transition-transform duration-300 hover:rotate-180"
        aria-label="Reset filters"
      >
        <FiRefreshCw size={24} />
      </button>
      <h2 className="text-lg font-semibold mb-4">Filter</h2>
      <div className="mb-4">
        <label className="block text-gray-700" htmlFor="module-select">
          Module
        </label>
        <select
          id="module-select"
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
        <label className="block text-gray-700" htmlFor="chapter-select">
          Chapter
        </label>
        <select
          id="chapter-select"
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
        className="w-full bg-gradient-to-r rounded-full from-purple-500 to-pink-500 text-white py-2  focus:outline-none"
        aria-label="Apply filters"
      >
        Apply
      </button>
    </div>
  );
};

export default FilterCard;
