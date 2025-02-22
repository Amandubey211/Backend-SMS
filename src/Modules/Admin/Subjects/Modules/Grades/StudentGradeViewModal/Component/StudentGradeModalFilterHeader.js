import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchModules } from "../../../../../../../Store/Slices/Admin/Class/Module/moduleThunk";

// Icons
import { FiChevronDown, FiRefreshCw } from "react-icons/fi";

const StudentGradeModalFilterHeader = ({
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  const { cid, sid } = useParams();
  const [chapters, setChapters] = useState([]);
  const dispatch = useDispatch();

  const { modules: moduleList } = useSelector((state) => state.admin.module);
  const { studentSubjectProgress } = useSelector(
    (store) => store.admin.all_students
  );

  // Update chapters when the selected module changes
  useEffect(() => {
    if (filters.module) {
      const selectedModule = moduleList?.find((m) => m?._id === filters.module);
      setChapters(selectedModule?.chapters || []);
    } else {
      setChapters([]);
    }
  }, [filters.module, moduleList]);

  // Generic handler for user changing selects/inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    // If user picked a new module, update the chapters in that module
    if (name === "module") {
      const selectedModule = moduleList?.find((m) => m?._id === value);
      setChapters(selectedModule?.chapters || []);
    }

    // If user changed subject, refetch modules for that subject
    if (name === "subject") {
      dispatch(fetchModules({ cid, sid: value })).then(() => {
        if (moduleList && moduleList.length > 0) {
          setChapters(moduleList[0]?.chapters || []);
        } else {
          setChapters([]);
        }
      });
    }

    onFilterChange(name, value);
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white w-full flex-wrap">
      {/* Grade Mode */}
      <div className="flex flex-col w-48 relative">
        <label className="text-sm font-medium text-gray-700">Grade Mode</label>
        <div className="relative mt-1">
          <select
            name="gradeMode"
            value={filters.gradeMode}
            onChange={handleChange}
            className="block w-full px-3 py-2 pr-8 bg-white border border-gray-300
                       rounded-md shadow-sm focus:outline-none focus:ring-indigo-500
                       focus:border-indigo-500 sm:text-sm"
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      {filters.gradeMode === "online" && (
        <>
          {/* Arrange By */}
          <div className="flex flex-col flex-grow relative">
            <label className="text-sm font-medium text-gray-700">
              Arrange By
            </label>
            <div className="relative mt-1">
              <select
                name="arrangeBy"
                value={filters.arrangeBy}
                onChange={handleChange}
                className="block w-full px-3 py-2 pr-8 bg-white border border-gray-300
                           rounded-md shadow-sm focus:outline-none focus:ring-indigo-500
                           focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select</option>
                <option value="assignment">Assignment</option>
                {/* <option value="group assignment">Group Assignment</option> */}
                <option value="quiz">Quiz</option>
                {/* <option value="group quiz">Group Quiz</option> */}
                {/* <option value="offline_exam">Offline Exam</option> */}
              </select>
            </div>
          </div>

          {/* Subject (only if no sid in URL) */}
          {!sid && (
            <div className="flex flex-col flex-grow relative">
              <label className="text-sm font-medium text-gray-700">
                Subjects
              </label>
              <div className="relative mt-1">
                <select
                  name="subject"
                  value={filters.subject}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 pr-8 bg-white border border-gray-300
                             rounded-md shadow-sm focus:outline-none focus:ring-indigo-500
                             focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">All</option>
                  {studentSubjectProgress?.map((s) => (
                    <option key={s.subjectId} value={s.subjectId}>
                      {s.subjectName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Modules */}
          <div className="flex flex-col flex-grow relative">
            <label className="text-sm font-medium text-gray-700">Modules</label>
            <div className="relative mt-1">
              <select
                name="module"
                value={filters.module}
                onChange={handleChange}
                className="block w-full px-3 py-2 pr-8 bg-white border border-gray-300
                           rounded-md shadow-sm focus:outline-none focus:ring-indigo-500
                           focus:border-indigo-500 sm:text-sm"
              >
                <option value="">All</option>
                {moduleList?.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m?.moduleName?.slice(0, 20)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Chapter */}
          <div className="flex flex-col flex-grow relative">
            <label className="text-sm font-medium text-gray-700">Chapter</label>
            <div className="relative mt-1">
              <select
                name="chapter"
                value={filters.chapter}
                onChange={handleChange}
                disabled={!filters.module}
                className="block w-full px-3 py-2 pr-8 bg-white border border-gray-300
                           rounded-md shadow-sm focus:outline-none focus:ring-indigo-500
                           focus:border-indigo-500 sm:text-sm"
              >
                {!filters.module ? (
                  <option value="">Select Module First</option>
                ) : (
                  <>
                    <option value="">All</option>
                    {chapters?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c?.name?.slice(0, 20)}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col flex-grow relative">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <div className="relative mt-1">
              <select
                name="status"
                value={filters.status}
                onChange={handleChange}
                className="block w-full px-3 py-2 pr-8 bg-white border border-gray-300
                           rounded-md shadow-sm focus:outline-none focus:ring-indigo-500
                           focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select</option>
                <option value="Submit">Submit</option>
                <option value="Excused">Excused</option>
                <option value="Missing">Missing</option>
              </select>
            </div>
          </div>
        </>
      )}

      {/* For offline mode: search input */}
      {filters.gradeMode === "offline" && (
        <div className="flex flex-col w-48 relative">
          <label className="text-sm font-medium text-gray-700">Search</label>
          <div className="relative mt-1">
            <input
              name="search"
              type="text"
              value={filters.search}
              onChange={handleChange}
              placeholder="Search exams..."
              className="block w-full px-3 py-2 pr-8 bg-white border border-gray-300
                         rounded-md shadow-sm focus:outline-none focus:ring-indigo-500
                         focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      )}

      {/* Reset Icon - spin on hover */}
      {onResetFilters && (
        <FiRefreshCw
          onClick={onResetFilters}
          size={25}
          className="ml-auto mt-5 cursor-pointer text-gray-500 hover:text-blue-500
                     transition-transform duration-300 hover:rotate-180"
          title="Reset Filters"
        />
      )}
    </div>
  );
};

export default StudentGradeModalFilterHeader;
