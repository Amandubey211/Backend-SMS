import React, { useState, useEffect, useRef } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { BsArrow90DegRight } from "react-icons/bs";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { RiDeleteBin2Line } from "react-icons/ri";
import { LuUser } from "react-icons/lu";
import { GiImperialCrown } from "react-icons/gi";
const groups = [
  {
    name: "English Group",
    members: [
      {
        name: "Floyd Miles",
        email: "raihanafridi@gmail.com",
        role: "Group Leader",
        phone: "(671) 555-0110",
        grade: "See Grade",
      },
      {
        name: "Albert Flores",
        email: "raihanafridi@gmail.com",
        role: "Parent",
        phone: "(671) 555-0110",
        grade: "See Grade",
      },
      {
        name: "Dianne Russell",
        email: "raihanafridi@gmail.com",
        role: "Parent",
        phone: "(671) 555-0110",
        grade: "See Grade",
      },
      {
        name: "Annette Black",
        email: "raihanafridi@gmail.com",
        role: "Parent",
        phone: "(671) 555-0110",
        grade: "See Grade",
      },
    ],
  },
  {
    name: "Accounting",
    members: [
      {
        name: "Jerome Bell",
        email: "raihanafridi@gmail.com",
        role: "Group Leader",
        phone: "(671) 555-0110",
        grade: "See Grade",
      },
      {
        name: "Wade Warren",
        email: "raihanafridi@gmail.com",
        role: "Parent",
        phone: "(671) 555-0110",
        grade: "See Grade",
      },
      {
        name: "Cody Fisher",
        email: "raihanafridi@gmail.com",
        role: "Parent",
        phone: "(671) 555-0110",
        grade: "See Grade",
      },
      {
        name: "Ralph Edwards",
        email: "raihanafridi@gmail.com",
        role: "Parent",
        phone: "(671) 555-0110",
        grade: "See Grade",
      },
    ],
  },
];

const GroupList = () => {
  const [expandedGroupIndex, setExpandedGroupIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(null);
  const menuRef = useRef(null);

  const toggleGroup = (index) => {
    setExpandedGroupIndex(expandedGroupIndex === index ? null : index);
  };

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

  return (
    <div className="w-full max-w-4xl  bg-white ">
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
          <div className={`flex items-center justify-between py-3  bg-gray-50`}>
            <h3
              className="text-lg font-semibold text-gradient ps-2   cursor-pointer"
              onClick={() => toggleGroup(groupIndex)}
            >
              {group.name}
            </h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 border p-1 rounded-full px-4">
                <LuUser />

                <span className="text-gray-500 ">
                  Students <span className="text-gradient"> 5/20</span>
                </span>
              </div>
              <svg
                className={`w-7 h-7 text-gray-500 transform p-1 border rounded-full  transition-transform ${
                  expandedGroupIndex === groupIndex ? "rotate-180" : ""
                }`}
                onClick={() => toggleGroup(groupIndex)}
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
            <ul className=" border-t border-gray-200">
              {group.members.map((member, memberIndex) => (
                <li
                  key={memberIndex}
                  className="flex items-center justify-between p-4 border-b  border-gray-200 relative"
                >
                  <div className="flex items-center">
                    <img
                      src={`https://randomuser.me/api/portraits/med/${
                        memberIndex % 2 === 0 ? "men" : "women"
                      }/${memberIndex}.jpg`}
                      alt={member.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <div className="text-sm font-medium">{member.name}</div>

                      {member.role === "Group Leader" && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-medium text-gradient">      {member.role}</span>
                    
                          <span className="text-yellow-500"><GiImperialCrown/></span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col justify-start  items-start text-sm">
                    <span>{member.email}</span>
                    <span>{member.phone}</span>
                  </div>
                  <div className="flex flex-col  justify-start text-sm">
                    <span>parent</span>
                    <span>7700042037</span>
                  </div>
                  <button className="px-3 py-1 text-green-500 font-semibold text-sm border border-green-500 rounded-md">
                    {member.grade}
                  </button>
                  <button
                    onClick={() => toggleMenu(memberIndex)}
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
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default GroupList;
