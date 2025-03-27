import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LuUser } from "react-icons/lu";
import { GiImperialCrown } from "react-icons/gi";
import { TbDotsVertical } from "react-icons/tb";
import { motion } from "framer-motion"; // For smooth expansions
import {
  deleteGroup,
  fetchGroupsByClass,
  fetchUnassignedStudents,
} from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";

import DeleteModal from "../../../../Components/Common/DeleteModal";
import AddGroup from "./AddGroup";
import { useParams } from "react-router-dom";
import Sidebar from "../../../../Components/Common/Sidebar";
import profileIcon from "../../../../Assets/DashboardAssets/profileIcon.png";
import StudentMenuOptions from "../../Students/Components/StudentMenuOptions";
import Spinner from "../../../../Components/Common/Spinner";
import { HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";

const GroupList = ({ onSeeGradeClick }) => {
  const dispatch = useDispatch();
  const { cid } = useParams();

  const [expandedGroupIndex, setExpandedGroupIndex] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);

  const role = useSelector((store) => store.common.auth.role);
  const { groupsList, loading } = useSelector(
    (store) => store.admin.group_section
  );

  const menuRefs = useRef([]);

  // Filter groups by search
  const filteredGroups = groupsList?.filter((group) =>
    group.groupName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close the menu when clicking outside
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

  // Sidebar close
  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setEditingGroup(null);
  };

  // Menu toggles
  const handleMenuToggle = (groupIndex) => {
    setActiveMenu(activeMenu === groupIndex ? null : groupIndex);
  };

  // Edit
  const handleEdit = (group) => {
    setEditingGroup(group);
    setIsSidebarOpen(true);
    setActiveMenu(null);
  };

  // Delete
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

  return (
    <div className="w-full bg-white p-2">
      {/* Search and Title */}
      <div className="flex items-center justify-between mb-4 p-2">
        <h2 className="text-lg font-semibold ps-4">
          Groups{" "}
          <span className="text-gray-500">({filteredGroups?.length || 0})</span>
        </h2>
        <div>
          <input
            type="text"
            placeholder="Search by group name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      {/* If loading or no groups */}
      {loading || filteredGroups?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-72 text-center text-gray-500">
          {loading ? (
            <Spinner />
          ) : (
            <>
              <p className="mb-2">No groups found.</p>
            </>
          )}
        </div>
      ) : (
        filteredGroups.map((group, groupIndex) => {
          const isExpanded = expandedGroupIndex === groupIndex;
          return (
            <motion.div
              key={group._id}
              layout
              initial={{ opacity: 0.6, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-2 border-b"
            >
              {/* Group Header */}
              <div className="flex items-center justify-between py-3 bg-gray-50 px-2">
                <h3
                  className="text-lg font-semibold text-gradient cursor-pointer"
                  onClick={() =>
                    setExpandedGroupIndex(isExpanded ? null : groupIndex)
                  }
                >
                  {group?.groupName || "Group Name"}
                </h3>

                <div className="flex items-center space-x-2 relative">
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
                    <li className="p-4 text-center text-gray-500 italic">
                      No members found in this group.
                    </li>
                  ) : (
                    group.students.map((student, memberIndex) => (
                      <li
                        key={memberIndex}
                        className="flex items-center justify-between p-4 border-b border-gray-200 gap-4"
                      >
                        <div className="flex items-center flex-shrink-0 w-1/4">
                          <img
                            src={student?.profile || profileIcon}
                            alt={student?.firstName || "First"}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <div className="flex flex-col">
                            <div className="text-sm font-medium truncate">
                              {student?.firstName} {student?.lastName || ""}
                            </div>
                            {group.leader === student._id && (
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-medium text-gradient truncate">
                                  Group Leader
                                </span>
                                <span className="text-yellow-500">
                                  <GiImperialCrown />
                                </span>
                              </div>
                            )}
                          </div>
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
                            {student?.guardianRelationToStudent || "N/A"}
                          </span>
                          <span className="truncate">
                            {student?.guardianContactNumber || "N/A"}
                          </span>
                        </div>
                        {/* See Grade Button */}
                        <div className="flex-shrink-0 w-1/8">
                          <button
                            onClick={() => onSeeGradeClick(student)}
                            className="px-3 py-1 text-green-500 font-semibold text-sm border border-green-500 rounded-md"
                          >
                            See Grade
                          </button>
                        </div>
                        {/* Student Menu Options (remove from group, etc.) */}
                        <div className="flex-shrink-0 w-1/8 relative">
                          <StudentMenuOptions
                            groupId={group._id}
                            studentName={`${student?.firstName} ${student?.lastName}`}
                            studentId={student._id}
                            student={student}
                          />
                        </div>
                      </li>
                    ))
                  )}
                </motion.ul>
              )}
            </motion.div>
          );
        })
      )}

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
