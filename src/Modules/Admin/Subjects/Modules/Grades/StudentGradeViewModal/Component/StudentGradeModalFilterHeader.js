import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchModules } from "../../../../../../../Store/Slices/Admin/Class/Module/moduleThunk";

const StudentGradeModalFilterHeader = ({ filters, onFilterChange }) => {
  const { cid, sid } = useParams();
  const [chapters, setChapters] = useState([]);
  const dispatch = useDispatch();

  const { modules: moduleList } = useSelector((state) => state.admin.module);
  const { studentSubjectProgress } = useSelector(
    (store) => store.admin.all_students
  );

  useEffect(() => {
    if (filters.module) {
      const selectedModule = moduleList?.find((i) => i?._id === filters.module);
      setChapters(selectedModule?.chapters || []);
    } else {
      setChapters([]);
    }
  }, [filters.module, moduleList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "module") {
      const selectedModule = moduleList?.find((i) => i?._id === value);
      setChapters(selectedModule?.chapters || []);
    }
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
    <div className="flex items-end gap-4 p-4 bg-white w-full">
      {/* Grade Mode (always visible) */}
      <div className="flex flex-col w-48">
        <label className="text-sm font-medium text-gray-700">Grade Mode</label>
        <select
          name="gradeMode"
          value={filters.gradeMode}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      {filters.gradeMode === "online" && (
        <>
          {/* Arrange By */}
          <div className="flex flex-col flex-grow">
            <label className="text-sm font-medium text-gray-700">
              Arrange By
            </label>
            <select
              name="arrangeBy"
              value={filters.arrangeBy}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select</option>
              <option value="assignment">Assignment</option>
              <option value="group assignment">Group Assignment</option>
              <option value="quiz">Quiz</option>
              <option value="group quiz">Group Quiz</option>
            </select>
          </div>

          {sid ? null : (
            <div className="flex flex-col flex-grow">
              <label className="text-sm font-medium text-gray-700">
                Subjects
              </label>
              <select
                name="subject"
                value={filters.subject}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">All</option>
                {studentSubjectProgress?.map((i) => (
                  <option key={i?.subjectId} value={i?.subjectId}>
                    {i?.subjectName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Modules */}
          <div className="flex flex-col flex-grow">
            <label className="text-sm font-medium text-gray-700">Modules</label>
            <select
              name="module"
              value={filters.module}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">All</option>
              {moduleList?.map((i) => (
                <option key={i._id} value={i._id}>
                  {i?.moduleName?.slice(0, 20)}
                </option>
              ))}
            </select>
          </div>

          {/* Chapter */}
          <div className="flex flex-col flex-grow">
            <label className="text-sm font-medium text-gray-700">Chapter</label>
            <select
              name="chapter"
              value={filters.chapter}
              onChange={handleChange}
              disabled={!filters.module}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {!filters.module ? (
                <option value="">Select Module First</option>
              ) : (
                <>
                  <option value="">All</option>
                  {chapters?.map((i) => (
                    <option key={i._id} value={i._id}>
                      {i?.name?.slice(0, 20)}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
        </>
      )}
      {/* Render Status filter only if grade mode is online */}
      {filters.gradeMode === "online" && (
        <div className="flex flex-col flex-grow">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select</option>
            <option value="Submit">Submit</option>
            <option value="Excused">Excused</option>
            <option value="Missing">Missing</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default StudentGradeModalFilterHeader;
