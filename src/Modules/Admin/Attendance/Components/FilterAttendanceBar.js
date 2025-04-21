import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
  MdRefresh,
} from "react-icons/md";
import { IoCalendarOutline } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { months } from "./Data/AttendenceData";
import {
  fetchSectionsByClass,
  fetchGroupsByClass,
} from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import { setFilters } from "../../../../Store/Slices/Admin/Class/Attendence/attendanceSlice";
import ProtectedAction from "../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../config/permission";
import { Select, Button, Tooltip } from "antd"; // Added Tooltip import

const { Option } = Select;

const FilterAttendanceBar = () => {
  const { filters } = useSelector((state) => state.admin.attendance);
  const { sectionId, groupId, month } = filters;
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);

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
  }, [cid, dispatch]);

  const handleFilterChange = (name, value) => {
    dispatch(setFilters({ [name]: value }));
  };

  const handleMonthSelect = (monthNumber) => {
    handleFilterChange("month", monthNumber);
    setIsMonthDropdownOpen(false);
  };

  const resetToCurrentMonth = () => {
    const currentMonth = new Date().getMonth() + 1;
    handleFilterChange("month", currentMonth);
  };

  return (
    <div className="flex items-center justify-between space-x-4 p-3">
      <div className="flex items-center gap-4">
        {/* Section Dropdown */}
        <div className="relative w-48">
          <ProtectedAction
            requiredPermission={PERMISSIONS.SECTION_BY_CLASS_ATTENDANCE}
          >
            <Select
              value={sectionId || ""}
              onChange={(value) => handleFilterChange("sectionId", value)}
              className="w-full"
              placeholder="Select Section"
              allowClear
            >
              <Option value="">All Sections</Option>
              {sections?.map((section) => (
                <Option key={section._id} value={section._id}>
                  {section.sectionName}
                </Option>
              ))}
            </Select>
          </ProtectedAction>
        </div>

        {/* Group Dropdown */}
        <div className="relative w-48">
          <ProtectedAction requiredPermission={PERMISSIONS.GROUP_BY_CLASS}>
            <Select
              value={groupId || ""}
              onChange={(value) => handleFilterChange("groupId", value)}
              className="w-full"
              placeholder="Select Group"
              allowClear
            >
              <Option value="">All Groups</Option>
              {groups?.map((group) => (
                <Option key={group._id} value={group._id}>
                  {group.groupName}
                </Option>
              ))}
            </Select>
          </ProtectedAction>
        </div>
      </div>

      {/* Month Selector with Reset Button */}
      <div className="flex items-center gap-2">
        <Tooltip title="Reset to current month" placement="top">
          <Button
            icon={<MdRefresh />}
            onClick={resetToCurrentMonth}
            className="flex items-center justify-center"
          />
        </Tooltip>

        <div className="relative w-48">
          <ProtectedAction
            requiredPermission={PERMISSIONS.STUDENT_MONTHLY_ATTENDANCE_LIST}
          >
            <div
              className="flex items-center cursor-pointer p-2 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-lg"
              onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
            >
              <IoCalendarOutline className="text-white mr-2" />
              <span className="text-white">
                {months.find((m) => m.number === month)?.name || "Select Month"}
              </span>
              <span className="ml-auto">
                {isMonthDropdownOpen ? (
                  <MdOutlineKeyboardArrowUp className="text-white" />
                ) : (
                  <MdOutlineKeyboardArrowDown className="text-white" />
                )}
              </span>
            </div>
            {isMonthDropdownOpen && (
              <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
                {months?.map((monthObj) => (
                  <div
                    key={monthObj.name}
                    className={`p-2 ps-4 hover:bg-gray-100 cursor-pointer ${
                      month === monthObj.number ? "bg-gray-200 font-medium" : ""
                    }`}
                    onClick={() => handleMonthSelect(monthObj.number)}
                  >
                    {monthObj.name}
                  </div>
                ))}
              </div>
            )}
          </ProtectedAction>
        </div>
      </div>
    </div>
  );
};

export default FilterAttendanceBar;
