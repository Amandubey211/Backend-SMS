import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  deleteGroup,
  fetchGroupsByClass,
  fetchUnassignedStudents,
} from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import DeleteModal from "../../../../Components/Common/DeleteModal";
import Sidebar from "../../../../Components/Common/Sidebar";
import AddGroup from "./AddGroup";

import { LuUser } from "react-icons/lu";
import { GiImperialCrown } from "react-icons/gi";
import { TbDotsVertical } from "react-icons/tb";
import { HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";

import profileIcon from "../../../../Assets/DashboardAssets/profileIcon.png";
import StudentMenuOptions from "../../Students/Components/StudentMenuOptions";
import { Empty, Tag, Tooltip } from "antd";
import { FaGraduationCap } from "react-icons/fa";

/* 
  Props:
  - onSeeGradeClick(student)
  - groups: array of group objects (after fuzzy filtering)
  - groupsLoading: boolean 
*/
const GroupList = ({ onSeeGradeClick, groups, groupsLoading }) => {
  const dispatch = useDispatch();
  const { cid } = useParams();

  const [expandedGroupIndex, setExpandedGroupIndex] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);

  const menuRefs = useRef([]);

  // 1) Move the useEffect above any return
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRefs.current) {
        const isClickedOutside = menuRefs.current.every(
          (ref) => ref && !ref.contains(event.target)
        );
        if (isClickedOutside) {
          setActiveMenu(null);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 2) Now you can conditionally return for "groupsLoading"
  if (groupsLoading) {
    return <GroupListSkeleton />;
  }

  // If no groups at all
  if (!groups || groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-72 text-center">
        <Empty description="No groups found" />
      </div>
    );
  }

  // -------------------- Handlers --------------------
  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setEditingGroup(null);
  };

  const handleMenuToggle = (groupIndex) => {
    setActiveMenu(activeMenu === groupIndex ? null : groupIndex);
  };

  const handleEdit = (group) => {
    setEditingGroup(group);
    setIsSidebarOpen(true);
    setActiveMenu(null);
  };

  const handleDeleteClick = (group) => {
    setGroupToDelete(group);
    setIsDeleteModalOpen(true);
    setActiveMenu(null);
  };

  const handleDeleteConfirm = async () => {
    if (groupToDelete) {
      await dispatch(deleteGroup(groupToDelete._id));
      dispatch(fetchUnassignedStudents(cid));
      dispatch(fetchGroupsByClass(cid));
    }
    setIsDeleteModalOpen(false);
    setGroupToDelete(null);
  };

  // -------------------- Render Groups --------------------
  return (
    <div className="w-full bg-white p-2">
      {groups.map((group, groupIndex) => {
        const isExpanded = expandedGroupIndex === groupIndex;
        return (
          <motion.div
            key={group._id}
            // layout
            // initial={{ opacity: 0.6, y: 10 }}
            // animate={{ opacity: 1, y: 0 }}
            // transition={{ duration: 0.3 }}
            className="mb-2 border-b"
          >
            {/* Group Header */}
            <div className="flex items-center justify-between py-3 bg-pink-50 px-2 rounded-md">
              <h3
                className="text-lg font-semibold text-gradient cursor-pointer"
                onClick={() =>
                  setExpandedGroupIndex(isExpanded ? null : groupIndex)
                }
              >
                {group?.groupName || "Group Name"}
              </h3>

              <div className="flex items-center space-x-2 relative">
                {/* Count of students */}
                <div className="flex items-center space-x-1 border p-1 rounded-full px-4">
                  <LuUser className="text-green-500" />
                  <span className="text-gray-500">
                    {group?.students?.length || 0}/{group?.seatLimit || 20}
                  </span>
                </div>

                {/* Options menu */}
                <div
                  className="relative"
                  ref={(el) => (menuRefs.current[groupIndex] = el)}
                >
                  <div
                    className={`w-7 h-7 flex items-center justify-center rounded-full border cursor-pointer ${
                      activeMenu === groupIndex ? "bg-blue-100" : ""
                    }`}
                    onClick={() => handleMenuToggle(groupIndex)}
                  >
                    <TbDotsVertical
                      className={`w-6 h-6 ${
                        activeMenu === groupIndex
                          ? "text-blue-500"
                          : "text-gray-500"
                      }`}
                    />
                  </div>

                  {activeMenu === groupIndex && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-10">
                      <div
                        className="px-4 py-2 flex items-center text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleEdit(group)}
                      >
                        <HiOutlinePencilAlt className="text-blue-500 mr-2" />
                        Edit
                      </div>
                      <div
                        className="px-4 py-2 flex items-center text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleDeleteClick(group)}
                      >
                        <HiOutlineTrash className="text-red-500 mr-2" />
                        Delete
                      </div>
                    </div>
                  )}
                </div>

                {/* Expand/Collapse icon */}
                <svg
                  className={`w-7 h-7 text-gray-500 transform p-1 border rounded-full transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  onClick={() =>
                    setExpandedGroupIndex(isExpanded ? null : groupIndex)
                  }
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Students in group */}
            {isExpanded && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                {group.students?.length === 0 ? (
                  <li className="p-4 text-center">
                    <Empty description="No members found in this group" />
                  </li>
                ) : (
                  group.students.map((student, memberIndex) => (
                    <li
                      key={memberIndex}
                      className="flex items-center justify-between p-4 border-b border-gray-200 gap-4"
                    >
                      {/* Student Info */}
                      <div className="flex items-center flex-shrink-0 w-1/4">
                        <div className="relative mr-3">
                          <img
                            src={student?.profile || profileIcon}
                            alt={student?.firstName || "First"}
                            className={`w-10 h-10 rounded-full object-cover ${
                              student.isGraduate
                                ? "border-2 border-green-500"
                                : ""
                            }`}
                          />
                          {student.isGraduate && (
                            <Tooltip title="Graduated">
                              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                                <FaGraduationCap className="text-white w-3 h-3" />
                              </div>
                            </Tooltip>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <div className="text-sm font-medium truncate">
                            {student?.firstName} {student?.lastName || ""}
                          </div>
                          {group.leader === student._id ? (
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-medium text-gradient truncate">
                                Group Leader
                              </span>
                              <span className="text-yellow-500">
                                <GiImperialCrown />
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center text-xs text-gray-500 truncate">
                              <span>
                                {student?.admissionNumber || memberIndex}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 items-start justify-center w-1/5 truncate">
                        <Tag className="text-sm text-gray-500 truncate">
                          {student?.presentSectionId?.sectionName ||
                            "No Section"}
                        </Tag>
                      </div>

                      {/* Email / Contact */}
                      <div className="flex flex-col w-1/4 truncate text-sm">
                        <span className="truncate">
                          {student?.email || "No email"}
                        </span>
                        <span className="truncate">
                          {student?.contactNumber || "N/A"}
                        </span>
                      </div>

                      {/* Guardian Info */}
                      <div className="flex flex-col w-1/4 truncate text-sm">
                        <span className="truncate">
                          {student?.guardianRelationToStudent || "Guardian No"}
                        </span>
                        <span className="truncate">
                          {student?.guardianContactNumber || "N/A"}
                        </span>
                      </div>

                      {/* See Grade Button */}
                      <div className="flex-shrink-0 w-1/8">
                        <button
                          onClick={() => onSeeGradeClick(student)}
                          className="px-3 py-1 text-green-500 font-semibold text-sm border border-green-500 rounded-md transition-transform transform hover:scale-105 hover:bg-green-50"
                        >
                          See Grade
                        </button>
                      </div>

                      {!student.isGraduate && (
                        <div className="flex-shrink-0 w-1/8 relative">
                          <StudentMenuOptions
                            groupId={group._id}
                            studentName={`${student?.firstName} ${student?.lastName}`}
                            studentId={student._id}
                            student={student}
                          />
                        </div>
                      )}
                      {/* Student Menu (remove from group, etc.) */}
                    </li>
                  ))
                )}
              </motion.ul>
            )}
          </motion.div>
        );
      })}

      {/* Sidebar for editing group */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        title="Update Group"
      >
        <AddGroup
          group={editingGroup}
          isUpdate={!!editingGroup}
          groupId={editingGroup?._id}
          onClose={closeSidebar}
        />
      </Sidebar>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={groupToDelete?.groupName || ""}
      />
    </div>
  );
};

export default GroupList;

/* -------------- GroupListSkeleton -------------- */
const GroupListSkeleton = () => {
  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div key={idx} className="border-b pb-4 animate-pulse">
          {/* Group header skeleton */}
          <div className="flex items-center justify-between py-2 bg-gray-50 px-2 mb-2">
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/6"></div>
          </div>

          {/* Student skeleton lines */}
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-2">
                <div className="flex items-center w-1/4 space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div className="space-y-1">
                    <div className="h-3 w-20 bg-gray-300 rounded"></div>
                    <div className="h-3 w-16 bg-gray-300 rounded"></div>
                  </div>
                </div>
                <div className="flex flex-col w-1/4 space-y-1">
                  <div className="h-3 w-24 bg-gray-300 rounded"></div>
                  <div className="h-3 w-16 bg-gray-300 rounded"></div>
                </div>
                <div className="flex flex-col w-1/4 space-y-1">
                  <div className="h-3 w-24 bg-gray-300 rounded"></div>
                  <div className="h-3 w-16 bg-gray-300 rounded"></div>
                </div>
                <div className="h-6 w-14 bg-gray-300 rounded"></div>
                <div className="h-6 w-6 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
