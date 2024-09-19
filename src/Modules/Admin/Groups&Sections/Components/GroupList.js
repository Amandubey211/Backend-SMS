import React, { useState, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LuUser } from "react-icons/lu";
import { GiImperialCrown } from "react-icons/gi";
import { TbDotsVertical } from "react-icons/tb";
import { FaUsers } from "react-icons/fa";
import { deleteGroup } from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import useDeleteModal from "../../../../Hooks/CommonHooks/useDeleteModal";
import DeleteModal from "../../../../Components/Common/DeleteModal";
import AddGroup from "./AddGroup";

const GroupList = ({
  groupList,
  fetchGroups,
  fetchStudents,
  onSeeGradeClick,
}) => {
  const [expandedGroupIndex, setExpandedGroupIndex] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch();
  const { isModalOpen, modalData, openModal, closeModal } = useDeleteModal();

  const handleMenuToggle = (groupIndex) => {
    setActiveMenu((prevActiveMenu) =>
      prevActiveMenu === groupIndex ? null : groupIndex
    );
  };

  const handleEdit = (group) => {
    setEditingGroup(group);
    setIsSidebarOpen(true);
    setActiveMenu(null);
  };

  const handleDelete = (group) => {
    openModal(group);
    setActiveMenu(null);
  };

  const handleDeleteConfirm = async () => {
    await dispatch(deleteGroup(modalData._id));
    closeModal();
    fetchGroups();
    fetchStudents();
  };

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
    setEditingGroup(null);
    fetchGroups();
  }, [fetchGroups]);

  // Filter groups based on search query
  const filteredGroups = groupList.filter((group) =>
    group.groupName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full p-1 bg-white">
      <div className="flex items-center justify-between mb-4 p-2">
        <h2 className="text-lg font-semibold ps-4">
          Groups{" "}
          <span className="text-gray-500">({filteredGroups.length})</span>
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

      {filteredGroups.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500">
          <FaUsers className="text-6xl mb-4" />
          <p>No groups found.</p>
        </div>
      ) : (
        filteredGroups.map((group, groupIndex) => (
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
                  <LuUser />
                  <span className="text-gray-500">
                    Students{" "}
                    <span className="text-gradient">
                      {group?.students?.length || "0"}/
                      {group?.seatLimit || "20"}
                    </span>
                  </span>
                </div>
                <div className="relative">
                  <div
                    className="w-7 h-7 flex items-center justify-center rounded-full border cursor-pointer"
                    onClick={() => handleMenuToggle(groupIndex)}
                  >
                    <TbDotsVertical className="w-6 h-6 text-gray-500" />
                  </div>
                  {activeMenu === groupIndex && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-10">
                      <div
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleEdit(group)}
                      >
                        Edit
                      </div>
                      <div
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleDelete(group)}
                      >
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
                  ></path>
                </svg>
              </div>
            </div>

            {expandedGroupIndex === groupIndex && (
              <ul className="border-t border-gray-200">
                {group.students.length === 0 ? (
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
                          src={student?.profile || ""}
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
                      <div className="flex-shrink-0 w-1/8 relative"></div>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        ))
      )}

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50">
          <div className="bg-white h-full w-full max-w-md shadow-lg p-4 overflow-y-auto">
            <AddGroup
              group={editingGroup}
              isUpdate={!!editingGroup}
              groupId={editingGroup?._id}
              onClose={closeSidebar}
              fetchGroups={fetchGroups}
            />
          </div>
        </div>
      )}
      <DeleteModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
        title={modalData?.groupName || ""}
      />
    </div>
  );
};

export default memo(GroupList);
