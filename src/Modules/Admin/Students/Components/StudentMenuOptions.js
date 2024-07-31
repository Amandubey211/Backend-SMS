import React, { useState, useEffect, useRef, useCallback } from "react";
import Sidebar from "../../../../Components/Common/Sidebar";
import PromoteClass from "./PromoteClass";
import MoveToSection from "./MoveToSection";
import EditStudent from "./EditStudent";
import DeleteStudent from "./DeleteStudent";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { BsArrow90DegRight } from "react-icons/bs";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { RiDeleteBin2Line } from "react-icons/ri";
import { TfiStatsUp } from "react-icons/tfi";

const StudentMenuOptions = ({ studentId, onSeeGradeClick }) => {
  const [showMenu, setShowMenu] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState(null);
  const [sidebarTitle, setSidebarTitle] = useState("");
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
      const sidebarComponents = {
        "Promote Class": <PromoteClass studentId={studentId} />,
        "Move to Section": <MoveToSection studentId={studentId} />,
        "Edit Student": <EditStudent studentId={studentId} />,
        "Delete Student": <DeleteStudent studentId={studentId} />,
      };

      handleSidebarOpen(action, sidebarComponents[action]);
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

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => toggleMenu(studentId)}
        className="p-2"
        aria-haspopup="true"
        aria-expanded={showMenu === studentId}
      >
        <HiOutlineDotsVertical />
      </button>
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
              icon={<BsArrow90DegRight />}
              text="Move to Section"
              onClick={() => handleMenuItemClick("Move to Section")}
            />
            <MenuItem
              icon={<MdOutlineModeEditOutline className="text-[#0D9755]" />}
              text="Edit Student"
              onClick={() => handleMenuItemClick("Edit Student")}
            />
            <MenuItem
              icon={<RiDeleteBin2Line className="text-[#E33131]" />}
              text="Delete Student"
              onClick={() => handleMenuItemClick("Delete Student")}
            />
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
