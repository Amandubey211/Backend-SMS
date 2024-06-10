import React, { useState, useEffect, useRef } from "react";
import { TfiStatsUp } from "react-icons/tfi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { BsArrow90DegRight } from "react-icons/bs";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { RiDeleteBin2Line } from "react-icons/ri";

const students = [
  {
    name: "Courtney Henry",
    class: "09",
    section: "Section 1",
    group: "Accounting",
    email: "raihanafridi@gmail.com",
    role: "Parent",
    phone: "(671) 555-0110",
    grade: "See Grade",
    id: "ID - 001",
  },
  {
    name: "Darrell Steward",
    class: "09",
    section: "Section 1",
    group: "Accounting",
    email: "raihanafridi@gmail.com",
    role: "Parent",
    phone: "(671) 555-0110",
    grade: "See Grade",
    id: "ID - 001",
  },
  {
    name: "Ronald Richards",
    class: "09",
    section: "Section 2",
    group: "Accounting",
    email: "raihanafridi@gmail.com",
    role: "Parent",
    phone: "(671) 555-0110",
    grade: "See Grade",
    id: "ID - 001",
  },
  {
    name: "Jane Cooper",
    class: "09",
    section: "Section 2",
    group: "Accounting",
    email: "raihanafridi@gmail.com",
    role: "Parent",
    phone: "(671) 555-0110",
    grade: "See Grade",
    id: "ID - 001",
  },
  {
    name: "Brooklyn Simmons",
    class: "09",
    section: "Section 3",
    group: "Accounting",
    email: "raihanafridi@gmail.com",
    role: "Parent",
    phone: "(671) 555-0110",
    grade: "See Grade",
    id: "ID - 001",
  },
  {
    name: "Annette Black",
    class: "09",
    section: "Section 3",
    group: "Accounting",
    email: "raihanafridi@gmail.com",
    role: "Parent",
    phone: "(671) 555-0110",
    grade: "See Grade",
    id: "ID - 001",
  },
  {
    name: "Devon Lane",
    class: "09",
    section: "Section 4",
    group: "Accounting",
    email: "raihanafridi@gmail.com",
    role: "Parent",
    phone: "(671) 555-0110",
    grade: "See Grade",
    id: "ID - 001",
  },
  {
    name: "Wade Warren",
    class: "09",
    section: "Section 4",
    group: "Accounting",
    email: "raihanafridi@gmail.com",
    role: "Parent",
    phone: "(671) 555-0110",
    grade: "See Grade",
    id: "ID - 001",
  },
];

const DetailedStudentList = ({ activeSection }) => {
  const [showMenu, setShowMenu] = useState(null);
  const menuRef = useRef(null);

  const toggleMenu = (index) => {
    setShowMenu(showMenu === index ? null : index);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowMenu(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredStudents =
    activeSection === "Everyone"
      ? students
      : students.filter((student) => student.section === activeSection);

  return (
    <div className="w-full  p-4 bg-white ">
      <ul className="divide-y divide-gray-200">
        {filteredStudents.map((student, index) => (
          <li
            key={index}
            className="relative flex items-center justify-between py-4"
          >
            <div className="flex items-center">
              <img
                src={`https://randomuser.me/api/portraits/med/${
                  index % 2 === 0 ? "women" : "men"
                }/${index}.jpg`}
                alt={student.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <div className="text-sm font-medium">{student.name}</div>
                <div className="text-xs text-gray-500">{student.id}</div>
              </div>
            </div>
            <div className="text-sm text-gray-500">{`Class ${student.class}`}</div>
            <div className="text-sm text-gray-500">{student.section}</div>
            <div className="text-sm text-gray-500">{student.group}</div>
            <div className="text-sm">
              <div>{student.email}</div>
              <div>{student.phone}</div>
            </div>
            <div className="text-sm text-gray-500">{student.role}</div>
            <button className="px-3 py-1 text-green-500 font-semibold text-sm border border-green-500 rounded-full">
              {student.grade}
            </button>
            <button onClick={() => toggleMenu(index)} className="p-2">
              <HiOutlineDotsVertical />
            </button>
            {showMenu === index && (
              <div
                ref={menuRef}
                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg p-4 z-10 animate-fade-in"
              >
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <TfiStatsUp className="text-[#333333]" />
                    <span>Promote Class</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <BsArrow90DegRight />
                    <span>Move to Section</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <MdOutlineModeEditOutline className="text-[#0D9755]" />
                    <span>Edit student</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <RiDeleteBin2Line className="text-[#E33131]" />
                    <span>Delete Student</span>
                  </li>
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DetailedStudentList;
