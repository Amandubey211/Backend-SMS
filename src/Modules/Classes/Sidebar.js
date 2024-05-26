import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import classIcons from "../Dashboard/DashboardData/ClassIconData";
import toast from "react-hot-toast";

const Sidebar = ({ isOpen, onClose }) => {
  const [activeIconId, setActiveIconId] = useState(null);
  const [newClassName, setNewClassName] = useState("");
  const [newIcon, setNewIcon] = useState("");
  const handleIconClick = (id) => {
    setActiveIconId(id);
    setNewIcon(id);
  };
  const HandleSubmit = () => {
    console.log(newIcon, newClassName);
  };
  return (
    <div
      className={`fixed top-0 right-0 w-1/3 h-full py-3 px-4 bg-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform`}
    >
      <div className="flex justify-between items-center px-2">
        <h1 className="font-semibold">Add New Class</h1>
        <button onClick={onClose} className="p-1 m-1 opacity-70">
          <RxCross2 className="text-xl" />
        </button>
      </div>
      <div className="flex flex-col h-full">
        <div className="flex flex-col justify-start gap-2 mt-5">
          <div>
            <h5>Class Name</h5>
          </div>
          <div>
            <input
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              type="text"
              placeholder="Type here"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-6 flex-grow">
          <h3>Class icons</h3>
          <div className="flex justify-around gap-4 flex-wrap">
            {classIcons.map((data) => (
              <img
                className={`h-16 p-1 rounded-lg border bg-gradient-to-r transition duration-300 ease-in-out ${
                  activeIconId === data.id
                    ? "from-pink-600 to-purple-600"
                    : "from-transparent to-transparent"
                } hover:from-pink-600 hover:to-purple-600 ${
                  activeIconId === data.id
                    ? "  border-pink-500"
                    : "border-gray-300"
                }`}
                src={data.icon}
                key={data.id}
                onClick={() => handleIconClick(data.id)}
              />
            ))}
          </div>
        </div>
        <div className="mt-auto mb-6">
          <button
            onClick={HandleSubmit}
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
          >
            Add New Class
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
