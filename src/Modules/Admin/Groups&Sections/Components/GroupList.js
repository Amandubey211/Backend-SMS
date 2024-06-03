import React from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
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
  return (
    <div className="w-full max-w-4xl p-4 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Groups <span className="text-gray-500">(10)</span>
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
        <div key={groupIndex} className="mb-6">
          <div
            className={`flex items-center justify-between py-2 ${
              groupIndex === 0 ? "text-blue-600" : "text-purple-600"
            }`}
          >
            <h3 className="text-lg font-semibold text-purple-500">
              {group.name}
            </h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span className="text-gray-500">Students 5/20</span>
              </div>
              <svg
                className="w-5 h-5 text-gray-500"
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
          <ul className="mt-2 border-t border-gray-200">
            {group.members.map((member, memberIndex) => (
              <li
                key={memberIndex}
                className="flex items-center justify-between py-4 border-b border-gray-200"
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
                    <div className="text-xs text-gray-500">
                      {member.role === "Group Leader" && member.role}
                    </div>
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
                <HiOutlineDotsVertical />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default GroupList;
