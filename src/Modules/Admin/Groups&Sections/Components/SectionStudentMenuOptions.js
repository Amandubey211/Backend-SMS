import React, { useState, useRef, useEffect, useCallback } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useSelector } from "react-redux";
import { BsArrow90DegRight } from "react-icons/bs";
import Sidebar from "../../../../Components/Common/Sidebar";
import AssignStudent from "./AssignStudent";

const SectionStudentMenuOptions = ({ student }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const { sectionsList } = useSelector((store) => store.admin.group_section);

  // Toggle menu
  const toggleMenu = useCallback(() => {
    setShowMenu(!showMenu);
  }, [showMenu]);

  // Close menu when clicking outside
  const handleClickOutside = useCallback(
    (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    },
    [menuRef, buttonRef]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  // For "Update Section"
  const handleUpdateSection = () => {
    setShowMenu(false);
    setSidebarOpen(true);
  };

  // Show current section name or "No Section Assigned"
  const getSectionName = (sectionId) => {
    const sec = sectionsList.find((s) => s._id === sectionId);
    return sec ? sec.sectionName : "No Section Assigned";
  };

  return (
    <div className="ml-2 relative" style={{ width: "2rem" }}>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="p-1 text-gray-600 hover:text-gray-900"
      >
        <HiOutlineDotsVertical />
      </button>

      {showMenu && (
        <div
          ref={menuRef}
          className="absolute right-0 z-10 bg-white w-40 rounded shadow-lg p-2"
        >
          {/* Update Section item */}
          <div
            className="flex items-center px-2 py-2 cursor-pointer hover:bg-gray-100 text-sm"
            onClick={handleUpdateSection}
          >
            <BsArrow90DegRight className="mr-2" /> Update Section
          </div>
        </div>
      )}

      {/* Sidebar for "Update Section" */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        title="Update Section"
      >
        <AssignStudent
          name={student.firstName}
          section={getSectionName(student.presentSectionId)}
          studentId={student?._id}
          imageUrl={student.profile}
        />
      </Sidebar>
    </div>
  );
};

export default SectionStudentMenuOptions;
