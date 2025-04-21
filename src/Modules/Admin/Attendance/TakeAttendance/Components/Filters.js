import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { FiRefreshCw } from "react-icons/fi";
import { Select, Tooltip } from "antd"; // Importing Tooltip from Ant Design
import {
  fetchGroupsByClass,
  fetchSectionsByClass,
} from "../../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import { setFilters } from "../../../../../Store/Slices/Admin/Class/Attendence/attendanceSlice";

const { Option } = Select;

const Filters = ({ isSectionInvalid }) => {
  const { filters } = useSelector((state) => state.admin.attendance);
  const { sectionId, groupId } = filters;
  const dispatch = useDispatch();
  const { cid } = useParams();

  const sections = useSelector(
    (state) => state.admin.group_section.sectionsList
  );
  const groups = useSelector((state) => state.admin.group_section.groupsList);

  useEffect(() => {
    if (cid) {
      dispatch(fetchSectionsByClass(cid));
      dispatch(fetchGroupsByClass(cid));
    }
  }, [dispatch, cid]);

  const handleFilterChange = (name, value) => {
    dispatch(setFilters({ [name]: value }));
  };

  const handleAllChange = () => {
    dispatch(setFilters({ sectionId: null, groupId: null }));
  };

  return (
    <div className="flex justify-between items-center my-2">
      <div className="flex space-x-4">
        {/* Section Select with Ant Design */}
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Section</label>
          <Select
            className={`w-56 ${
              isSectionInvalid ? "border-red-500" : "border-gray-300"
            }`}
            value={sectionId}
            onChange={(value) => handleFilterChange("sectionId", value)}
            placeholder="Choose Section"
            allowClear
          >
            {sections?.map((section) => (
              <Option key={section._id} value={section._id}>
                {section.sectionName}
              </Option>
            ))}
          </Select>
        </div>

        {/* Group Select with Ant Design */}
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Group</label>
          <Select
            className="w-56 border-gray-300"
            value={groupId}
            onChange={(value) => handleFilterChange("groupId", value)}
            placeholder="All Groups"
            allowClear
          >
            {groups?.map((group) => (
              <Option key={group._id} value={group._id}>
                {group.groupName}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      {/* Refresh Button with Ant Design Tooltip */}
      <div className="flex items-center">
        <Tooltip title="Reset filters">
          <button
            title="Reset"
            onClick={handleAllChange}
            className="text-gray-600 rounded-full p-2 focus:outline-none transform transition-transform duration-300 hover:rotate-180"
            aria-label="Refresh attendance"
          >
            <FiRefreshCw size={24} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default Filters;
