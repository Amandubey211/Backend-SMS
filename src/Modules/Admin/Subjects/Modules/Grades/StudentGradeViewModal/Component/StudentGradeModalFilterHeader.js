import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchModules } from "../../../../../../../Store/Slices/Admin/Class/Module/moduleThunk";

// Icons
import { FiChevronDown, FiRefreshCw } from "react-icons/fi";

// Ant Design components
import { Select, Input, Tooltip } from "antd";

const { Option } = Select;

const StudentGradeModalFilterHeader = ({
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  const { cid, sid } = useParams();
  const [chapters, setChapters] = useState([]);
  const dispatch = useDispatch();

  const { semesters: semesterList } = useSelector(
    (state) => state.admin.semesters
  );

  const { modules: moduleList, moduleLoading } = useSelector(
    (state) => state.admin.module
  );

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
    if (name === "semester") {
      // Store only the id in filters.semester
      onFilterChange(name, value);  // Call the passed function to handle state update
    } else {
      onFilterChange(name, value);
    }

  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white w-full flex-wrap">
      {/* Grade Mode */}
      <div className="flex flex-col w-48 relative">
        <label className="text-sm font-medium text-gray-700">Grade Mode</label>
        <div className="relative mt-1">
          <Select
            name="gradeMode"
            value={filters.gradeMode}
            onChange={(value) =>
              handleChange({ target: { name: "gradeMode", value } })
            }
            className="w-full"
          >
            <Option value="online">Online</Option>
            <Option value="offline">Offline</Option>
          </Select>
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
              <Select
                name="arrangeBy"
                value={filters.arrangeBy}
                onChange={(value) =>
                  handleChange({ target: { name: "arrangeBy", value } })
                }
                className="w-full"
              >
                <Option value="">Select</Option>
                <Option value="assignment">Assignment</Option>
                <Option value="quiz">Quiz</Option>
              </Select>
            </div>
          </div>

          {/* Subject (only if no sid in URL) */}
          {!sid && (
            <div className="flex flex-col flex-grow relative">
              <label className="text-sm font-medium text-gray-700">
                Subjects
              </label>
              <div className="relative mt-1">
                <Select
                  name="subject"
                  value={filters.subject}
                  onChange={(value) =>
                    handleChange({ target: { name: "subject", value } })
                  }
                  className="w-full"
                >
                  <Option value="">All</Option>
                  {studentSubjectProgress?.map((s) => (
                    <Option key={s?.subjectId} value={s?.subjectId}>
                      {s?.subjectName}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
          )}

          {/* Modules */}
          <div className="flex flex-col flex-grow relative">
            <label className="text-sm font-medium text-gray-700">Modules</label>
            <div className="relative mt-1">
              <Select
                name="module"
                value={filters.module}
                onChange={(value) =>
                  handleChange({ target: { name: "module", value } })
                }
                className="w-full"
                loading={moduleLoading}
              >
                <Option value="">All</Option>
                {moduleList?.map((m) => (
                  <Option key={m._id} value={m._id}>
                    {m?.moduleName?.slice(0, 20)}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          {/* Chapter */}
          <div className="flex flex-col flex-grow relative">
            <label className="text-sm font-medium text-gray-700">Chapter</label>
            <div className="relative mt-1">
              <Select
                name="chapter"
                value={filters.chapter}
                onChange={(value) =>
                  handleChange({ target: { name: "chapter", value } })
                }
                disabled={!filters.module}
                className="w-full"
                loading={moduleLoading}
              >
                {!filters.module ? (
                  <Option value="">Select Module First</Option>
                ) : (
                  <>
                    <Option value="">All</Option>
                    {chapters?.map((c) => (
                      <Option key={c._id} value={c._id}>
                        {c?.name?.slice(0, 20)}
                      </Option>
                    ))}
                  </>
                )}
              </Select>
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col flex-grow relative">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <div className="relative mt-1">
              <Select
                name="status"
                value={filters.status}
                onChange={(value) =>
                  handleChange({ target: { name: "status", value } })
                }
                className="w-full"
              >
                <Option value="">Select</Option>
                <Option value="Submit">Submit</Option>
                <Option value="Excused">Excused</Option>
                <Option value="Missing">Missing</Option>
              </Select>
            </div>
          </div>
        </>
      )}

      {/* For offline mode: search input */}
      {filters.gradeMode === "offline" && (
        <div className="flex flex-col w-48 relative">
          <label className="text-sm font-medium text-gray-700">Search</label>
          <div className="relative mt-1">
            <Input
              name="search"
              type="text"
              value={filters.search}
              onChange={(e) => handleChange(e)}
              placeholder="Search exams..."
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Semester Filter */}
      <div className="flex flex-col w-48 relative">
        <label className="text-sm font-medium text-gray-700">Semester</label>
        <div className="relative mt-1">
          <select
            name="semester"
            value={filters.semester}
            onChange={(e) => handleChange(e)}
            className="block w-full px-3 py-2 pr-8 bg-white border border-gray-300
                 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500
                 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select Semester</option>
            {/* Add dynamic semester options from your semester list */}
            {semesterList?.map((semester) => (
              <option key={semester._id} value={semester._id}>
                {semester.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reset Icon - spin on hover */}

      {onResetFilters && (
        <Tooltip title="Reset Filters">
          <FiRefreshCw
            onClick={onResetFilters}
            size={25}
            className="ml-auto mt-5 cursor-pointer text-gray-500 hover:text-blue-500
                       transition-transform duration-300 hover:rotate-180"
          />
        </Tooltip>
      )}
    </div>
  );
};

export default StudentGradeModalFilterHeader;
