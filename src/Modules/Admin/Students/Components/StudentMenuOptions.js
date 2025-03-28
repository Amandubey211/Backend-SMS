import React, { useState, useCallback } from "react";
import { Popover } from "antd"; // <-- Import Popover from 'antd'
import Sidebar from "../../../../Components/Common/Sidebar";
import PromoteClass from "./PromoteClass";
import MoveToSection from "./MoveToSection";
import DemoteClass from "./DemoteClass";
import GraduateStudent from "./GraduateStudent";
import DeleteModal from "../../../../Components/Common/DeleteModal";
import ProtectedAction from "../../../../Routes/ProtectedRoutes/ProtectedAction";
import { removeStudentFromGroup } from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import { useSelector } from "react-redux";
import { PERMISSIONS } from "../../../../config/permission";

import { HiOutlineDotsVertical } from "react-icons/hi";
import { BsArrow90DegRight } from "react-icons/bs";
import { FaGraduationCap } from "react-icons/fa";
import { TfiStatsUp } from "react-icons/tfi";
import { TfiStatsDown } from "react-icons/tfi";

const StudentMenuOptions = ({ studentName, studentId, student, groupId }) => {
  const role = useSelector((store) => store.common.auth.role);

  // Popover visibility
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Sidebar states
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState(null);
  const [sidebarTitle, setSidebarTitle] = useState("");

  // Delete modal states
  const [isModalOpen, setModalOpen] = useState(false);

  // -------------- Handlers --------------
  const handleSidebarOpen = (title, content) => {
    setSidebarTitle(title);
    setSidebarContent(content);
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
    setSidebarContent(null);
    setSidebarTitle("");
  };

  const handleDeleteConfirm = async () => {
    try {
      await removeStudentFromGroup(studentId, groupId);
      setModalOpen(false);
      handleSidebarClose();
    } catch (error) {
      console.error("Error removing student:", error);
    }
  };

  const handleMenuItemClick = useCallback(
    (action) => {
      // Close popover when an item is clicked
      setIsPopoverOpen(false);

      // Decide which sidebar content to open or which action to trigger
      if (action === "Delete Student") {
        setModalOpen(true);
      } else {
        const sidebarComponents = {
          "Promote Class": <PromoteClass student={student} />,
          "Move to Section": (
            <MoveToSection student={student} onClose={handleSidebarClose} />
          ),
          "Demote Class": <DemoteClass student={student} />,
          "Graduate Student": <GraduateStudent student={student} />,
        };

        handleSidebarOpen(action, sidebarComponents[action]);
      }
    },
    [student]
  );

  // -------------- Popover Content --------------
  const menuContent = (
    <div className="min-w-[180px]">
      <ul className="space-y-1">
        {/* 
          If the student is already graduated, show a simple placeholder text.
          Otherwise, show the other menu options.
        */}
        {student?.isGraduate ? (
          <div className="p-2 text-sm text-gray-500">
            This student is graduated
          </div>
        ) : (
          <>
            <ProtectedAction requiredPermission={PERMISSIONS.PROMOTE_STUDENT}>
              <MenuItem
                icon={<TfiStatsUp className="text-[#333333]" />}
                text="Promote Class"
                onClick={() => handleMenuItemClick("Promote Class")}
              />
            </ProtectedAction>
            <ProtectedAction requiredPermission={PERMISSIONS.DEMOTE_STUDENT}>
              <MenuItem
                icon={<TfiStatsDown className="text-[#E33131]" />}
                text="Demote Class"
                onClick={() => handleMenuItemClick("Demote Class")}
              />
            </ProtectedAction>
            <ProtectedAction
              requiredPermission={PERMISSIONS.ASSIGN_STUDENT_TO_SECTION}
            >
              <MenuItem
                icon={<BsArrow90DegRight />}
                text="Move to Section"
                onClick={() => handleMenuItemClick("Move to Section")}
              />
            </ProtectedAction>
            <ProtectedAction requiredPermission={PERMISSIONS.GRADUATE_STUDENT}>
              <MenuItem
                icon={<FaGraduationCap className="text-yellow-400" />}
                text="Graduate Student"
                onClick={() => handleMenuItemClick("Graduate Student")}
              />
            </ProtectedAction>
          </>
        )}
      </ul>
    </div>
  );

  return (
    <>
      <Popover
        content={menuContent}
        trigger="click"
        placement="bottomLeft"
        open={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
      >
        <button
          className="p-2 "
          aria-haspopup="true"
          aria-expanded={isPopoverOpen}
        >
          <HiOutlineDotsVertical />
        </button>
      </Popover>

      {/* Sidebar for Promote/Demote/Move etc. */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        title={sidebarTitle}
      >
        {sidebarContent}
      </Sidebar>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={studentName || "Student"}
      />
    </>
  );
};

const MenuItem = React.memo(({ icon, text, onClick }) => (
  <li
    className="flex items-center space-x-2 py-2 px-3 rounded-md cursor-pointer
               hover:bg-gray-100 transition-colors duration-200 ease-in-out"
    onClick={onClick}
    role="menuitem"
    tabIndex={0}
    onKeyDown={(e) => e.key === "Enter" && onClick()}
  >
    {icon}
    <span>{text}</span>
  </li>
));

export default StudentMenuOptions;
