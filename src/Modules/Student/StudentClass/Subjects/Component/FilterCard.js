import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiRefreshCw } from "react-icons/fi";
import { MdViewModule, MdOutlineMenuBook } from "react-icons/md";
import { Select, Button, Tooltip as AntTooltip } from "antd";
import { useParams } from "react-router-dom";
import { stdModule } from "../../../../../Store/Slices/Student/MyClass/Class/Subjects/Modules/module.action";

const { Option } = Select;

const FilterCard = ({ filters, setFilters }) => {
  const [selectedModule, setSelectedModule] = useState(filters.moduleId || "");
  const [selectedChapter, setSelectedChapter] = useState(
    filters.chapterId || ""
  );
  const [chapters, setChapters] = useState([]);

  // Track local loading state for "Apply"
  const [applying, setApplying] = useState(false);

  const { modulesData } = useSelector((store) => store?.student?.studentModule);
  const dispatch = useDispatch();
  const { cid, sid } = useParams();

  useEffect(() => {
    dispatch(stdModule({ cid, sid }));
  }, [cid, sid, dispatch]);

  useEffect(() => {
    if (selectedModule) {
      const module = modulesData.find((mod) => mod._id === selectedModule);
      setChapters(module ? module.chapters : []);
    } else {
      setChapters([]);
    }
  }, [selectedModule, modulesData]);

  /* ---------------------- Handlers ---------------------- */
  const handleApplyFilters = () => {
    setApplying(true);
    // If your thunk returns a promise, handle .then()/.catch() to stop applying
    setFilters({ moduleId: selectedModule, chapterId: selectedChapter });

    // Simulate short async operation
    setTimeout(() => setApplying(false), 500);
  };

  const handleModuleChange = (value) => {
    setSelectedModule(value);
    setSelectedChapter("");
  };

  const handleChapterChange = (value) => {
    setSelectedChapter(value);
  };

  const handleResetFilters = () => {
    setSelectedModule("");
    setSelectedChapter("");
    setFilters({ moduleId: "", chapterId: "" });
  };

  /* 
    Disable "Apply" if no moduleId and no chapterId are selected,
    or if a filter apply is in progress.
  */
  const isApplyDisabled = (!selectedModule && !selectedChapter) || applying;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-72 relative">
      {/* RESET ICON WITH TOOLTIP */}
      <AntTooltip title="Reset Filters">
        <button
          onClick={handleResetFilters}
          className="absolute top-2 right-2 text-gray-600 rounded-full p-2 focus:outline-none transform transition-transform duration-300 hover:rotate-180"
          aria-label="Reset filters"
        >
          <FiRefreshCw size={24} />
        </button>
      </AntTooltip>

      <h2 className="text-lg font-semibold mb-4">Filter</h2>

      {/* MODULE FIELD */}
      <div className="mb-4">
        <label className="flex items-center gap-2 text-gray-700 mb-1">
          {/* <MdViewModule className="text-lg text-gray-600" /> */}
          <span>Module</span>
        </label>
        <Select
          placeholder="Select a module"
          className="w-full"
          value={selectedModule || undefined}
          onChange={handleModuleChange}
          allowClear
        >
          {modulesData?.map((module) => (
            <Option key={module._id} value={module._id}>
              {module.moduleName}
            </Option>
          ))}
        </Select>
      </div>

      {/* CHAPTER FIELD */}
      <div className="mb-4">
        <label className="flex items-center gap-2 text-gray-700 mb-1">
          {/* <MdOutlineMenuBook className="text-lg text-gray-600" /> */}
          <span>Chapter</span>
        </label>
        <Select
          placeholder="Select a chapter"
          className="w-full"
          value={selectedChapter || undefined}
          onChange={handleChapterChange}
          allowClear
        >
          {chapters?.map((chapter) => (
            <Option key={chapter._id} value={chapter._id}>
              {chapter.name}
            </Option>
          ))}
        </Select>
      </div>

      {/* APPLY BUTTON WITH LOADING SPINNER & DISABLE LOGIC */}
      <Button
        onClick={handleApplyFilters}
        type="primary"
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-full focus:outline-none transform transition-transform duration-300 hover:scale-105"
        loading={applying}
        disabled={isApplyDisabled}
      >
        Apply
      </Button>
    </div>
  );
};

export default FilterCard;
