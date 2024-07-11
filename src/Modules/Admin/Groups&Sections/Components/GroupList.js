import React, { useState, useEffect, useRef } from "react";
import { LuUser } from "react-icons/lu";
import { GiImperialCrown } from "react-icons/gi";
import SidebarMenu from "../../Students/Components/SidebarMenu";

const GroupList = ({ selectedSection, onSeeGradeClick, groupList }) => {
  const [expandedGroupIndex, setExpandedGroupIndex] = useState(null);

  return (
    <div className="w-full max-w-4xl bg-white">
      <div className="flex items-center justify-between mb-4 p-2">
        <h2 className="text-lg font-semibold ps-4">
          Groups <span className="text-gray-500">({groupList?.length})</span>
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Select Group"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>
      {groupList?.map((group, groupIndex) => (
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
              {group?.groupName || "Aman's Group"} (
              {group?.sectionName || "Section A"})
            </h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 border p-1 rounded-full px-4">
                <LuUser />
                <span className="text-gray-500">
                  Students{" "}
                  <span className="text-gradient">
                    {group?.students?.length || "0"}/{group?.seatLimit || "20"}
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
              {group.students.length === 0 ? (
                <li className="p-4 text-center text-gray-500 italic">
                  No members found in this group.
                </li>
              ) : (
                group.students.map((student, memberIndex) => (
                  <li
                    key={memberIndex}
                    className="flex items-center justify-between p-4 border-b border-gray-200 relative"
                  >
                    <div className="flex items-center">
                      <img
                        src={student?.profile || ""}
                        alt={student?.firstName || "First"}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div className="max-w-xs">
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
                    <div className="flex flex-col justify-start items-start text-sm max-w-xs truncate">
                      <span>{student?.email || "noemail@gmail.com"}</span>
                      <span>{student?.contactNumber || "3456789"}</span>
                    </div>
                    <div className="flex flex-col justify-start text-sm max-w-xs truncate">
                      <span>
                        {student?.guardianRelationToStudent || "Father"}
                      </span>
                      <span>{student?.guardianContactNumber || "456789"}</span>
                    </div>
                    <button
                      onClick={() => onSeeGradeClick(student)}
                      className="px-3 py-1 text-green-500 font-semibold text-sm border border-green-500 rounded-md"
                    >
                      See Grade
                    </button>
                    <SidebarMenu
                      studentId={student._id}
                      onSeeGradeClick={onSeeGradeClick}
                    />
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default GroupList;
