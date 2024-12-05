import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { FiRefreshCw } from "react-icons/fi";
import {
  fetchGroupsByClass,
  fetchSectionsByClass,
} from "../../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import { setFilters } from "../../../../../Store/Slices/Admin/Class/Attendence/attendanceSlice";

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
    dispatch(setFilters({ sectionId: "", groupId: "" }));
  };

  return (
    <div className="flex justify-between items-center my-2">
      <div className="flex space-x-4">
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Section</label>
          <select
            className={`border rounded p-2 w-56 transition-all duration-300 ${
              isSectionInvalid ? "border-red-500" : "border-gray-300"
            }`} // Apply red border if section is invalid
            value={sectionId}
            onChange={(e) => handleFilterChange("sectionId", e.target.value)}
          >
            <option value="">Choose Section</option>
            {sections?.map((section) => (
              <option key={section._id} value={section._id}>
                {section.sectionName}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Group</label>
          <select
            className="border rounded p-2 w-56 border-gray-300"
            value={groupId}
            onChange={(e) => handleFilterChange("groupId", e.target.value)}
          >
            <option value="">Choose Group</option>
            {groups?.map((group) => (
              <option key={group._id} value={group._id}>
                {group.groupName}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex items-center">
        <button
          title="Reset"
          onClick={handleAllChange}
          className="text-gray-600 rounded-full p-2 focus:outline-none transform transition-transform duration-300 hover:rotate-180"
          aria-label="Refresh attendance"
        >
          <FiRefreshCw size={24} />
        </button>
      </div>
    </div>
  );
};

export default Filters;
