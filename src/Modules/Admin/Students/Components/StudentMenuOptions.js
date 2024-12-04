import React, { useState, useEffect, useRef, useCallback } from "react";
import Sidebar from "../../../../Components/Common/Sidebar";
import PromoteClass from "./PromoteClass";
import MoveToSection from "./MoveToSection";
import EditStudent from "./EditStudent";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { BsArrow90DegRight } from "react-icons/bs";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { useSelector } from "react-redux";
import { FaGraduationCap } from "react-icons/fa";
import { TfiStatsUp } from "react-icons/tfi";
import { TfiStatsDown } from "react-icons/tfi";
import DeleteModal from "../../../../Components/Common/DeleteModal";
import DemoteClass from "./DemoteClass";
import GraduateStudent from "./GraduateStudent";
import { removeStudentFromGroup } from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
// import { RiDeleteBin2Line } from "react-icons/ri";

const StudentMenuOptions = ({
  studentName,
  studentId,
  student,
  groupId,
  // fetchGroups,
  // fetchStudents,
}) => {
  const [showMenu, setShowMenu] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState(null);
  const [sidebarTitle, setSidebarTitle] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const role = useSelector((store) => store.common.auth.role);

  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleMenu = useCallback(
    (index) => {
      setShowMenu(showMenu === index ? null : index);
    },
    [showMenu]
  );

  const handleClickOutside = useCallback((event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      !buttonRef.current.contains(event.target)
    ) {
      setShowMenu(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleMenuItemClick = useCallback(
    (action) => {
      setShowMenu(null);
      if (action === "Delete Student") {
        setModalOpen(true);
      } else {
        const sidebarComponents = {
          "Promote Class": <PromoteClass student={student} />,
          "Move to Section": (
            <MoveToSection student={student} onClose={handleSidebarClose} />
          ),
          // "Class change": (
          //   <EditStudent
          //     studentId={studentId}
          //     fetchGroups={fetchGroups}
          //     onClose={handleSidebarClose}
          //   />
          // ),
          "Demote Class": <DemoteClass student={student} />,
          "Graduate Student": <GraduateStudent student={student} />,

          // "Edit Student": (
          //   <EditStudent
          //     studentId={studentId}
          //     fetchGroups={fetchGroups}
          //     onClose={handleSidebarClose}
          //   />
          // ),
          // "Delete Student": (
          //   <DeleteStudent studentId={studentId} groupId={groupId} />
          // ),
        };

        handleSidebarOpen(action, sidebarComponents[action]);
      }
    },
    [studentId]
  );

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
      // fetchGroups();
      // fetchStudents();
      setModalOpen(false);
      handleSidebarClose();
    } catch (error) {
      console.error("Error removing student:", error);
    }
  };

  return (
    <>
      {role !== "teacher" && (
        <button
          ref={buttonRef}
          onClick={() => toggleMenu(studentId)}
          className="p-2"
          aria-haspopup="true"
          aria-expanded={showMenu === studentId}
        >
          <HiOutlineDotsVertical />
        </button>
      )}

      {showMenu === studentId && (
        <div
          ref={menuRef}
          className="absolute bg-white w-52 rounded-lg shadow-lg p-4 z-10"
          style={{ right: 0 }}
        >
          <ul className="space-y-2">
            <MenuItem
              icon={<TfiStatsUp className="text-[#333333]" />}
              text="Promote Class"
              onClick={() => handleMenuItemClick("Promote Class")}
            />
            <MenuItem
              icon={<TfiStatsDown className="text-[#E33131]" />}
              text="Demote Class"
              onClick={() => handleMenuItemClick("Demote Class")}
            />
            <MenuItem
              icon={<BsArrow90DegRight />}
              text="Move to Section"
              onClick={() => handleMenuItemClick("Move to Section")}
            />
            {/* <MenuItem
              icon={<MdOutlineModeEditOutline className="text-[#0D9755]" />}
              text="Class change"
              onClick={() => handleMenuItemClick("Class change")}
            /> */}
            <MenuItem
              icon={<FaGraduationCap className="text-yellow-400" />}
              text="Graduate Student"
              onClick={() => handleMenuItemClick("Graduate Student")}
            />
            {/* <MenuItem
              icon={<MdOutlineModeEditOutline className="text-[#0D9755]" />}
              text="Edit Student"
              onClick={() => handleMenuItemClick("Edit Student")}
            /> */}
            {/* <MenuItem
              icon={<RiDeleteBin2Line className="text-[#E33131]" />}
              text="Delete Student"
              onClick={() => handleMenuItemClick("Delete Student")}
            /> */}
          </ul>
        </div>
      )}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        title={sidebarTitle}
      >
        {sidebarContent}
      </Sidebar>
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
    className="flex items-center space-x-2 transition-transform duration-200 ease-in-out transform hover:translate-x-1 hover:bg-gray-100 p-2 rounded cursor-pointer"
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
