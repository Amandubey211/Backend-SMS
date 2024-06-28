import React, { useState, useEffect, useRef } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { BsArrow90DegRight } from "react-icons/bs";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { RiDeleteBin2Line } from "react-icons/ri";
import { LuUser } from "react-icons/lu";
import { GiImperialCrown } from "react-icons/gi";
import { useSelector } from "react-redux";

const GroupList = ({ selectedSection }) => {
  const [expandedGroupIndex, setExpandedGroupIndex] = useState(null);
  const [showMenu, setShowMenu] = useState(null);
  const menuRef = useRef(null);
  const AllSections = useSelector((store) => store.Class.sectionsList);

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

  const getGroups = () => {
    if (selectedSection === "Everyone") {
      return AllSections.flatMap((section) =>
        section.groups.map((group) => ({
          ...group,
          sectionName: section.sectionName,
        }))
      );
    } else {
      const section = AllSections.find(
        (sec) => sec.sectionName === selectedSection
      );
      return section
        ? section.groups.map((group) => ({
            ...group,
            sectionName: section.sectionName,
          }))
        : [];
    }
  };

  const groups = getGroups();

  return (
    <div className="w-full max-w-4xl bg-white">
      <div className="flex items-center justify-between mb-4 p-2">
        <h2 className="text-lg font-semibold ps-4">
          Groups <span className="text-gray-500">({groups.length})</span>
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Select Group"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>
      {groups.map((group, groupIndex) => (
        <div key={groupIndex} className="mb-2">
          <div className={`flex items-center justify-between py-3 bg-gray-50`}>
            <h3
              className="text-lg font-semibold text-gradient ps-2 cursor-pointer"
              onClick={() =>
                setExpandedGroupIndex(
                  expandedGroupIndex === groupIndex ? null : groupIndex
                )
              }
            >
              {group.groupName} ({group.sectionName})
            </h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 border p-1 rounded-full px-4">
                <LuUser />
                <span className="text-gray-500">
                  Students{" "}
                  <span className="text-gradient">
                    {group.students.length}/{group.seatLimit}
                  </span>
                </span>
              </div>
              <svg
                className={`w-7 h-7 text-gray-500 transform p-1 border rounded-full transition-transform ${
                  expandedGroupIndex === groupIndex ? "rotate-180" : ""
                }`}
                onClick={() =>
                  setExpandedGroupIndex(
                    expandedGroupIndex === groupIndex ? null : groupIndex
                  )
                }
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
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
              {[...group.students]
                .sort((a, b) =>
                  a === group.leader ? -1 : b === group.leader ? 1 : 0
                )
                .map((studentId, memberIndex) => {
                  const student = AllSections.flatMap(
                    (section) => section.students
                  ).find((student) => student._id === studentId);
                  return (
                    <li
                      key={memberIndex}
                      className="flex items-center justify-between p-4 border-b border-gray-200 relative"
                    >
                      <div className="flex items-center">
                        <img
                          src={
                            student?.profile ||
                            `https://randomuser.me/api/portraits/med/${
                              memberIndex % 2 === 0 ? "men" : "women"
                            }/${memberIndex}.jpg`
                          }
                          alt={student?.firstName || "First"}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div className="max-w-xs">
                          <div className="text-sm font-medium truncate">
                            {student?.firstName} {student?.lastName || "Last"} 
                          </div>
                          {group.leader === studentId && (
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
                      <div className="flex flex-col justify-start items-start text-sm max-w-xs truncate">
                        <span>{student?.email || "noemail@gmail.com"}</span>
                        <span>{student?.contactNumber || "3456789"}</span>
                      </div>
                      <div className="flex flex-col justify-start text-sm max-w-xs truncate">
                        <span>{student?.guardianRelationToStudent || "Father"}</span>
                        <span>{student?.guardianContactNumber || "456789"}</span>
                      </div>
                      <button className="px-3 py-1 text-green-500 font-semibold text-sm border border-green-500 rounded-md">
                        See Grade
                      </button>
                      <button
                        onClick={() => setShowMenu(memberIndex)}
                        className="p-2"
                      >
                        <HiOutlineDotsVertical />
                      </button>
                      {showMenu === memberIndex && (
                        <div
                          ref={menuRef}
                          className="absolute right-0 top-full mt-2 w-52 bg-white rounded-lg shadow-lg p-4 z-10 animate-fade-in"
                        >
                          <ul className="space-y-2">
                            <li className="flex items-center space-x-2">
                              <GiImperialCrown className="text-orange-300" />
                              <span>Group Leader</span>
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
                              <span>Remove From Group</span>
                            </li>
                          </ul>
                        </div>
                      )}
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default GroupList;
