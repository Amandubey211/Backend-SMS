import React, { useState, useRef, useCallback, useEffect } from "react";
import { TfiStatsUp } from "react-icons/tfi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { BsArrow90DegRight } from "react-icons/bs";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { RiDeleteBin2Line } from "react-icons/ri";
import toast from "react-hot-toast";
import Sidebar from "../../../../Components/Common/Sidebar";
import PromoteClass from "./PromoteClass";
import MoveToSection from "./MoveToSection";
import EditStudent from "./EditStudent";
import DeleteStudent from "./DeleteStudent";

const DetailedStudentList = ({ activeSection, onSeeGradeClick, students }) => {
  const [showMenu, setShowMenu] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState(null);
  const [sidebarTitle, setSidebarTitle] = useState("");
  const menuRef = useRef(null);

  const toggleMenu = useCallback(
    (index) => {
      setShowMenu(showMenu === index ? null : index);
    },
    [showMenu]
  );

  const handleClickOutside = useCallback((event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowMenu(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleMenuItemClick = useCallback((studentId, action) => {
    setShowMenu(null);
    const sidebarComponents = {
      "Promote Class": <PromoteClass studentId={studentId} />,
      "Move to Section": <MoveToSection studentId={studentId} />,
      "Edit Student": <EditStudent studentId={studentId} />,
      "Delete Student": <DeleteStudent studentId={studentId} />,
    };

    handleSidebarOpen(action, sidebarComponents[action]);
  }, []);

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

  const filteredStudents =
    activeSection === "Everyone"
      ? students
      : students.filter((student) => student.section === activeSection);

  return (
    <div className="w-full p-4 bg-white">
      <ul>
        {filteredStudents.map((student, index) => (
          <li
            key={index}
            className="relative flex items-center justify-between py-4 border-b"
          >
            <StudentInfo
              student={student}
              index={index}
              onSeeGradeClick={onSeeGradeClick}
            />
            <MenuButton
              index={index}
              toggleMenu={toggleMenu}
              showMenu={showMenu}
              handleMenuItemClick={handleMenuItemClick}
              studentId={student._id}
            />
          </li>
        ))}
      </ul>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        title={sidebarTitle}
      >
        {sidebarContent}
      </Sidebar>
    </div>
  );
};

const StudentInfo = React.memo(({ student, index, onSeeGradeClick }) => (
  <>
    <div className="flex items-center">
      <img
        src={student.profile || `https://randomuser.me/api/portraits/med/${
          index % 2 === 0 ? "women" : "men"
        }/${index}.jpg`}
        alt={student.name}
        className="w-10 h-10 rounded-full mr-3"
      />
      <div>
        <div className="text-sm font-medium">
          {student?.firstName} {student?.lastName}
        </div>
        <div className="text-xs text-gray-500">{student?._id}</div>
      </div>
    </div>
    <StudentDetails student={student} />
    <button
      className="px-3 py-1 text-green-500 font-semibold text-sm border border-green-500 rounded-lg"
      onClick={() => onSeeGradeClick(student)}
    >
      See Grade
    </button>
  </>
));

const StudentDetails = React.memo(({ student }) => (
  <>
    <div className="flex flex-col gap-1 items-start justify-start">
      <div className="text-sm text-gray-500">Class</div>
      <div className="text-sm text-gray-500">{student?.className || "09"}</div>
    </div>
    <div className="flex flex-col gap-1 items-start justify-center">
      <div className="text-sm text-gray-500">
        {student?.section || "Section"}
      </div>
      <div className="text-sm text-gray-500">{`Group-${
        student?.group || "Accounting"
      }`}</div>
    </div>
    <div className="flex flex-col text-sm gap-1 items-start justify-start">
      <div>{student.email}</div>
      <div>{student.contactNumber}</div>
    </div>
    <div className="flex flex-col text-sm gap-1 items-start justify-start">
      <div>Parent</div>
      <div>{student.guardianContactNumber}</div>
    </div>
  </>
));

const MenuButton = React.memo(
  ({ index, toggleMenu, showMenu, handleMenuItemClick, studentId }) => {
    const menuRef = useRef(null);

    return (
      <>
        <button onClick={() => toggleMenu(index)} className="p-2">
          <HiOutlineDotsVertical />
        </button>
        {showMenu === index && (
          <div
            ref={menuRef}
            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg p-4 z-10 animate-fade-in"
          >
            <ul className="space-y-2">
              <MenuItem
                icon={<TfiStatsUp className="text-[#333333]" />}
                text="Promote Class"
                onClick={() => handleMenuItemClick(studentId, "Promote Class")}
              />
              <MenuItem
                icon={<BsArrow90DegRight />}
                text="Move to Section"
                onClick={() =>
                  handleMenuItemClick(studentId, "Move to Section")
                }
              />
              <MenuItem
                icon={<MdOutlineModeEditOutline className="text-[#0D9755]" />}
                text="Edit Student"
                onClick={() => handleMenuItemClick(studentId, "Edit Student")}
              />
              <MenuItem
                icon={<RiDeleteBin2Line className="text-[#E33131]" />}
                text="Delete Student"
                onClick={() => handleMenuItemClick(studentId, "Delete Student")}
              />
            </ul>
          </div>
        )}
      </>
    );
  }
);

const MenuItem = React.memo(({ icon, text, onClick }) => (
  <li
    className="flex items-center space-x-2 transition-transform duration-200 ease-in-out transform hover:translate-x-1 hover:bg-gray-100 p-2 rounded cursor-pointer"
    onClick={onClick}
  >
    {icon}
    <span>{text}</span>
  </li>
));

export default DetailedStudentList;
