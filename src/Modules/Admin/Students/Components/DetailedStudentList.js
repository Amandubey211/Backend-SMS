import React, { useState, useEffect, useRef } from "react";
import { TfiStatsUp } from "react-icons/tfi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { BsArrow90DegRight } from "react-icons/bs";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { RiDeleteBin2Line } from "react-icons/ri";
import useGetStudentsByClassAndSection from "../../../../Hooks/AuthHooks/Staff/Admin/Students/useGetStudentsByClassAndSection";
import { useParams } from "react-router-dom";

const DetailedStudentList = ({ activeSection, onSeeGradeClick }) => {
  const [showMenu, setShowMenu] = useState(null);
  const menuRef = useRef(null);
  const [students, setStudents] = useState([]);

  const { fetchStudentsByClassAndSection } = useGetStudentsByClassAndSection();
  const { cid } = useParams();

  useEffect(() => {
    const fetchStudents = async () => {
      if (cid) {
        const data = await fetchStudentsByClassAndSection(cid);
        setStudents(data);
      }
    };

    fetchStudents();
  }, [cid, fetchStudentsByClassAndSection]);

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
    <div className="w-full p-4 bg-white ">
      <ul className="">
        {filteredStudents.map((student, index) => (
          <li
            key={index}
            className="relative flex items-center justify-between py-4 border-b"
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
                <div className="text-sm font-medium">{student?.firstName} {student?.lastName}</div>
                <div className="text-xs text-gray-500">{student?._id}</div>
              </div>
            </div>

            <div className="flex flex-col gap-1 items-start justify-start ">
              <div className="text-sm text-gray-500">Class</div>
              <div className="text-sm text-gray-500">
                {student?.class || "09"}
              </div>
            </div>
            <div className="flex flex-col gap-1 items-start justify-center ">
              <div className="text-sm text-gray-500">
                {student?.section || "Section"}
              </div>
              <div className="text-sm text-gray-500">{`Group-${
                student?.group || "Accounting"
              } `}</div>
            </div>

            <div className="flex flex-col text-sm gap-1 items-start justify-start ">
              <div>{student.email}</div>
              <div>{student.contactNumber}</div>
            </div>

            <div className="flex flex-col text-sm gap-1 items-start justify-start ">
              <div>Parent</div>
              <div>{student.guardianContactNumber}</div>
            </div>
            <button
              className="px-3 py-1 text-green-500 font-semibold text-sm border border-green-500 rounded-lg"
              onClick={() => onSeeGradeClick(student)}
            >
              See Grade
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
