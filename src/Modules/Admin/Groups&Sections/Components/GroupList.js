import React, { useState, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LuUser } from "react-icons/lu";
import { GiImperialCrown } from "react-icons/gi";
import { TbDotsVertical } from "react-icons/tb";
import { FaUsers } from "react-icons/fa";
import { HiOutlineTrash, HiOutlinePencilAlt } from "react-icons/hi"; // Modern edit and delete icons
import {
  deleteGroup,
  fetchGroupsByClass,
  fetchUnassignedStudents,
} from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import DeleteModal from "../../../../Components/Common/DeleteModal";
import AddGroup from "./AddGroup";
import { BsThreeDotsVertical } from "react-icons/bs";
import Spinner from "../../../../Components/Common/Spinner";
import { useParams } from "react-router-dom";
import Sidebar from "../../../../Components/Common/Sidebar";
import profileIcon from "../../../../Assets/DashboardAssets/profileIcon.png";
import StudentMenuOptions from "../../Students/Components/StudentMenuOptions";

const GroupList = ({ onSeeGradeClick }) => {
  const [expandedGroupIndex, setExpandedGroupIndex] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);
  const role = useSelector((store) => store.common.auth.role);

  const dispatch = useDispatch();
  const { cid } = useParams();
  const { groupsList, loading, error } = useSelector(
    (store) => store.admin.group_section
  );

  const menuRefs = useRef([]); // Reference for each menu

  const handleMenuToggle = (groupIndex) => {
    setActiveMenu((prevActiveMenu) =>
      prevActiveMenu === groupIndex ? null : groupIndex
    );
  };

  const handleEdit = (group) => {
    setEditingGroup(group); // Set the selected group to be edited
    setIsSidebarOpen(true); // Open the sidebar for editing
  };

  // Trigger modal for confirming group deletion
  const handleDeleteClick = (group) => {
    setGroupToDelete(group); // Set the group to be deleted
    setIsDeleteModalOpen(true); // Open the delete modal
  };

  const handleDeleteConfirm = async () => {
    dispatch(deleteGroup(groupToDelete?._id));
    dispatch(fetchUnassignedStudents(cid));
    dispatch(fetchGroupsByClass(cid)); // Refetch groups after deletion
    setIsDeleteModalOpen(false);
    setGroupToDelete(null);
  };

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
    setEditingGroup(null);
  }, [dispatch]);

  // Filter groups based on search query
  const filteredGroups = groupsList.filter((group) =>
    group.groupName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRefs.current) {
        const isClickedOutside = menuRefs.current.every(
          (menuRef, idx) => menuRef && !menuRef.contains(event.target)
        );
        if (isClickedOutside) {
          setActiveMenu(null); // Close the menu
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full p-1 bg-white">
      <div className="flex items-center justify-between mb-4 p-2">
        <h2 className="text-lg font-semibold ps-4">
          Groups{" "}
          <span className="text-gray-500">({filteredGroups?.length})</span>
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by group name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>
      {loading || filteredGroups?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-center text-gray-500">
          {loading ? (
            <Spinner />
          ) : (
            <>
              <FaUsers className="text-8xl mb-1 text-pink-400" />{" "}
              {/* Colored Icon */}
              <p>No groups found.</p>
            </>
          )}
        </div>
      ) : (
        filteredGroups?.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-2">
            <div className="flex items-center justify-between py-3 bg-gray-50">
              <h3
                className="text-lg font-semibold text-gradient ps-2 cursor-pointer"
                onClick={() =>
                  setExpandedGroupIndex((prevExpandedGroupIndex) =>
                    prevExpandedGroupIndex === groupIndex ? null : groupIndex
                  )
                }
              >
                {group?.groupName || "Group Name"}
              </h3>
              <div className="flex items-center space-x-2 relative">
                <div className="flex items-center space-x-1 border p-1 rounded-full px-4">
                  <LuUser className="text-green-500" /> {/* Colored Icon */}
                  <span className="text-gray-500">
                    Students{" "}
                    <span className="text-gradient">
                      {group?.students?.length || "0"}/
                      {group?.seatLimit || "20"}
                    </span>
                  </span>
                </div>

                <div
                  className="relative"
                  ref={(el) => (menuRefs.current[groupIndex] = el)} // Attach reference to each group
                >
                  <div
                    className={`w-7 h-7 flex items-center justify-center rounded-full border cursor-pointer ${
                      activeMenu === groupIndex ? "bg-blue-100" : ""
                    }`} // Add active state style here
                    onClick={() => handleMenuToggle(groupIndex)}
                  >
                    <TbDotsVertical
                      className={`w-6 h-6 ${
                        activeMenu === groupIndex
                          ? "text-blue-500" // Active state color
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
                        <HiOutlinePencilAlt className="text-blue-500 mr-2" />{" "}
                        {/* Colored Edit Icon */}
                        Edit
                      </div>
                      <div
                        className="px-4 py-2 flex items-center text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleDeleteClick(group)}
                      >
                        <HiOutlineTrash className="text-red-500 mr-2" />{" "}
                        {/* Colored Delete Icon */}
                        Delete
                      </div>
                    </div>
                  )}
                </div>

                <svg
                  className={`w-7 h-7 text-gray-500 transform p-1 border rounded-full transition-transform ${
                    expandedGroupIndex === groupIndex ? "rotate-180" : ""
                  }`}
                  onClick={() =>
                    setExpandedGroupIndex((prevExpandedGroupIndex) =>
                      prevExpandedGroupIndex === groupIndex ? null : groupIndex
                    )
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

            {expandedGroupIndex === groupIndex && (
              <ul className="border-t border-gray-200">
                {group.students?.length === 0 ? (
                  <li className="p-4 text-center text-gray-500 italic">
                    No members found in this group.
                  </li>
                ) : (
                  group?.students?.map((student, memberIndex) => (
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
                            {student?.firstName} {student?.lastName || "Last"}
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
                      <div className="flex flex-col w-1/4 truncate text-sm">
                        <span className="truncate">
                          {student?.email || "noemail@gmail.com"}
                        </span>
                        <span className="truncate">
                          {student?.contactNumber || "3456789"}
                        </span>
                      </div>
                      <div className="flex flex-col w-1/4 truncate text-sm">
                        <span className="truncate">
                          {student?.guardianRelationToStudent || "Father"}
                        </span>
                        <span className="truncate">
                          {student?.guardianContactNumber || "456789"}
                        </span>
                      </div>
                      <div className="flex-shrink-0 w-1/8">
                        <button
                          onClick={() => onSeeGradeClick(student)}
                          className="px-3 py-1 text-green-500 font-semibold text-sm border border-green-500 rounded-md"
                        >
                          See Grade
                        </button>
                      </div>
                      {/* {role === "admin" && (
                        <div className="flex-shrink-0 w-1/8 relative">
                          <BsThreeDotsVertical />
                        </div>
                      )} */}
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
              </ul>
            )}
          </div>
        ))
      )}

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
